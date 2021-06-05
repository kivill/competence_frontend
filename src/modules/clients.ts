import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface Client {
  id?: number,
  name: string,
  legal_address: string,
  actual_address: string,
  phone: string,
  email: string,
  representative_name: string,
}

interface ClientState {
  isLoading: boolean;
  isCurrentLoading: boolean;
  clients?: Client[];
  currentClients?: Client;
}

const state = reactive<ClientState>({
  isLoading: false,
  isCurrentLoading: false,
  clients: undefined,
  currentClients: undefined,
})

export const useClients = () => {
  const getClients = (): void => {
    state.isLoading = true;
    api.get('/clients/get')
      .then((data) => {
        state.clients = data.data as Array<Client>
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const setCurrentClient = (user: Client): void => {
    state.isCurrentLoading = true;
    api.get(`/clients/get/${user.id || ''}`)
      .then((data) => {
        state.currentClients = data.data as Client
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isCurrentLoading = false;
      })
  }

  const setCurrentClientEmpty = (): void => {
    state.currentClients = {
      name: '',
      legal_address: '',
      actual_address: '',
      phone: '',
      email: '',
      representative_name: '',
    }
  }

  const saveCurrentClient = (): void => {
    if (!state.currentClients?.id) {
      state.isLoading = true;
      api.post('/clients/create', state.currentClients)
        .then(() => {
          getClients();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    } else {
      state.isLoading = true;
      api.post(`/clients/update/${state.currentClients.id}`, state.currentClients)
        .then(() => {
          getClients();
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
    getClients,
    setCurrentClient,
    setCurrentClientEmpty,
    saveCurrentClient,
    ...toRefs(state),
  }
}
