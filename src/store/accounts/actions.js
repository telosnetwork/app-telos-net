import PPP from '@smontero/ppp-client-api'

// export const login = async function ({ commit, dispatch }, idx) {
// export const login = async function ({ commit, dispatch }, { idx, account }) {
export const login = async function ({ commit, dispatch }, { idx, account, returnUrl }) {
  const authenticator = this.$ual.authenticators[idx]
  commit('setLoadingWallet', authenticator.getStyle().text)
  let error
  try {
    await authenticator.init()
    const users = await authenticator.login(account)
    if (users.length) {
      this.$api = users[0]
      PPP.setActiveUser(this.$api)
      const authApi = PPP.authApi()
      await authApi.signIn()
      commit('setAccount', users[0].accountName)
      localStorage.setItem('autoLogin', authenticator.constructor.name)
      this.dispatch('profiles/getProfile', { root: true })
      this.$router.push({ path: returnUrl || '/trails/treasuries' })
    }
  } catch (e) {
    error = (authenticator.getError() && authenticator.getError().message) || e.message
    dispatch('logout')
  }
  commit('setLoadingWallet')
  return error
}

export const logout = async function ({ commit }) {
  await PPP.authApi().signOut()
  const wallet = localStorage.getItem('autoLogin')
  const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
  if (idx !== -1) {
    this.$ual.authenticators[idx].logout()
  }
  commit('setAccount')
  localStorage.removeItem('autoLogin')
  this.$api = null
  this.$router.push({ path: '/' })
}

export const autoLogin = async function ({ dispatch, commit }, returnUrl) {
  const wallet = localStorage.getItem('autoLogin')
  const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
  if (idx !== -1) {
    commit('setAutoLogin', true)
    await dispatch('login', { idx, returnUrl })
    commit('setAutoLogin', false)
  }
}

export const isAccountFree = async function (context, accountName) {
  try {
    await this.$axios.get(`/v1/accounts/${accountName}`)
    return false
  } catch (e) {
    // Catch the 404 error if the account doesn't exist
    return true
  }
}

export const sendOTP = async function ({ commit }, form) {
  try {
    const response = await this.$axios.post('/v1/registrations', {
      smsNumber: form.smsNumber,
      telosAccount: form.account
    })
    if (response) {
      commit('setSignUpForm', form)
    }
    return true
  } catch (e) {
    return {
      error: e.message
    }
  }
}

export const verifyOTP = async function ({ commit, state }, { password, publicKey }) {
  try {
    const response = await this.$axios.post('/v1/accounts', {
      smsOtp: password,
      smsNumber: state.signUpForm.smsNumber,
      telosAccount: state.signUpForm.account,
      ownerKey: publicKey,
      activeKey: publicKey
    })
    return !!response
  } catch (e) {
    return false
  }
}
