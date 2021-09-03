
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', redirect: '/space' },
      { path: '/space', name: 'space', component: () => import('src/pages/space.vue') },
      { path: '/login', name: 'login', component: () => import('src/pages/auth/loginPage.vue') },
      { path: '/signin', name: 'signin', component: () => import('src/pages/auth/signUpPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
