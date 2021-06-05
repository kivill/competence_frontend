<template>
  <q-page class="q-pa-md">
    <!-- <div class="row q-gutter-sm">
      <div class="col">
        <q-select
          v-model="filter.appId"
          :options="apps"
          label="ID приложения"
          option-value="_id"
          option-label="name"
          emit-value
          map-options
          outlined
          dense
          clearable
          multiple
        />
      </div>
      <div class="col">
        <q-input outlined v-model="filter.from" dense mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filter.from" minimal> </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon
              name="clear"
              class="cursor-pointer"
              @click="filter.from = null"
            />
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input outlined v-model="filter.to" dense mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filter.to" minimal> </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon
              name="clear"
              class="cursor-pointer"
              @click="filter.to = null"
            />
          </template>
        </q-input>
      </div>
      <div class="col-1">
        <q-btn color="primary" label="Поиск" dense @click="getPostbacks" />
      </div>
    </div> -->

    <div class="q-mt-lg">
      <q-table
        :loading="isLoading"
        title="Заявки"
        :rows="tickets"
        :columns="columns"
        row-key="_id"
        v-model:pagination="pagination"
        @request="getTickets"
      >
        <template v-slot:top-right>
          <q-btn v-if="hasPermisson(['директор', 'диспетчер'])"  color="primary" label="Добавить" dense @click="modal = true" />
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width />
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn
                v-if="hasPermisson(['директор', 'диспетчер']) && props.row.status == 'created'"
                size="sm"
                color="primary"
                round
                dense
                @click="create(props.row)"
                icon="create"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section class="items-center q-gutter-sm">
          <div>
            <q-select
              v-model="newWorkOrder.user_id"
              :options="users"
              label="Пользователь"
              option-value="id"
              option-label="full_name"
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            v-close-popup
            @click="setNewWorkOrderEmpty"
          />
          <q-btn
            flat
            label="Добавить"
            color="green"
            v-close-popup
            @click="saveNewWorkOrder(); getTickets()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="" persistent>
      <q-card>
        <q-card-section class="items-center q-gutter-sm">
          <div>
            <q-select
              v-model="newWorkOrder.user_id"
              :options="users"
              label="Пользователь"
              option-value="id"
              option-label="full_name"
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            v-close-popup
            @click="setNewWorkOrderEmpty"
          />
          <q-btn
            flat
            label="Добавить"
            color="green"
            v-close-popup
            @click="saveNewWorkOrder(); getTickets()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script lang="ts">
import { useClients } from 'src/modules/clients';
import { useAuth } from '../modules/auth';
import { useFacilities } from 'src/modules/facilities';
import { defineComponent, ref } from 'vue';
import { useTickets } from '../modules/tickets';
import { useUsers } from '../modules/users';
import { useWorkOrders } from '../modules/workOrders';

interface Ticket {
    id?: number,
    facility_id?: number,
    company_id: number,
    status: string,
    desctiption: string,
    urgency: string,
}

interface WorkOrder {
    id?: number,
    status: string,
    deadline_at: Date,
    solution_description: string,
    user_id?: number,
    ticket_id?: number,
    ticket?: {
      desctiption: string,
      urgency:string,
      status: string,
    }
}

export default defineComponent({
  setup() {
    const { 
      getTickets,
      tickets,
      isLoading,
      filter,
      pagination,
      newTicket,
      setNewTicketEmpty,
      saveNewTicket,
    } = useTickets();
    const {
      getUsers,
      users,
    } = useUsers();
    const { facility, getFacilities } = useFacilities();
    const { hasPermisson } = useAuth();
    getFacilities();
    getTickets();
    getUsers();
    const {
      newWorkOrder,
      setNewWorkOrderEmpty,
      saveNewWorkOrder,
      createNewOrder,
    } = useWorkOrders();
    const urgencyList = ['low', 'middle', 'high', 'urgent'];
    const columns = [
      {
        name: 'id',
        field: 'id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'status',
        field: 'status',
        label: 'Статус',
        align: 'left',
      },
      {
        name: 'desctiption',
        field: 'desctiption',
        label: 'Описание',
        align: 'left',
      },
      {
        name: 'urgency',
        field: 'urgency',
        label: 'Срочность',
        align: 'left',
      },
      {
        name: 'facility',
        field: (row:Ticket) => facility?.value?.find(x => x.id == row.facility_id)?.name,
        label: 'Объект',
        align: 'left',
      },
    ];
    const create = (ticket: Ticket) => {
      createNewOrder(ticket);
      modal.value = true;
    };
    let modal = ref(false);
    return {
      users,
      create,
      getTickets,
      columns,
      modal,
      tickets,
      isLoading,
      filter,
      pagination,
      facility,
      newTicket,
      urgencyList,
      setNewTicketEmpty,
      saveNewTicket,
      hasPermisson,
      newWorkOrder,
      setNewWorkOrderEmpty,
      saveNewWorkOrder,
      createNewOrder,
    };
  },
});
</script>

<style></style>
