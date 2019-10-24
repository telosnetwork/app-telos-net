import PPP from '@smontero/ppp-client-api'

export const registerApp = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { baseUrl, appId = '' } = params
  try {
    return profileApi.registerApp(baseUrl, appId)
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearMessagesList = function ({ commit }, options = {}) {
  commit('clearMessagesList')
}
