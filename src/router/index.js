import Vue from 'vue'
import VueRouter from 'vue-router'
import PPP from '@smontero/ppp-client-api'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach(async (to, from, next) => {
    // Verify registered users
    if (to.matched.some(record => !record.meta.layout)) {
      if (store.getters['accounts/isAuthenticated']) {
        if (to.matched.some(record => record.meta.needBackendLogin)) {
          if (!await PPP.authApi().hasValidSession()) {
            store.commit('general/setIsLoading', true)
            const loggedIn = await store.dispatch('accounts/loginToBackend')
            store.commit('general/setIsLoading', false)
            if (!loggedIn) {
              next(false)
              return
            }
          }
        }
        // Verify the communication method
        if (to.matched.some(record => record.meta.needVerifyComm)) {
          console.log('Need to verify comm')
          if (!store.getters['profiles/isRegistered']) {
            next({ name: 'userRegister' })
          } else if (store.getters['profiles/needVerifyComm']) {
            next({ name: 'verifyComm', query: { returnUrl: to.path } })
          } else next()
        } else next()
      } else {
        next({ path: `/login?returnUrl=${to.path}` })
      }
    } else {
      next()
    }
  })

  return Router
}
