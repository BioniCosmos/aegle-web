import HomeView from '@/views/HomeView.vue'
import UserEditorView from '@/views/User/UserEditorView.vue'
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
      component: () => import('@/views/Node/NodeView.vue'),
    },
    {
      path: '/node',
      component: () => import('@/views/Node/NodeEditorView.vue'),
    },
    {
      path: '/profile',
      component: () => import('@/views/ProfileEditorView.vue'),
    },
    {
      path: '/users',
      component: () => import('@/views/User/UserView.vue'),
    },
    {
      path: '/user',
      component: UserEditorView,
    },
  ],
})

export default router
