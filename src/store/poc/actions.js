export const lock = async function (context) {
  return callAction('locksafe')
}

export const unlock = async function (context) {
  return callAction('unlocksafe')
}

async function callAction (name) {
  try {
    const result = await this.$api.signTransaction({
      actions: [{
        account: 'jessetestxyz',
        name: name,
        authorization: [{
          actor: this.$api.accountName,
          permission: 'active'
        }],
        data: {
          safe_name: 'smartsafe1'
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
