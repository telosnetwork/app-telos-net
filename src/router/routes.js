
const routes = [
  {
    path: '/',
    component: () => import('layouts/main.vue'),
    children: [
      { path: '', component: () => import('pages/index.vue') },
      { path: '/signUp', component: () => import('pages/sign-up.vue') },
      { path: '/chat', component: () => import('pages/chat.vue'), name: 'chat' },
      { path: '/chatList', component: () => import('pages/chat-list.vue') },
      { path: '/contactList', component: () => import('pages/contact-list.vue') },
      { path: '/registerApp', component: () => import('pages/register-app.vue') },
      { path: '/profileDetail', component: () => import('pages/profile-detail.vue'), name: 'profileDetail' }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404.vue')
  })
}

export default routes
