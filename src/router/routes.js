const routes = [
  { path: '/', component: () => import('pages/index.vue'), meta: { layout: 'empty' } },
  { path: '/login', component: () => import('pages/login/login.vue'), meta: { layout: 'guest', title: 'pages.login.title' } },
  { path: '/accounts/add', component: () => import('pages/accounts/add/send-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title' } },
  { path: '/accounts/add/verifyOTP', component: () => import('pages/accounts/add/verify-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title' } },
  { path: '/accounts/add/congratulations', component: () => import('pages/accounts/add/congratulations.vue'), meta: { layout: 'empty' } }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404.vue'),
    meta: { layout: 'empty' }
  })
}

export default routes
