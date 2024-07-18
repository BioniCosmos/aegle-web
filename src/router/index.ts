import { account, refreshAccount } from '@/type/account'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/RootLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/HomeView.vue'),
          meta: { auth: true },
        },
        {
          path: 'nodes',
          component: () => import('@/views/Node/NodeView.vue'),
          meta: { auth: true },
        },
        {
          path: 'node/:id?',
          component: () => import('@/views/Node/NodeEditorView.vue'),
          meta: { auth: true },
          props: true,
        },
        {
          path: 'profile',
          component: () => import('@/views/ProfileEditorView.vue'),
          meta: { auth: true },
          beforeEnter: (to, from) => {
            if (!to.query.nodeId) {
              return from
            }
          },
        },
        {
          path: 'users',
          component: () => import('@/views/User/UserView.vue'),
          meta: { auth: true },
        },
        {
          path: 'user',
          component: () => import('@/views/User/UserInsertView.vue'),
          meta: { auth: true },
        },
        {
          path: 'user/:id',
          component: () => import('@/views/User/UserUpdateView.vue'),
          meta: { auth: true },
          props: true,
        },
        {
          path: 'setting',
          component: () => import('@/views/SettingView.vue'),
          meta: { auth: true },
          children: [
            {
              path: 'account',
              children: [
                {
                  path: '',
                  component: () =>
                    import('@/views/setting/account/RootView.vue'),
                },
                {
                  path: 'totp',
                  component: () =>
                    import('@/views/setting/account/TOTPView.vue'),
                },
              ],
            },
            {
              path: 'server',
              component: () => import('@/views/setting/ServerView.vue'),
            },
            {
              path: 'smtp',
              component: () => import('@/views/setting/SMTPView.vue'),
            },
          ],
        },
        {
          path: '/sign-up',
          component: () => import('@/views/SignUpView.vue'),
          meta: { auth: false },
        },
        {
          path: '/verification/:id?',
          component: () => import('@/views/VerificationView.vue'),
          meta: { auth: false },
          props: true,
        },
        {
          path: '/sign-in',
          component: () => import('@/views/SignInView.vue'),
          meta: { auth: false },
        },
        {
          path: '/mfa',
          component: () => import('@/views/MFAView.vue'),
          meta: { auth: false },
        },
      ],
    },
  ],
})

export default router

router.beforeEach(async (to) => {
  if (account.value === null) {
    await refreshAccount()
  }

  function getRouteType() {
    if (to.meta.auth) return 'auth'
    if (to.path === '/mfa') return 'mfa'
    if (to.path.startsWith('/verification')) return 'verification'
    if (['/sign-in', '/sign-up'].includes(to.path)) return 'public'
    throw Error('Unknown route type')
  }

  const routeType = getRouteType()
  const status = account.value?.status ?? 'none'

  const routeMap = {
    auth: {
      none: '/sign-in',
      unverified: '/verification',
      needMFA: '/mfa',
      signedIn: true,
    },
    mfa: {
      none: '/sign-in',
      unverified: '/verification',
      needMFA: true,
      signedIn: '/',
    },
    verification: {
      none: '/sign-in',
      unverified: true,
      needMFA: '/mfa',
      signedIn: '/',
    },
    public: {
      none: true,
      unverified: '/verification',
      needMFA: '/mfa',
      signedIn: '/',
    },
  } as const
  return routeMap[routeType][status]
})

declare module 'vue-router' {
  interface RouteMeta {
    auth: boolean
  }
}
