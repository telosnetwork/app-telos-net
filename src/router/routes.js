
const routes = [
  {
    path: '/',
    component: () => import('layouts/main.vue'),
    children: [
      { path: '', component: () => import('pages/index.vue') },
      { path: '/signUp', component: () => import('pages/SignUp.vue') },
      { path: '/chat', component: () => import('pages/Chat.vue') },
      { path: '/chatsList', component: () => import('pages/ChatsList.vue') },
      { path: '/contactList', component: () => import('pages/ContactsList.vue') },
      { path: '/registerApp', component: () => import('pages/RegisterApp.vue') }
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
