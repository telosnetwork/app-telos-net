import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ state }, mData) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  await profileApi.register(mData).then(response => {
    console.log('Register', response)
  })
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
    await profileApi.getProfile().then(response => {
      commit('setProfile', response)
    })
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
