import PPP from '@smontero/ppp-client-api'

export const sendMessage = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { eosAccount, message, senderAccount } = params
  try {
    return profileApi.sendMessage(eosAccount, message).then(response => {
      commit('addNewMessage', { eosAccount: eosAccount, message: message, sentAt: new Date(), senderAccount: senderAccount })
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const getMessages = async function ({ commit, state }, params = {}) {
  const profileApi = PPP.profileApi()
  const { eosAccount, limit, lastEvaluatedKey, clean } = params
  try {
    await profileApi.getMessages(eosAccount, limit, lastEvaluatedKey).then(response => {
      if (clean === true) commit('clearMessagesList')
      commit('setMessages', response)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const getChats = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { search, limit, lastEvaluatedKey, clean } = params
  try {
    const response = await profileApi.getChats(search, limit, lastEvaluatedKey)
    if (clean === true) commit('clearChatList')
    commit('setChats', response)
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearChatList = function ({ commit }, options = {}) {
  commit('clearChatList')
}

export const clearMessagesList = function ({ commit }, options = {}) {
  commit('clearMessagesList')
}
