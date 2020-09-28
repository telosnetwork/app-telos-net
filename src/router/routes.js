const routes = [
  { path: '/', component: () => import('pages/index.vue'), meta: { layout: 'empty', guest: true } },
  { path: '/login', component: () => import('pages/login/login.vue'), meta: { layout: 'guest', title: 'pages.login.title', guest: true } },
  { path: '/accounts/add', component: () => import('pages/accounts/add/send-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title', guest: true } },
  { path: '/accounts/add/verifyOTP', component: () => import('pages/accounts/add/verify-otp.vue'), meta: { layout: 'guest', title: 'pages.accounts.add.title', guest: true } },
  { path: '/accounts/add/congratulations', component: () => import('pages/accounts/add/congratulations.vue'), meta: { layout: 'empty', guest: true } },

  // Works
  { path: '/works/proposals', component: () => import('pages/works/proposals.vue'), meta: { guest: false } },

  // Trails
  { path: '/trails/ballots/:id?/:hash?', component: () => import('pages/trails/ballots/list/ballots-list.vue'), meta: { guest: false } },
  { path: '/trails/treasuries', component: () => import('pages/trails/treasuries/list/treasuries-list.vue'), meta: { guest: false } },

  // Trails
  { path: '/transfers/add', component: () => import('pages/transfers/add/send-tokens.vue') },

  // Testnet
  { path: '/testnet/rotation', component: () => import('pages/testnet/rotation.vue'), meta: { layout: 'empty', title: 'pages.testnetRotation.title', guest: true } },
  { path: '/testnet/developers', component: () => import('pages/testnet/developers.vue'), meta: { layout: 'empty', title: 'pages.testnetDevelopers.title', guest: true } },

  // Claim - no longer should be used now that claiming is done
  // { path: '/claim/checkAccount', component: () => import('pages/accounts/claim/claim-check.vue'), meta: { layout: 'guest', title: 'pages.claim.claimCheck.title', guest: true } },
  // { path: '/claim/claimAccount', component: () => import('pages/accounts/claim/remove-me.vue'), meta: { title: 'pages.claim.removeMe.title' } },

  // POC
  { path: '/poc/smartsafe', component: () => import('pages/poc/smartsafe/safe-list.vue'), meta: { title: 'pages.poc.smartSafe.title' } },

  { path: '/profiles/myProfile/add', component: () => import('pages/profiles/add/sign-up.vue'), meta: { needBackendLogin: false }, name: 'userRegister' },
  { path: '/profiles/contacts', component: () => import('pages/profiles/list/contact-list.vue'), meta: { needVerifyComm: true, needBackendLogin: false } },
  { path: '/profiles/myProfile', component: () => import('pages/profiles/read/my-profile.vue'), meta: { needBackendLogin: false }, name: 'myProfile' },
  { path: '/profiles/contacts/profileDetail', component: () => import('pages/profiles/read/profile-detail.vue'), meta: { needVerifyComm: true, needBackendLogin: false }, name: 'profileDetail' },
  { path: '/profiles/add/profileLogin', component: () => import('pages/profiles/read/profile-login.vue'), name: 'profileLogin' }
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
