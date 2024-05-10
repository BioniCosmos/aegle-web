import { useAccountStore } from '@/stores/account'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/nodes',
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
      path: '/user/:id?',
      component: () => import('@/views/User/UserEditorView.vue'),
    },
    {
      path: '/sign-in',
      component: () => import('@/views/SignInView.vue'),
    },
  ],
})

export default router

router.beforeEach(async (to) => {
  const accountStore = useAccountStore()
  const { isAuthorized } = storeToRefs(accountStore)
  if (!isAuthorized.value) {
    await accountStore.authorize()
  }
  if (to.path === '/sign-in') {
    if (isAuthorized.value) {
      return '/'
    }
  } else {
    if (!isAuthorized.value) {
      return '/sign-in'
    }
  }
})
