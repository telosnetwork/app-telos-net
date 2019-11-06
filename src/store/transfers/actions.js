export const sendTokens = async function (context, { to, quantity, memo }) {
  try {
    const accountName = await this.$api.getAccountName()
    const result = await this.$api.signTransaction({
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
    return result
  } catch (e) {
    console.log(e)
    throw e
  }
}
