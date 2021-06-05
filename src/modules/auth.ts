import { reactive, toRefs, computed } from 'vue'
import { api } from 'boot/axios'

interface User {
  id: string;
  email: string;
  token: string;
  full_name: string;
  position: string;
}

interface AuthState {
  isLoading: boolean;
  user?: User;
}

interface LoginPayload {
  email: string;
  password: string;
}

const state = reactive<AuthState>({
  isLoading: false,
  user: undefined
})

const userInfo = computed<User | undefined>(() => state?.user)

const userRoles = computed<string | undefined>(() => state?.user?.position)

const isLoggedIn = computed<boolean>(() => !!state?.user || !!localStorage.getItem('token'))

const token = localStorage.getItem('token')

if (token) {
  console.log('auth start')
  void api.post('/user/loginbytoken', {
    token
  })
    .then((data) => {
      state.user = data.data as User;
    })
    .catch(() => {
      const { logout } = useAuth()
      void logout();
    })
    .finally(() => {
      console.log('auth stop')
    })
}
export const useAuth = () => {
  const auth = (payload: LoginPayload): Promise<User | PromiseRejectionEvent> => {
    return api.post('/user/login', payload)
      .then((data) => {
        const user = data.data as User;
        setUser(user)
        api.defaults.headers = {
          common: {
            Authorization: `Bearer ${user.token}`
          }
        }
        return Promise.resolve(user)
      })
      .catch(() => {
        localStorage.removeItem('token')
        return Promise.reject()
      })
  }

  const setUser = (payload: User): void => {
    localStorage.setItem('token', payload.token)
    state.user = payload
  }

  const logout = (): Promise<void> => {
    localStorage.removeItem('token')
    location.reload();
    return Promise.resolve(state.user = undefined)
  }

  const hasPermisson = (role: string[]): boolean => {
    if (!!state?.user?.position) {
      return role.includes(state?.user?.position)
    }
    return false
  }

  const visibleColumnsUsers = (): string[] => {
    const visibleColumns = ['id', 'full_name', 'position', 'email', 'phone']
    if (hasPermisson(['директор'])) {
      visibleColumns.push('salary')
    }
    return visibleColumns
  }
  const visibleColumnsFacilities = (): string[] => {
    const visibleColumns = ['id', 'name', 'legal_address', 'actual_address', 'phone', 'email', 'representative_name', 'client']
    if (hasPermisson(['директор'])) {
      visibleColumns.push('monthly_fee')
    }
    return visibleColumns
  }

  return {
    setUser,
    logout,
    auth,
    userInfo,
    userRoles,
    hasPermisson,
    visibleColumnsUsers,
    visibleColumnsFacilities,
    isLoggedIn,
    ...toRefs(state)
  }
}
