export const toggleLock = async function ({ commit }, { lock, safeName, accountName }) {
  try {
    let actionName
    let accountProp
    if (lock) {
      actionName = 'locksafe'
      accountProp = 'locking_account'
    } else {
      actionName = 'unlocksafe'
      accountProp = 'unlocking_account'
    }
    const result = await this.$api.signTransaction({
      actions: [{
        account: 'safe.poc.tbs',
        name: actionName,
        authorization: [{
          actor: accountName,
          permission: 'active'
        }],
        data: {
          safe_name: safeName,
          [accountProp]: accountName
        }
      }]
    }, {
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 30
    })
    commit('resetSafes')
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
