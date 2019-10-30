const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/main.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/index.vue') }
  //   ]
  // }
  { path: '/', component: () => import('pages/index.vue'), meta: { layout: 'empty' } },
  { path: '/login', component: () => import('pages/login/login.vue'), meta: { layout: 'guest', title: 'pages.login.title' } },
  { path: '/accounts/add', component: () => import('pages/accounts/add/send-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title' } },
  { path: '/accounts/add/verifyOTP', component: () => import('pages/accounts/add/verify-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title' } },
  { path: '/accounts/add/congratulations', component: () => import('pages/accounts/add/congratulations.vue'), meta: { layout: 'empty' } },
  // Trails
  { path: '/trails/ballots', component: () => import('pages/trails/ballots/ballots-list.vue') },
  { path: '/trails/treasuries', component: () => import('pages/trails/treasuries/treasuries-list.vue') },
  // Trails
  { path: '/transfers/add', component: () => import('pages/transfers/add/send-tokens.vue') },

  // PPP
  { path: '/profiles/myProfile/add', component: () => import('pages/profiles/add/sign-up.vue') },
  { path: '/profiles/myProfile/verify', component: () => import('pages/profiles/add/verify-user.vue') },
  { path: '/profiles/chat/messages', component: () => import('pages/chats/list/chat.vue'), name: 'chat' },
  { path: '/profiles/chat', component: () => import('pages/chats/list/chat-list.vue') },
  { path: '/profiles/contacts', component: () => import('pages/profiles/list/contact-list.vue') },
  { path: '/profiles/registerApp', component: () => import('pages/apps/add/register-app.vue'), name: 'registerApp' },
  { path: '/profiles/appList', component: () => import('pages/apps/list/app-list.vue') },
  { path: '/profiles/myProfile', component: () => import('pages/profiles/read/my-profile.vue'), name: 'myProfile' },
  { path: '/profiles/contacts/profileDetail', component: () => import('pages/profiles/read/profile-detail.vue'), name: 'profileDetail' }
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
