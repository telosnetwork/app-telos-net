import PPP from '@smontero/ppp-client-api'
import { AppTypes } from '@smontero/ppp-common'

export const registerApp = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { baseUrl, appId = '', type, name, shortname, icon, oauthRedirectUrls, isPrivate } = params
  console.log(shortname)
  try {
    if (type === AppTypes.WEB_APP) {
      return profileApi.registerApp({ baseUrl, appId, type, oauthRedirectUrls, isPrivate })
    } else if (type === AppTypes.NON_WEB_APP) {
      return profileApi.registerApp({ baseUrl, appId, type, name, shortname, icon, oauthRedirectUrls, isPrivate })
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

export const getAuthorizedApps = async function ({ commit }, params = {}) {
  const oauthApi = PPP.oauthApi()
  // const { search, limit, lastEvaluatedKey, clean } = params
  try {
    await oauthApi.getAuthorizedApps().then(response => {
      console.log('authorized', response)
      commit('setAuthorizedAppList', response)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearAuthorizedApps = function ({ commit }) {
  commit('clearAuthorizedAppList')
}
