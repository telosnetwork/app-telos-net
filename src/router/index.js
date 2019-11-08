import Vue from 'vue'
import VueRouter from 'vue-router'
import PPP from '@smontero/ppp-client-api'

import routes from './routes'
import Croppa from 'vue-croppa'

Vue.use(Croppa)
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
            // const loggedIn = null
            /* try {
              const result = await store.dispatch('transfers/sendTokens', { to: 'sebastianmb2', quantity: 5, memo: 'Test' })
              store.commit('general/setSuccessMsg', `Transfer result: ${JSON.stringify(result, null, 2)}`)
            } catch (e) {
              store.commit('general/setErrorMsg', `Transfer error: ${JSON.stringify(e, null, 2)}`)
            }
            const loggedIn = false */
            store.commit('general/setIsLoading', false)

            if (!loggedIn) {
              next(false)
              return
            }
          } else store.dispatch('profiles/getProfile')
        }
        // Verify the communication method
        if (to.matched.some(record => record.meta.needVerifyComm)) {
          const isRegistered = store.getters['profiles/isRegistered']
          if (!isRegistered) {
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
