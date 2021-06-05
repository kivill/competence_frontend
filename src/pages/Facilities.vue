<template>
  <q-page class="q-pa-md">
    <q-table
      :loading="isLoading"
      title="Объекты"
      :rows="facility"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
      :visible-columns="visibleColumnsFacilities()"
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
                v-model="currentFacility.name"
                label="Название компании"
                :disable="currentFacility.id ? true : false"
              />
            </div>
            <div class="col">
              <q-input v-model="currentFacility.representative_name" label="Представитель" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentFacility.legal_address" label="Юридический адресс" />
            </div>
            <div class="col">
              <q-input v-model="currentFacility.actual_address" label="Фактический адресс" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentFacility.phone" label="Номер телефона" />
            </div>
            <div class="col">
              <q-input v-model="currentFacility.email" label="Почта" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentFacility.monthly_fee" label="Стоимость ежемесячного обслуживания" />
            </div>
            <div class="col">
              <q-select
              v-model="currentFacility.client_id"
              :options="clients"
              label="Компания"
              option-value="id"
              option-label="name"
              emit-value
              map-options
            />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            @click="setCurrentFacilityEmpty"
            v-close-popup
          />
          <q-btn
            flat
            label="Сохранить"
            color="green"
            @click="saveCurrentFacility"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '../modules/auth';
import { useFacilities } from '../modules/facilities';
import { useClients } from '../modules/clients';

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
export default defineComponent({
  setup() {
    const {
      facility,
      currentFacility,
      isLoading,
      isCurrentLoading,
      getFacilities,
      setCurrentFacility,
      setCurrentFacilityEmpty,
      saveCurrentFacility,
    } = useFacilities();
    const { getClients, clients } = useClients();
    const { hasPermisson, visibleColumnsFacilities } = useAuth();
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
      {
        name: 'client',
        field: (row:Facility) => row?.client?.name,
        label: 'Клиент',
        align: 'left',
      },
      {
        name: 'monthly_fee',
        field: 'monthly_fee',
        label: 'Ежемесячная оплата',
        align: 'left',
      },
    ];
    getFacilities();
    getClients();
    let modal = ref(false);
    const add = () => {
      setCurrentFacilityEmpty();
      modal.value = true;
    };
    const edit = (client: Facility) => {
      setCurrentFacility(client);
      modal.value = true;
    };
    return {
      columns,
      facility,
      isLoading,
      modal,
      add,
      edit,
      isCurrentLoading,
      currentFacility,
      setCurrentFacilityEmpty,
      saveCurrentFacility,
      hasPermisson,
      visibleColumnsFacilities,
      clients,
      initialPagination: {
        sortBy: 'id',
        descending: false,
        page: 1,
        rowsPerPage: 15,
      },
    };
  },
});
</script>

<style></style>
