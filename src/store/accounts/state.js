export default () => ({
  signUpForm: {
    account: null,
    smsNumber: null
  },
  account: null,
  autoLogin: false,
  loading: {}, // Wallets loading status
  availableAccounts: {
    list: {
      data: [],
      loaded: false
    }
  }
})
