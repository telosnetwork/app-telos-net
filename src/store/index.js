import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import profiles from './profiles'
import messages from './messages'
import apps from './apps'
import notifications from './notifications'
import trails from './trails'
import transfers from './transfers'
import testnet from './testnet'
import poc from './poc'
import general from './general'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      accounts,
      profiles,
      messages,
      apps,
      notifications,
      poc,
      testnet,
      trails,
      transfers,
      general
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
