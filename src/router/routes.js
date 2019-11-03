const routes = [
  { path: '/', component: () => import('pages/index.vue'), meta: { layout: 'empty' } },
  { path: '/login', component: () => import('pages/login/login.vue'), meta: { layout: 'guest', title: 'pages.login.title' } },
  { path: '/accounts/add', component: () => import('pages/accounts/add/send-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title' } },
  { path: '/accounts/add/verifyOTP', component: () => import('pages/accounts/add/verify-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title' } },
  { path: '/accounts/add/congratulations', component: () => import('pages/accounts/add/congratulations.vue'), meta: { layout: 'empty' } },
  // Trails
  { path: '/trails/ballots', component: () => import('pages/trails/ballots/list/ballots-list.vue') },
  { path: '/trails/ballots/:id', component: () => import('pages/trails/ballots/view/ballot-view.vue') },
  { path: '/trails/treasuries', component: () => import('pages/trails/treasuries/list/treasuries-list.vue') },
  // Trails
  { path: '/transfers/add', component: () => import('pages/transfers/add/send-tokens.vue') },

  // Testnet
  { path: '/testnet/rotation', component: () => import('pages/testnet/rotation.vue'), meta: { layout: 'guest', title: 'pages.testnetRotation.title' } },
  { path: '/testnet/developers', component: () => import('pages/testnet/developers.vue'), meta: { layout: 'guest', title: 'pages.testnetDevelopers.title' } },

  // POC
  { path: '/poc/smartsafe', component: () => import('pages/poc/smartsafe.vue'), meta: { title: 'pages.pocSmartSafe.title' } },

  // PPP
  { path: '/profiles/myProfile/add', component: () => import('pages/profiles/add/sign-up.vue'), meta: { needBackendLogin: true }, name: 'userRegister' },
  { path: '/profiles/myProfile/verify', component: () => import('pages/profiles/add/verify-user.vue'), meta: { needBackendLogin: true }, name: 'verifyComm' },
  { path: '/profiles/chat/messages', component: () => import('pages/chats/list/chat.vue'), meta: { needVerifyComm: true, needBackendLogin: true }, name: 'chat' },
  { path: '/profiles/chat', component: () => import('pages/chats/list/chat-list.vue'), meta: { needVerifyComm: true, needBackendLogin: true } },
  { path: '/profiles/contacts', component: () => import('pages/profiles/list/contact-list.vue'), meta: { needVerifyComm: true, needBackendLogin: true } },
  { path: '/profiles/registerApp', component: () => import('pages/apps/add/register-app.vue'), meta: { needVerifyComm: true, needBackendLogin: true }, name: 'registerApp' },
  { path: '/profiles/appList', component: () => import('pages/apps/list/app-list.vue'), meta: { needVerifyComm: true, needBackendLogin: true } },
  { path: '/profiles/myProfile', component: () => import('pages/profiles/read/my-profile.vue'), meta: { needBackendLogin: true }, name: 'myProfile' },
  { path: '/profiles/contacts/profileDetail', component: () => import('pages/profiles/read/profile-detail.vue'), meta: { needVerifyComm: true, needBackendLogin: true }, name: 'profileDetail' }
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
