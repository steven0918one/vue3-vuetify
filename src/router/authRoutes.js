export const authRoutes = [
    {
      path: 'signup',
      name:'signup',
      component: () => import('@/layouts/default/AuthLayout.vue'),
      redirect: (to) => {
        const locale = to.params.locale || 'en'; // default locale if not provided
        return `/${locale}/signup`;
      },
      children: [
        {
          path: '',
          name: 'signupStep1',
          component: () => import('@/components/auth/signup/Step1.vue'),
        },
        {
          path: 'code',
          name: 'signupStep2',
          component: () => import('@/components/auth/signup/Step2.vue'),
          beforeEnter: (to, from, next) => {
            if (from.name === 'signupStep1' || from.name === 'forgotpassword') {
              next()
            } else {
              next({name : 'signupStep1', params: {locale: to.params.locale}})
            }
          },
        },

        {
          path: 'password',
          name: 'signupStep3',
          component: () => import('@/components/auth/signup/Step3.vue'),
          beforeEnter: (to, from, next) => {
            if ( from.name !== 'signupStep2') {
              next({name : 'signupStep1', params: {locale: to.params.locale}})
            } else {
              next()
            }
          },
        },
      ],

    },
    {
      path: 'login',
      name:'loginLayout',
      component: () => import('@/layouts/default/AuthLayout.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/components/auth/login/Login.vue'),
        },
      ]
    },
    {
      path: 'forgot',
      name:'forgotpasswordlayout',
      component: () => import('@/layouts/default/AuthLayout.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '',
          name: 'forgotpassword',
          component: () => import('@/components/auth/ForgotPassword.vue'),
        },
      ]
    },
    {
      path: 'change/password',
      name:'setpasswordLayout',
      component: () => import('@/layouts/default/AuthLayout.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '',
          name: 'setpassword',
          component: () => import('@/components/auth/signup/Step3.vue'),
          beforeEnter: (to, from, next) => {
            if ( from.name !== 'signupStep2') {
              next({name : 'forgotpassword', params: {locale: to.params.locale}})
            } else {
              next()
            }
          },
        },
      ]
    },
  {
    path: 'invite/complete',
    component: () => import('@/layouts/default/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'newUser-setPassword',
        component: () => import('@/components/settings/users/UserInviteCompleted.vue')
      },
    ],
    meta: {
      requiresAuth: false
    },
    beforeEnter: (to, from, next) => {
      if (Object.keys(to.query).length > 0) {
        next()
      } else {
        next({name : 'login', params: {locale: to.params.locale}})
      }
    },
  }
  ]

