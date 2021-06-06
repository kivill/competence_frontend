import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: '/school'
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
        path: '/users/edit/:id',
        name: 'edit',
        component: () => import('pages/User.vue')
      },
      {
        path: '/users/add',
        name: 'add',
        component: () => import('pages/User.vue')
      },
      {
        path: '/school',
        name: 'school',
        component: () => import('src/pages/School.vue')
      },
      {
        path: '/clients',
        name: 'clients',
        component: () => import('pages/Clients.vue')
      },
      {
        path: '/competencies',
        name: 'competencies',
        component: () => import('src/pages/Competencies.vue')
      },
      // {
      //   path: '/tickets',
      //   name: 'tickets',
      //   component: () => import('pages/Tickets.vue')
      // },
      // {
      //   path: '/orders',
      //   name: 'orders',
      //   component: () => import('pages/WorkOrders.vue')
      // },
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
