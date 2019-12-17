import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ state }, mData) {
  PPP.setActiveUser(this.$ualUser)
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

export const getProfile = async function ({ commit }) {
  const profileApi = PPP.profileApi()
  try {
    const profile = await profileApi.getProfile()
    commit('setProfile', profile)
    return profile
  } catch (error) {
    commit('general/setErrorMsg', error.message || error, { root: true })
  }
}

export const verifySMS = async function ({ commit }, code) {
  return PPP.profileApi().verifySms(code)
}

export const verifyEmail = async function ({ commit }, code) {
  return PPP.profileApi().verifyEmail(code)
}

export const setPPPLoading = async function ({ commit }, PPPLoading) {
  commit('setPPPLoading', PPPLoading)
}
