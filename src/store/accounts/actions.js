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
      this.$router.push({ path: '/transfers/add' })
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

export const isAccountFree = async function (context, accountName) {
  try {
    await this.$axios.get(`/check?telosAccount=${accountName}`)
    return true
  } catch (e) {
    // Catch the error if the account doesn't exist
    return false
  }
}

export const sendOTP = async function ({ commit }, form) {
  try {
    const response = await this.$axios.post('/register', {
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
    const response = await this.$axios.post('/create', {
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
