
const routes = [
  {
    path: '/',
    component: () => import('layouts/main.vue'),
    children: [
      { path: '', component: () => import('pages/index.vue') },
      { path: '/signUp', component: () => import('pages/sign-up/add/sign-up.vue') },
      { path: '/chat', component: () => import('pages/chats/list/chat.vue'), name: 'chat' },
      { path: '/chatList', component: () => import('pages/chats/list/chat-list.vue') },
      { path: '/contactList', component: () => import('pages/profiles/list/contact-list.vue') },
      { path: '/registerApp', component: () => import('pages/apps/add/register-app.vue') },
      { path: '/appList', component: () => import('pages/apps/list/app-list.vue') },
      { path: '/profileDetail', component: () => import('pages/profiles/read/profile-detail.vue'), name: 'profileDetail' }
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
