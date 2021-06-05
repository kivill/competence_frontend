<template>
  <q-page class="q-pa-md">
    <q-table
      :loading="isLoading"
      title="Клиенты"
      :rows="clients"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <q-btn v-if="hasPermisson(['директор'])" color="primary" label="Добавить" dense @click="add" />
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
              v-if="hasPermisson(['директор'])"
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
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section v-if="!isCurrentLoading" class="items-center">
          <div class="row">
            <div class="col">
              <q-input
                v-model="currentClients.name"
                label="Название компании"
                :disable="currentClients.id ? true : false"
              />
            </div>
            <div class="col">
              <q-input v-model="currentClients.representative_name" label="Представитель" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentClients.legal_address" label="Юридический адресс" />
            </div>
            <div class="col">
              <q-input v-model="currentClients.actual_address" label="Фактический адресс" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentClients.phone" label="Номер телефона" />
            </div>
            <div class="col">
              <q-input v-model="currentClients.email" label="Почта" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            @click="setCurrentClientEmpty"
            v-close-popup
          />
          <q-btn
            flat
            label="Сохранить"
            color="green"
            @click="saveCurrentClient"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useClients } from '../modules/clients';
import { useAuth } from '../modules/auth';
interface Client {
  id?: number,
  name: string,
  legal_address: string,
  actual_address: string,
  phone: string,
  email: string,
  representative_name: string,
}
export default defineComponent({
  setup() {
    const {
      getClients,
      clients,
      currentClients,
      isLoading,
      isCurrentLoading,
      setCurrentClientEmpty,
      setCurrentClient,
      saveCurrentClient,
    } = useClients();
    const { hasPermisson } = useAuth();
    const positionsList = ['диспетчер', 'инженер', 'старший инженер'];
    const sexList = ['male', 'female'];
    const columns = [
      {
        name: 'id',
        field: 'id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'name',
        field: 'name',
        label: 'Название',
        align: 'left',
      },
      {
        name: 'legal_address',
        field: 'legal_address',
        label: 'Юридический адрес',
        align: 'left',
      },
      {
        name: 'actual_address',
        field: 'actual_address',
        label: 'Фактический адрес',
        align: 'left',
      },
      {
        name: 'phone',
        field: 'phone',
        label: 'Телефон',
        align: 'left',
      },
      {
        name: 'email',
        field: 'email',
        label: 'Почта',
        align: 'left',
      },
      {
        name: 'representative_name',
        field: 'representative_name',
        label: 'ФИО представителя',
        align: 'left',
      },
    ];
    getClients();
    let modal = ref(false);
    const add = () => {
      setCurrentClientEmpty();
      modal.value = true;
    };
    const edit = (client: Client) => {
      setCurrentClient(client);
      modal.value = true;
    };
    return {
      columns,
      positionsList,
      clients,
      isLoading,
      modal,
      add,
      edit,
      isCurrentLoading,
      currentClients,
      saveCurrentClient,
      setCurrentClientEmpty,
      hasPermisson,
      sexList,
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
});
</script>

<style></style>
