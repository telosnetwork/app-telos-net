export const lock = async function (context, safeName, accountName) {
  try {
    const result = await this.$api.signTransaction({
      actions: [{
        account: 'safe.poc.tbs',
        name: 'locksafe',
        authorization: [{
          actor: this.$api.account,
          permission: 'active'
        }],
        data: {
          safe_name: safeName,
          locking_account: accountName
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

export const unlock = async function (context, safeName, accountName) {
  try {
    const result = await this.$api.signTransaction({
      actions: [{
        account: 'safe.poc.tbs',
        name: 'unlocksafe',
        authorization: [{
          actor: this.$api.account,
          permission: 'active'
        }],
        data: {
          safe_name: safeName,
          unlocking_account: accountName
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

export const fetchSafes = async function ({ commit, state }) {
  const rows = await this.$api.rpc.get_table_rows({
    json: true,
    code: 'safe.poc.tbs',
    scope: 'safe.poc.tbs',
    table: 'safes',
    limit: state.safes.list.pagination.limit
  })
  commit('addSafes', rows)
}
