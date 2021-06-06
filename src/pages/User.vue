<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md q-col-gutter-sm">
      <div class="col">
        <div
          class="text-h6"
        >{{route.name == 'add' ? 'Добавление нового учителя' : 'Редактирование информации об учителе'}}</div>
      </div>
    </div>
    <div v-if="!isCurrentLoading">
      <div class="row q-gutter-md">
        <div class="col q-gutter-md">
          <q-btn color="primary" label="Сохранить" @click="saveCurrentUser" to="/users" />
          <q-btn label="Отчистить" @click="setCurrentUserEmpty" />
          <q-btn label="Закрыть" to="/users" />
        </div>
      </div>
      <div class="row q-gutter-md q-col-gutter-sm">
        <div class="col-6">
          <q-input outlined dense square v-model="currentUser.full_name" label="ФИО" />
        </div>
      </div>
      <div class="row q-gutter-md q-col-gutter-sm">
        <div class="col-6">
          <q-input outlined dense square v-model="currentUser.email" label="Email" />
        </div>
      </div>
      <div class="row q-gutter-md q-col-gutter-sm">
        <div class="col-6">
          <q-select v-model="currentUser.role" :options="roleList" label="Должность" />
        </div>
      </div>
      <div class="row q-gutter-md q-col-gutter-sm" v-if="route.name == 'add'">
        <div class="col-6">
          <q-input outlined dense square v-model="currentUser.password" label="Пароль" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useUsers } from '../modules/users';
import { useAuth } from '../modules/auth';
export default defineComponent({
  setup() {
    const route = useRoute();
    const {
      isCurrentLoading,
      setCurrentUser,
      setCurrentUserEmpty,
      saveCurrentUser,
      currentUser,
    } = useUsers();
    const roleList = ['учитель', 'методист'];
    if (route.name == 'add') {
      setCurrentUserEmpty();
    } else {
      setCurrentUser(route.params.id as string);
    }
    return {
      route,
      isCurrentLoading,
      roleList,
      currentUser,
      saveCurrentUser,
      setCurrentUserEmpty,
    };
  },
});
</script>

<style>
</style>