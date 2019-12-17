export const sendTokens = async function ({ commit, rootState }, { to, quantity, memo }) {
  const notification = {
    icon: 'fas fa-person-booth',
    content: `Send ${quantity} TLOS to ${to} with memo "${memo}"`
  }
  try {
    const actions = [{
      account: 'eosio.token',
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to,
        quantity: `${parseFloat(quantity).toFixed(4)} TLOS`,
        memo
      }
    }]
    const transaction = await this.$api.signTransaction(actions)
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.transaction
}
