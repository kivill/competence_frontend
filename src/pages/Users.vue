<template>
  <q-page class="q-pa-md">
    <q-table
      :loading="isLoading"
      title="Учителя"
      :rows="users"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
      :visible-columns="visibleColumnsUsers()"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:top-right>
        <!-- <q-btn
          v-if="hasPermisson(['директор'])"
          color="primary"
          label="Добавить"
          dense
          @click="add"
        />-->
        <q-btn color="primary" label="Добавить" dense to="/users/add" />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
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
                v-model="currentUser.full_name"
                label="ФИО"
                :disable="currentUser?.id ? true : false"
              />
            </div>
            <div class="col">
              <q-input v-model="currentUser.password" label="Пароль" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input
                v-model="currentUser.email"
                label="Email"
                :disable="currentUser.id ? true : false"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-select v-model="currentUser.role" :options="roleList" label="Должность" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отменить" color="red" @click="setCurrentUserEmpty" v-close-popup />
          <q-btn flat label="Сохранить" color="green" @click="saveCurrentUser" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUsers } from '../modules/users';
import { useAuth } from '../modules/auth';
import { useRouter } from 'vue-router';
interface User {
  id?: string;
  full_name: string;
  email: string;
  role: string;
  password?: string;
}
export default defineComponent({
  setup() {
    const router = useRouter();
    const {
      getUsers,
      users,
      isLoading,
      isCurrentLoading,
      setCurrentUserEmpty,
      setCurrentUser,
      saveCurrentUser,
      currentUser,
    } = useUsers();
    const { hasPermisson, visibleColumnsUsers } = useAuth();
    const roleList = ['учитель', 'методист'];
    const columns = [
      {
        name: 'id',
        field: 'id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'full_name',
        field: 'full_name',
        label: 'ФИО',
        align: 'left',
      },
      {
        name: 'role',
        field: 'role',
        label: 'Должность',
        align: 'left',
      },
      {
        name: 'email',
        field: 'email',
        label: 'email',
        align: 'left',
      },
    ];
    getUsers();
    let modal = ref(false);
    const add = () => {
      setCurrentUserEmpty();
      modal.value = true;
    };
    const edit = async (user: User) => {
      // setCurrentUser(user);
      // modal.value = true;
      await router.push(`/users/edit/${user.id}`);
    };
    return {
      visibleColumnsUsers,
      columns,
      roleList,
      users,
      isLoading,
      modal,
      add,
      edit,
      isCurrentLoading,
      currentUser,
      saveCurrentUser,
      setCurrentUserEmpty,
      hasPermisson,
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
