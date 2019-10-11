import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ state }, mData) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  await profileApi.register(mData).then(v => {
    console.log('Register', v)
  })
}

export const searchProfiles = async function () {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  try {
    await profileApi.searchProfiles().then((v) => {
      console.log('searchProfiles', v)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const login = async function ({ commit, dispatch }, idx) {
  const authenticator = this.$ual.authenticators[idx]
  commit('setLoadingWallet', authenticator.getStyle().text)
  let error
  try {
    await authenticator.init()
    const users = await authenticator.login()
    if (users.length) {
      this.$api = users[0]
      PPP.setActiveUser(this.$api)
      const authApi = PPP.authApi()
      await authApi.signIn()
      commit('setAccount', users[0].accountName)
      localStorage.setItem('autoLogin', authenticator.constructor.name)
    }
  } catch (e) {
    error =
      (authenticator.getError() && authenticator.getError().message) ||
      e.message
    dispatch('logout')
  }
  commit('setLoadingWallet')
  return error
}
