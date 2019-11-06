import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ state }, mData) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  return profileApi.register(mData)
}

export const searchProfiles = async function ({ commit }, options = {}) {
  const profileApi = PPP.profileApi()
  const { search, clean, lastEvaluatedKey, limit } = options
  try {
    await profileApi.searchProfiles(search, limit, lastEvaluatedKey).then(response => {
      if (clean === true) commit('clearProfilesList')
      commit('setProfiles', response)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearProfilesList = function ({ commit }, options = {}) {
  commit('clearProfilesList')
}

export const getProfile = async function ({ commit }, promise = false) {
  const profileApi = PPP.profileApi()
  try {
    if (promise) {
      return profileApi.getProfile()
    } else {
      // await profileApi.getProfile().then(response => {
      //   commit('setProfile', response)
      // })
      const profile = await profileApi.getProfile()
      commit('setProfile', profile)
    }
  } catch (error) {
    console.log('Error', error)
  }
}

export const verifySMS = async function ({ commit }, code) {
  const profileApi = PPP.profileApi()
  // const { eosAccount, limit, lastEvaluatedKey, clean } = params
  try {
    return profileApi.verifySms(code)
  } catch (error) {
    console.log('Error', error)
  }
}

export const verifyEmail = async function ({ commit }, code) {
  const profileApi = PPP.profileApi()
  // const { eosAccount, limit, lastEvaluatedKey, clean } = params
  try {
    return profileApi.verifyEmail(code)
  } catch (error) {
    console.log('Error', error)
  }
}

export const setPPPLoading = async function ({ commit }, PPPLoading) {
  commit('setPPPLoading', PPPLoading)
}
