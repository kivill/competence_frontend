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
        title="Наряды"
        :rows="workOrders"
        :columns="columns"
        row-key="_id"
        v-model:pagination="pagination"
        @request="getOrders"
      >
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
                v-if="hasPermisson(['директор', 'диспетчер', 'инженер'])"
                size="sm"
                color="primary"
                round
                dense
                @click="edit(props.row)"
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
              v-model="newWorkOrder.status"
              :options="statusList"
              label="Статус"
            />
          </div>
          <div>
            <q-input v-model="newWorkOrder.solution_description" />
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
            label="Сохранить"
            color="green"
            v-close-popup
            @click="saveNewWorkOrder"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { useClients } from 'src/modules/clients';
import { useAuth } from '../modules/auth';
import { useFacilities } from 'src/modules/facilities';
import { defineComponent, ref } from 'vue';
import { useTickets } from '../modules/tickets';
import { useWorkOrders } from '../modules/workOrders';
import { useUsers } from '../modules/users';

interface WorkOrder {
  id?: number;
  status: string;
  deadline_at: Date;
  solution_description: string;
  user_id?: number;
  ticket_id?: number;
  ticket?: {
    desctiption: string;
    urgency: string;
    status: string;
  };
}

export default defineComponent({
  setup() {
    const {
      getTickets,
      tickets,
      newTicket,
      setNewTicketEmpty,
      saveNewTicket,
    } = useTickets();
    const { facility, getFacilities } = useFacilities();
    const { getUsers, users } = useUsers();
    const {
      getOrders,
      workOrders,
      isLoading,
      filter,
      pagination,
      newWorkOrder,
      setCurrentOrder,
      setNewWorkOrderEmpty,
      saveNewWorkOrder,
    } = useWorkOrders();

    const { hasPermisson } = useAuth();
    getUsers();
    getOrders();
    getFacilities();
    getTickets();
    const edit = (order: WorkOrder) => {
      setCurrentOrder(order);
      modal.value = true;
    };
    const urgencyList = ['low', 'middle', 'high', 'urgent'];
    const statusList = ['created', 'in_progress', 'done', 'failed'];
    const columns = [
      {
        name: 'id',
        field: 'id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'status',
        field: (row: WorkOrder) => row.ticket?.status,
        label: 'Статус заявки',
        align: 'left',
      },
      {
        name: 'status',
        field: 'status',
        label: 'Статус наряда',
        align: 'left',
      },
      {
        name: 'desctiption',
        field: 'solution_description',
        label: 'Решение',
        align: 'left',
      },
      {
        name: 'urgency',
        field: (row: WorkOrder) => row.ticket?.urgency,
        label: 'Срочность',
        align: 'left',
      },
      {
        name: 'description',
        field: (row: WorkOrder) => row.ticket?.desctiption,
        label: 'Описание заявки',
        align: 'left',
      },
      {
        name: 'user',
        field: (row: WorkOrder) =>
          users?.value?.find((x) => x.id == row.user_id)?.full_name,
        label: 'Ответственный инженер',
        align: 'left',
      },
    ];

    let modal = ref(false);
    return {
      edit,
      getTickets,
      users,
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
      workOrders,
      getOrders,
      setNewWorkOrderEmpty,
      saveNewWorkOrder,
      newWorkOrder,
      statusList,
    };
  },
});
</script>

<style></style>
