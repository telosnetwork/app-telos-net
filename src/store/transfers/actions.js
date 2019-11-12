export const sendTokens = async function ({ commit }, { to, quantity, memo }) {
  const notification = {
    icon: 'fas fa-person-booth',
    content: `Send ${quantity} TLOS to ${to} with memo "${memo}"`
  }
  try {
    const accountName = await this.$api.getAccountName()
    const transaction = await this.$api.signTransaction({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: accountName,
          permission: 'active'
        }],
        data: {
          from: accountName,
          to,
          quantity: `${parseFloat(quantity).toFixed(4)} TLOS`,
          memo
        }
      }]
    }, {
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 30
    })
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.cause.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.transaction
}
