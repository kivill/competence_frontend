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
    results: Ticket[],
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

interface TicketsState {
    isLoading: boolean;
    tickets: Ticket[];
    filter: Filter;
    newTicket: Ticket;
    pagination: Pagination;
}

const state = reactive<TicketsState>({
    isLoading: false,
    tickets: [],
    filter: {
        appId: undefined,
        from: undefined,
        to: undefined,
    },
    newTicket: {
        facility_id: undefined,
        company_id: 1,
        status: 'created',
        desctiption: '',
        urgency: '',
    },
    pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: undefined
    }
})

export const useTickets = () => {
    const getTickets = (props?: PaginationProp): void => {
        state.isLoading = true;
        props?.pagination ? state.pagination = props?.pagination : undefined;
        const params = {
            ...state.filter,
            ...state.pagination
        }
        api.get('/tickets/get', { params })
            .then((data) => {
                const asd = data.data as ServerAns;
                state.tickets = asd.results;
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

    const setNewTicketEmpty = (): void => {
        state.newTicket = {
            facility_id: 0,
            company_id: 1,
            status: 'created',
            desctiption: '',
            urgency: '',
        }
    }

    const saveNewTicket = (): void => {
        if (!state.newTicket?.id) {
            state.isLoading = true;
            api.post('/tickets/create', state.newTicket)
                .then(() => {
                    getTickets();
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    state.isLoading = false;
                })
        } else {
            state.isLoading = true;
            api.post(`/tickets/update/${state.newTicket.id}`, state.newTicket)
                .then(() => {
                    getTickets();
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
        getTickets,
        setNewTicketEmpty,
        saveNewTicket,
        ...toRefs(state),
    }
}