import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface Facility {
  id?: number,
  name: string,
  legal_address: string,
  actual_address: string,
  phone: string,
  email: string,
  representative_name: string,
  monthly_fee: number,
  client?: {
    name: string;
  }
}

interface FacilityState {
  isLoading: boolean;
  isCurrentLoading: boolean;
  facility?: Facility[];
  currentFacility?: Facility;
}

const state = reactive<FacilityState>({
  isLoading: false,
  isCurrentLoading: false,
  facility: undefined,
  currentFacility: undefined,
})

export const useFacilities = () => {
  const getFacilities = (): void => {
    state.isLoading = true;
    api.get('/facilities/get')
      .then((data) => {
        state.facility = data.data as Array<Facility>
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const setCurrentFacility = (user: Facility): void => {
    state.isCurrentLoading = true;
    api.get(`/facilities/get/${user.id || ''}`)
      .then((data) => {
        state.currentFacility = data.data as Facility
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isCurrentLoading = false;
      })
  }

  const setCurrentFacilityEmpty = (): void => {
    state.currentFacility = {
      name: '',
      legal_address: '',
      actual_address: '',
      phone: '',
      email: '',
      representative_name: '',
      monthly_fee: 0,
    }
  }

  const saveCurrentFacility = (): void => {
    if (!state.currentFacility?.id) {
      state.isLoading = true;
      api.post('/facilities/create', state.currentFacility)
        .then(() => {
          getFacilities();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    } else {
      state.isLoading = true;
      api.post(`/facilities/update/${state.currentFacility.id}`, state.currentFacility)
        .then(() => {
          getFacilities();
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
    getFacilities,
    setCurrentFacility,
    setCurrentFacilityEmpty,
    saveCurrentFacility,
    ...toRefs(state),
  }
}
