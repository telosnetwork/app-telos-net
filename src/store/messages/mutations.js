
export const setMessages = (state, messages) => {
  messages.items.forEach(message => {
    state.messagesList.items.splice(0, 0, message)
  })
  state.messagesList.count = messages.count
  state.messagesList.lastEvaluatedKey = messages.lastEvaluatedKey
}

export const clearMessagesList = (state, items = []) => {
  state.messagesList.count = 0
  state.messagesList.items = items
  state.messagesList.lastEvaluatedKey = undefined
}

export const setChats = (state, chats) => {
  state.chatList.items = state.chatList.items.concat(chats.items)
  state.chatList.count = chats.count
  state.chatList.lastEvaluatedKey = chats.lastEvaluatedKey
}

export const clearChatList = (state, items = []) => {
  state.chatList.count = 0
  state.chatList.items = items
  state.chatList.lastEvaluatedKey = undefined
}

export const setActiveChat = (state, activeChat) => {
  state.activeChat = activeChat
}

export const addNewMessage = (state, message) => {
  state.messagesList.items.push(message)
}
