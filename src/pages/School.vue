<template>
  <div></div>
  <q-page class="q-pa-md">
    <div class="row q-pa-md">
      <div class="col">
        <q-input v-model="school.name" label="Название" :disable="school.id ? true : false" />
      </div>
      <div class="col">
        <q-input v-model="school.address" label="Адресс" />
      </div>
    </div>
    <div class="row q-pa-md">
      <div>
        <q-btn
          v-if="hasPermisson(['директор'])"
          label="Сохранить"
          color="primary"
          @click="updateSchool"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useSchool } from '../modules/school';
import { useAuth } from '../modules/auth';
export default defineComponent({
  setup() {
    const { school, getSchool, updateSchool } = useSchool();
    const { hasPermisson } = useAuth();
    getSchool();
    return {
      school,
      updateSchool,
      hasPermisson
    };
  }
});
</script>

<style>
</style>