import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface School {
    id: number,
    name: string,
    address: string,
}

interface SchoolState {
    isLoading: boolean;
    isCurrentLoading: boolean;
    school: School;
}

const state = reactive<SchoolState>({
    isLoading: false,
    isCurrentLoading: false,
    school: {
        id: 1,
        name: '',
        address: '',
    },
})

export const useSchool = () => {
    const getSchool = (): void => {
        state.isLoading = true;
        api.get('/school/get')
            .then((data) => {
                state.school = data.data as School
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    const updateSchool = (): void => {
        state.isLoading = true;
        api.post('/school/update', { ...state.school })
            .then((data) => {
                state.school = data.data as School
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    return {
        getSchool,
        updateSchool,
        ...toRefs(state),
    }
}