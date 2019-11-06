export const isAuthenticated = ({ account }) => !!account
export const account = ({ account }) => account
export const loading = ({ loading }) => loading
export const isAutoLoading = ({ autoLogin }) => autoLogin
export const signUpAccount = ({ signUpForm }) => signUpForm.account
export const availableAccounts = ({ availableAccounts }) => availableAccounts.list.data
export const availableAccountsLoaded = ({ availableAccounts }) => availableAccounts.list.loaded
export const requestAccount = ({ requestAccount }) => requestAccount
