import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface User {
  id?: string,
  full_name: string,
  email: string,
  role: string;
  password?: string,
}

interface UserState {
  isLoading: boolean;
  isCurrentLoading: boolean;
  users?: User[];
  currentUser?: User;
}

const state = reactive<UserState>({
  isLoading: false,
  isCurrentLoading: false,
  users: undefined,
  currentUser: undefined,
})

export const useUsers = () => {
  const getUsers = (): void => {
    state.isLoading = true;
    api.get('/user/get')
      .then((data) => {
        state.users = data.data as Array<User>
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const setCurrentUser = (userId: string): void => {
    state.isCurrentLoading = true;
    api.get(`/user/get/${userId || ''}`)
      .then((data) => {
        state.currentUser = data.data as User
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isCurrentLoading = false;
      })
  }

  const setCurrentUserEmpty = (): void => {
    state.currentUser = {
      full_name: '',
      email: '',
      role: '',
      password: '',
    }
  }

  const saveCurrentUser = (): void => {
    if (!state.currentUser?.id) {
      state.isLoading = true;
      api.post('/user/create', state.currentUser)
        .then(() => {
          getUsers();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    } else {
      state.isLoading = true;
      api.post(`/user/update/${state.currentUser.id}`, state.currentUser)
        .then(() => {
          getUsers();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    }
  }

  return {
    getUsers,
    setCurrentUser,
    setCurrentUserEmpty,
    saveCurrentUser,
    ...toRefs(state),
  }
}
