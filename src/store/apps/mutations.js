
export const setMessages = (state, messages) => {
  messages.items.forEach(message => {
    state.messagesList.items.splice(0, 0, message)
  })
  state.messagesList.count = messages.count
  state.messagesList.lastEvaluatedKey = messages.lastEvaluatedKey
}

export const addNewMessage = (state, message) => {
  state.messagesList.items.push(message)
}
