import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-up',
      component: () => import('@/views/SignUpView.vue'),
    },
    {
      path: '/verification/:id?',
      component: () => import('@/views/VerificationView.vue'),
    },
    {
      path: '/sign-in',
      component: () => import('@/views/SignInView.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/BaseView.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'nodes',
          component: () => import('@/views/Node/NodeView.vue'),
        },
        {
          path: 'node/:id?',
          component: () => import('@/views/Node/NodeEditorView.vue'),
        },
        {
          path: 'profile',
          component: () => import('@/views/ProfileEditorView.vue'),
          beforeEnter: (to, from) => {
            if (!to.query.nodeId) {
              return from
            }
          },
        },
        {
          path: 'users',
          component: () => import('@/views/User/UserView.vue'),
        },
        {
          path: 'user',
          component: () => import('@/views/User/UserInsertView.vue'),
        },
        {
          path: 'user/:id',
          component: () => import('@/views/User/UserUpdateView.vue'),
        },
      ],
    },
  ],
})

export default router

// router.beforeEach(async (to) => {
//   const accountStore = useAccountStore()
//   const { isAuthorized } = storeToRefs(accountStore)
//   if (!isAuthorized.value) {
//     await accountStore.authorize()
//   }
//   if (to.path === '/sign-in') {
//     if (isAuthorized.value) {
//       return '/'
//     }
//   } else {
//     if (!isAuthorized.value) {
//       return '/sign-in'
//     }
//   }
// })
