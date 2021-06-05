import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface Company {
    id: number,
    name: string,
    legal_address: string,
    actual_address: string,
    phone: string,
    email: string,
    representative_name: string,
}

interface CompanyState {
    isLoading: boolean;
    isCurrentLoading: boolean;
    company: Company;
}

const state = reactive<CompanyState>({
    isLoading: false,
    isCurrentLoading: false,
    company: {
        id: 1,
        name: '',
        legal_address: '',
        actual_address: '',
        phone: '',
        email: '',
        representative_name: '',
    },
})

export const useCompany = () => {
    const getCompany = (): void => {
        state.isLoading = true;
        api.get('/company/get')
            .then((data) => {
                state.company = data.data as Company
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    const updateCompany = (): void => {
        state.isLoading = true;
        api.post('/company/update', { ...state.company })
            .then((data) => {
                state.company = data.data as Company
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    return {
        getCompany,
        updateCompany,
        ...toRefs(state),
    }
}