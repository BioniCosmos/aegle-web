import ky from '@/ky'
import { account, type Account } from '@/type/account'
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
      props: true,
    },
    {
      path: '/sign-in',
      component: () => import('@/views/SignInView.vue'),
    },
    { path: '/mfa', component: () => import('@/views/MFAView.vue') },
    {
      path: '/',
      component: () => import('@/views/BaseView.vue'),
      meta: {
        auth: true,
      },
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
          props: true,
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
          props: true,
        },
        {
          path: 'setting',
          component: () => import('@/views/SettingView.vue'),
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
      ],
    },
  ],
})

export default router

router.beforeEach(async (to) => {
  account.value = await ky('api/account').json<Account | null>()

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
    auth?: boolean
  }
}
