export const setLoadingWallet = (state, wallet) => {
  state.loading = wallet
}

export const setRequestAccount = (state, requestAccount) => {
  state.requestAccount = requestAccount
}

export const setAccount = (state, account) => {
  state.account = account
}

export const setAutoLogin = (state, status) => {
  state.autoLogin = status
}

export const setSignUpForm = (state, form) => {
  state.signUpForm = form
}

export const resetAvailableAccounts = (state) => {
  state.availableAccounts.list.data = []
  state.availableAccounts.list.loaded = false
}

export const setAvailableAccounts = (state, accounts) => {
  state.availableAccounts.list.data = accounts
  state.availableAccounts.list.loaded = true
}
