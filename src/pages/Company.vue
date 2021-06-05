<template>
<div></div>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-input
          v-model="company.name"
          label="Название"
          :disable="company.id ? true : false"
        />
      </div>
      <div class="col">
        <q-input v-model="company.legal_address" label="Юридический адресс" />
      </div>
      <div class="col">
        <q-input v-model="company.actual_address" label="Физический адресс" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-input v-model="company.phone" label="Номер телефона" />
      </div>
      <div class="col">
        <q-input v-model="company.email" label="Почта" />
      </div>
      <div class="col">
        <q-input v-model="company.representative_name" label="Имя представителя" />
      </div>
    </div>
    <div>
      <q-btn
        v-if="hasPermisson(['директор'])"
        label="Сохранить"
        color="primary"
        @click="updateCompany"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useCompany } from '../modules/company';
import { useAuth } from '../modules/auth';
export default defineComponent({
    setup() {
      const { company, getCompany, updateCompany } = useCompany();
      const { hasPermisson } = useAuth();
      getCompany();
      return{
          company,
          updateCompany,
          hasPermisson,
      }
    }
})
</script>

<style>

</style>