export const toggleLock = async function ({ commit }, { lock, safeName, accountName }) {
  const notification = {
    icon: 'fas fa-person-booth',
    content: `${safeName}`
  }
  try {
    let actionName
    let accountProp
    if (lock) {
      actionName = 'locksafe'
      accountProp = 'locking_account'
      notification.title = 'notifications.poc.lockSafe'
    } else {
      actionName = 'unlocksafe'
      accountProp = 'unlocking_account'
      notification.title = 'notifications.poc.unlockSafe'
    }
    const actions = [{
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
    const transaction = await this.$api.signTransaction(actions)
    commit('resetSafes')
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const fetchSafes = async function ({ commit, state }) {
  const rows = await this.$api.getTableRows({
    code: 'safe.poc.tbs',
    scope: 'safe.poc.tbs',
    table: 'safes',
    limit: state.safes.list.pagination.limit
  })
  commit('addSafes', rows)
}
