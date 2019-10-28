export const sendTokens = async function (context, { to, quantity, memo }) {
  try {
    const result = await this.$api.signTransaction({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: this.$api.accountName,
          permission: 'active'
        }],
        data: {
          from: this.$api.accountName,
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
    return false
  }
}
