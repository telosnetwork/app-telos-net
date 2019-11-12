export const setLoadingWallet = (state, wallet) => {
  state.loading = wallet
}

export const setAccount = (state, account) => {
  state.account = account
}

export const setAutoLogin = (state, status) => {
  state.autoLogin = status
}

export const setProfiles = (state, profiles) => {
  state.profilesList.items = state.profilesList.items.concat(profiles.items)
  state.profilesList.count = profiles.count
  state.profilesList.lastEvaluatedKey = profiles.lastEvaluatedKey
}

export const clearProfilesList = (state, items = []) => {
  state.profilesList.count = 0
  state.profilesList.items = items
  state.profilesList.lastEvaluatedKey = undefined
}

export const setSelectedProfile = (state, selectedProfile) => {
  state.selectedProfile = selectedProfile
}

export const setProfile = (state, Profile = undefined) => {
  state.myProfile = Profile
}

export const setPPPLoading = (state, isPPPLoading) => {
  state.isPPPLoading = isPPPLoading
}
