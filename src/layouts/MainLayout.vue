<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-black">
        <q-toolbar-title>Datakrat</q-toolbar-title>
        <span v-if="isLoggedIn">Добро пожаловать, {{ userInfo?.role }} {{ userInfo?.full_name }}</span>
        <q-space />
        <span v-if="isLoggedIn">
          <q-btn v-if="hasPermisson(['директор', 'диспетчер'])" stretch flat to="/tickets">Заявки</q-btn>
          <q-btn stretch flat to="/orders">Наряды</q-btn>
          <q-btn-dropdown stretch flat label="Клиенты" icon="business">
            <q-list style="min-width: 100px">
              <!-- <q-item clickable to="/clients">
                <q-item-section>Список клиентов</q-item-section>
              </q-item>-->
              <q-item clickable to="/facilities">
                <q-item-section>Список объектов</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown stretch flat label="Информация о школе" icon="flag">
            <q-list style="min-width: 100px">
              <q-item clickable to="/users" v-if="hasPermisson(['директор', 'диспетчер'])">
                <q-item-section>Сотрудники</q-item-section>
              </q-item>
              <q-item clickable to="/school">
                <q-item-section>Информация о школе</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn stretch flat @click="logout" to="/login">Выход</q-btn>
        </span>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

import { useAuth } from '../modules/auth';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);
    const { isLoggedIn, logout, hasPermisson, userInfo } = useAuth();
    return {
      essentialLinks: linksList,
      userInfo,
      leftDrawerOpen,
      isLoggedIn,
      logout,
      hasPermisson,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
