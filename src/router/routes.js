
const routes = [
  {
    path: '/',
    component: () => import('layouts/main.vue'),
    children: [
      { path: '', component: () => import('pages/index.vue') },
      { path: '/signUp', component: () => import('pages/SignUp.vue') },
      { path: '/chat', component: () => import('pages/Chat.vue'), name: 'chat' },
      { path: '/chatList', component: () => import('pages/ChatList.vue') },
      { path: '/contactList', component: () => import('pages/ContactList.vue') },
      { path: '/registerApp', component: () => import('pages/RegisterApp.vue') },
      { path: '/profileDetail', component: () => import('pages/ProfileDetail.vue'), name: 'profileDetail' }
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
