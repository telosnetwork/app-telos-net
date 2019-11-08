// Ballots
export const fetchBallots = async function ({ commit, state }) {
  const rows = await this.$api.rpc.get_table_rows({
    json: true,
    code: 'trailservice',
    scope: 'trailservice',
    table: 'ballots',
    limit: state.ballots.list.pagination.limit
  })
  commit('addBallots', rows)
}

export const fetchBallot = async function ({ commit }, ballot) {
  const result = await this.$api.rpc.get_table_rows({
    json: true,
    code: 'trailservice',
    scope: 'trailservice',
    table: 'ballots',
    limit: 1,
    lower_bound: ballot,
    upper_bound: ballot
  })
  commit('setBallot', result.rows[0])
}

export const castVote = async function ({ commit }, { ballotName, options }) {
  const notification = {
    icon: 'fas fa-person-booth',
    title: 'notifications.trails.castVote',
    content: `${ballotName} ${options}`
  }

  try {
    const transaction = await this.$api.signTransaction({
      actions: [{
        account: 'trailservice',
        name: 'castvote',
        authorization: [{
          actor: this.$api.accountName,
          permission: 'active'
        }],
        data: {
          voter: this.$api.accountName,
          ballot_name: ballotName,
          options
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
    console.log(e)
    notification.status = 'error'
    notification.error = e.message
  }

  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const registerVoter = async function ({ commit, state }, supply) {
  const notification = {
    icon: 'fas fa-user-plus',
    title: 'notifications.trails.registerVoter',
    content: `Treasury: ${supply}`
  }

  const [, digits] = supply.replace(/[a-zA-Z]*\s*/g, '').split('.')
  const symbol = supply.replace(/\d*\s*\.*/g, '')
  const precision = (digits && digits.length) || 0

  try {
    const transaction = await this.$api.signTransaction({
      actions: [{
        account: 'trailservice',
        name: 'regvoter',
        authorization: [{
          actor: this.$api.accountName,
          permission: 'active'
        }],
        data: {
          voter: this.$api.accountName,
          treasury_symbol: `${precision},${symbol}`,
          referrer: null
        }
      }]
    }, {
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 30
    })
    commit('increaseVoters', state.treasuries.list.data.findIndex(t => t.max_supply === supply))
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    console.log(e)
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

// Ballots

// Treasuries
export const fetchTreasuries = async function ({ commit, state }) {
  const rows = await this.$api.rpc.get_table_rows({
    json: true,
    code: 'trailservice',
    scope: 'trailservice',
    table: 'treasuries',
    limit: state.treasuries.list.pagination.limit
  })
  commit('addTreasuries', rows)
}

export const fetchTreasury = async function ({ commit }, treasury) {
  const result = await this.$api.rpc.get_table_rows({
    json: true,
    code: 'trailservice',
    scope: 'trailservice',
    table: 'treasuries',
    limit: 1,
    lower_bound: treasury,
    upper_bound: treasury
  })
  commit('setTreasury', result.rows[0])
}

export const addTreasury = async function ({ commit }, { manager, maxSupply, access }) {
  try {
    const result = await this.$api.signTransaction({
      actions: [{
        account: 'trailservice',
        name: 'newtreasury',
        authorization: [{
          actor: this.$api.accountName,
          permission: 'active'
        }],
        data: {
          manager,
          max_supply: maxSupply,
          access
        }
      }]
    }, {
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 30
    })
    commit('resetLoadingTreasuries')
    return result
  } catch (e) {
    console.log(e)
    return false
  }
}
// Treasuries
