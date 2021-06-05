import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface Pagination {
    page?: number,
    rowsPerPage?: number,
    rowsNumber?: number
}

interface PaginationProp {
    pagination: Pagination
}

interface ServerAns extends Pagination {
    results: WorkOrder[],
}

interface WorkOrder {
    id?: number,
    status: string,
    deadline_at: Date,
    solution_description: string,
    user_id?: number,
    ticket_id?: number,
}


interface Ticket {
    id?: number,
    facility_id?: number,
    company_id: number,
    status: string,
    desctiption: string,
    urgency: string,
}

interface Filter {
    appId?: string[],
    from?: Date,
    to?: Date,
}

interface WorkOrderesState {
    isLoading: boolean;
    workOrders: WorkOrder[];
    filter: Filter;
    newWorkOrder: WorkOrder;
    pagination: Pagination;
}

const state = reactive<WorkOrderesState>({
    isLoading: false,
    workOrders: [],
    filter: {
        appId: undefined,
        from: undefined,
        to: undefined,
    },
    newWorkOrder: {
        status: '',
        deadline_at: new Date(Date.now()),
        solution_description: '',
        user_id: undefined,
        ticket_id: undefined,
    },
    pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: undefined
    }
})

export const useWorkOrders = () => {
    const getOrders = (props?: PaginationProp): void => {
        state.isLoading = true;
        props?.pagination ? state.pagination = props?.pagination : undefined;
        const params = {
            ...state.filter,
            ...state.pagination
        }
        api.get('/work_orders/get', { params })
            .then((data) => {
                const asd = data.data as ServerAns;
                state.workOrders = asd.results;
                state.pagination = {
                    page: asd.page,
                    rowsNumber: asd.rowsNumber,
                    rowsPerPage: asd.rowsPerPage
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }

    const setNewWorkOrderEmpty = (): void => {
        state.newWorkOrder = {
            status: '',
            deadline_at: new Date(),
            solution_description: '',
            user_id: undefined,
            ticket_id: undefined,
        }
    }

    const setCurrentOrder = (user: WorkOrder): void => {
        state.isLoading = true;
        api.get(`/work_orders/get/${user.id || ''}`)
            .then((data) => {
                state.newWorkOrder = data.data as WorkOrder
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }

    const createNewOrder = (ticket: Ticket): void => {
        state.newWorkOrder = {
            status: 'created',
            deadline_at: new Date(Date.now()),
            solution_description: '',
            user_id: undefined,
            ticket_id: ticket.id,
        }
    }

    const saveNewWorkOrder = (): void => {
        if (!state.newWorkOrder?.id) {
            state.isLoading = true;
            api.post('/work_orders/create', state.newWorkOrder)
                .then(() => {
                    getOrders();
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    state.isLoading = false;
                })
        } else {
            state.isLoading = true;
            api.post(`/work_orders/update/${state.newWorkOrder.id}`, state.newWorkOrder)
                .then(() => {
                    getOrders();
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
        getOrders,
        createNewOrder,
        setCurrentOrder,
        setNewWorkOrderEmpty,
        saveNewWorkOrder,
        ...toRefs(state)
    }
}