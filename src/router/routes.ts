import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: '/company'
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('pages/Users.vue')
      },
      {
        path: '/company',
        name: 'company',
        component: () => import('pages/Company.vue')
      },
      {
        path: '/clients',
        name: 'clients',
        component: () => import('pages/Clients.vue')
      },
      {
        path: '/facilities',
        name: 'facilities',
        component: () => import('pages/Facilities.vue')
      },
      {
        path: '/tickets',
        name: 'tickets',
        component: () => import('pages/Tickets.vue')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('pages/WorkOrders.vue')
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;