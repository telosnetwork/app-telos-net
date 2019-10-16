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

export const cleanProfilesList = (state, items = []) => {
  state.profilesList.count = 0
  state.profilesList.items = items
  state.profilesList.lastEvaluatedKey = undefined
}

export const setMessages = (state, messages) => {
  state.messagesList.items = state.messagesList.items.concat(messages.items)
  state.messagesList.count = messages.count
  state.messagesList.lastEvaluatedKey = messages.lastEvaluatedKey
}

export const cleanMessagesList = (state, items = []) => {
  state.messagesList.count = 0
  state.messagesList.items = items
  state.messagesList.lastEvaluatedKey = undefined
}
