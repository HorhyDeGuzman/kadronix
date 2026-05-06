import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/play/:mode/setup',
    name: 'setup',
    component: () => import('@/pages/SetupPage.vue'),
    props: true,
  },
  {
    path: '/play/:mode',
    name: 'game',
    component: () => import('@/pages/GamePage.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'home' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
