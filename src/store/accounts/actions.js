export const login = async function ({ commit }, idx) {
  const authenticator = this.$ual.authenticators[idx]
  commit('setLoadingWallet', authenticator.getStyle().text)
  let error
  try {
    await authenticator.init()
    const users = await authenticator.login()
    if (users.length) {
      commit('setAccount', users[0].accountName)
      this.$api = users[0]
      localStorage.setItem('autoLogin', authenticator.constructor.name)
    }
  } catch (e) {
    error = (authenticator.getError() && authenticator.getError().message) || e.message
  }

  commit('setLoadingWallet')
  return error
}

export const logout = async function ({ commit }) {
  const wallet = localStorage.getItem('autoLogin')
  const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
  this.$ual.authenticators[idx].logout()
  commit('setAccount')
  localStorage.removeItem('autoLogin')
  this.$api = null
}

export const autoLogin = async function ({ dispatch, commit }) {
  const wallet = localStorage.getItem('autoLogin')
  const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
  if (idx !== -1) {
    commit('setAutoLogin', true)
    await dispatch('login', idx)
    commit('setAutoLogin', false)
  }
}
