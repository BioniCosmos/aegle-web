import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/nodes',
      component: () => import('@/views/NodeView.vue')
    },
    {
      path: '/node',
      component: () => import('@/views/NodeEditorView.vue'),
    },
    {
      path: '/inbound',
      component: () => import('@/views/InboundEditorView.vue'),
    },
  ],
})

export default router
