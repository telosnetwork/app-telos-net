import PPP from '@smontero/ppp-client-api'

export const searchProfiles = async function ({ commit }, options = {}) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  const { search, clean } = options
  try {
    await profileApi.searchProfiles(search, 10).then(v => {
      if (clean === true) commit('cleanProfilesList')
      commit('setProfiles', v)
    })
  } catch (error) {
    console.log('Error', error)
  }
}
