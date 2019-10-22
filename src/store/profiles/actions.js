import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ state }, mData) {
  PPP.setActiveUser(this.$api)
  const profileApi = PPP.profileApi()
  await profileApi.register(mData).then(response => {
    console.log('Register', response)
  })
}

export const searchProfiles = async function ({ commit }, options = {}) {
  const profileApi = PPP.profileApi()
  const { search, clean, lastEvaluatedKey, limit } = options
  try {
    await profileApi.searchProfiles(search, limit, lastEvaluatedKey).then(response => {
      if (clean === true) commit('clearProfilesList')
      commit('setProfiles', response)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const sendMessage = async function ({ commit }, params = {}) {
  const profileApi = PPP.profileApi()
  const { eosAccount, message, senderAccount } = params
  try {
    return await profileApi.sendMessage(eosAccount, message).then(response => {
      console.log(message, response)
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

export const clearProfilesList = function ({ commit }, options = {}) {
  commit('clearProfilesList')
}
export const clearChatList = function ({ commit }, options = {}) {
  commit('clearChatList')
}
export const clearMessagesList = function ({ commit }, options = {}) {
  commit('clearMessagesList')
}
