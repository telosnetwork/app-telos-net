import PPP from '@smontero/ppp-client-api'
import { AppTypes } from '@smontero/ppp-common'

export const registerApp = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { baseUrl, appId = '', type, name, shortname, icon } = params
  console.log(shortname)
  try {
    if (type === AppTypes.WEB_APP) {
      return profileApi.registerApp({ baseUrl, appId, type })
    } else if (type === AppTypes.STANDALONE_APP) {
      return profileApi.registerApp({ baseUrl, appId, type, name, shortname, icon })
    }
  } catch (error) {
    console.log('Error', error)
  }
}

export const deleteApp = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { appId } = params
  try {
    return profileApi.deleteApp(appId)
  } catch (error) {
    console.log('Error', error)
  }
}

export const getMyApps = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  // const { search, limit, lastEvaluatedKey, clean } = params
  try {
    await profileApi.getMyApps().then(response => {
      commit('setMyApps', response)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearMyAppList = function ({ commit }) {
  commit('clearMyAppList')
}
