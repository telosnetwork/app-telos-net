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
