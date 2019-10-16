import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ state }, mData) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  await profileApi.register(mData).then(v => {
    console.log('Register', v)
  })
}

export const searchProfiles = async function ({ commit }, options = {}) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  const { search, clean, lastEvaluatedKey } = options
  try {
    console.log('LastEv', lastEvaluatedKey)
    await profileApi.searchProfiles(search, 1, lastEvaluatedKey).then(v => {
      if (clean === true) commit('cleanProfilesList')
      commit('setProfiles', v)
      console.log(v)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const cleanProfilesList = async function ({ commit }, options = {}) {
  commit('cleanProfilesList')
}
