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

export const setMessages = (state, messages) => {
  state.messagesList.items = state.messagesList.items.concat(messages.items)
  state.messagesList.count = messages.count
  state.messagesList.lastEvaluatedKey = messages.lastEvaluatedKey
}

export const clearMessagesList = (state, items = []) => {
  state.messagesList.count = 0
  state.messagesList.items = items
  state.messagesList.lastEvaluatedKey = undefined
}

export const setChats = (state, chats) => {
  state.chatsList.items = state.chatsList.items.concat(chats.items)
  state.chatsList.count = chats.count
  state.chatsList.lastEvaluatedKey = chats.lastEvaluatedKey
}

export const clearChatList = (state, items = []) => {
  state.chatsList.count = 0
  state.chatsList.items = items
  state.chatsList.lastEvaluatedKey = undefined
}
