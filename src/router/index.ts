import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// Lazy-load components
const HomeView = defineAsyncComponent(() => import('@/views/HomeView.vue'))
const SelectedView = defineAsyncComponent(() => import('@/views/SelectedView.vue'))
const NotFound = defineAsyncComponent(() => import('@/views/NotFoundView.vue'))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/selected',
      name: 'Selected',
      component: SelectedView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
