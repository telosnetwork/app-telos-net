import slugify from 'slugify'
import { supplyToAsset, supplyToDecimals, supplyToSymbol } from '../../utils/assets'
// Fees
export const fetchFees = async function ({ commit }) {
  const result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'config',
    limit: 1
  })
  commit('setFees', result.rows[0])
}
// Fees

// Ballots
export const fetchBallots = async function ({ commit, state }, query) {
  const result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'ballots',
    limit: state.ballots.list.pagination.limit,
    index_position: query.index || 0,
    key_type: 'i64',
    lower_bound: query.lower,
    upper_bound: query.upper
  })

  for await (const ballot of result.rows) {
    const treasury = await this.$api.getTableRows({
      code: 'trailservice',
      scope: 'trailservice',
      table: 'treasuries',
      limit: 1,
      lower_bound: supplyToSymbol(ballot.treasury_symbol),
      upper_bound: supplyToSymbol(ballot.treasury_symbol)
    })

    ballot.treasury = treasury.rows[0]
  }

  commit('addBallots', result)
}

export const fetchBallot = async function ({ commit }, ballot) {
  const result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'ballots',
    limit: 1,
    lower_bound: ballot,
    upper_bound: ballot
  })

  const treasury = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'treasuries',
    limit: 1,
    lower_bound: supplyToSymbol(result.rows[0].treasury_symbol),
    upper_bound: supplyToSymbol(result.rows[0].treasury_symbol)
  })

  result.rows[0].treasury = treasury.rows[0]

  commit('setBallot', result.rows[0])
}

export const addBallot = async function ({ commit, state, rootState }, ballot) {
  const ballotName = slugify(ballot.title, { replacement: '-', remove: /[*+~.()'"!:@?]/g, lower: true })
  const deposit = state.fees.find(fee => fee.key === 'ballot').value

  const notification = {
    icon: 'fas fa-person-booth',
    title: 'notifications.trails.addBallot',
    content: `Ballot: ${ballot.title}, deposit: ${deposit}`
  }
  try {
    const actions = [
      {
        account: 'eosio.token',
        name: 'transfer',
        data: {
          from: rootState.accounts.account,
          to: 'trailservice',
          quantity: deposit,
          memo: 'fees-deposit'
        }
      },
      {
        account: 'trailservice',
        name: 'newballot',
        data: {
          ballot_name: ballotName,
          category: ballot.category,
          publisher: rootState.accounts.account,
          treasury_symbol: supplyToAsset(ballot.treasurySymbol.value),
          voting_method: ballot.votingMethod,
          initial_options: ballot.initialOptions
        }
      },
      {
        account: 'trailservice',
        name: 'editdetails',
        data: {
          ballot_name: ballotName,
          title: ballot.title,
          description: ballot.description,
          content: ''
        }
      },
      {
        account: 'trailservice',
        name: 'editminmax',
        data: {
          ballot_name: ballotName,
          new_min_options: ballot.minOptions,
          new_max_options: ballot.maxOptions
        }
      },
      {
        account: 'trailservice',
        name: 'openvoting',
        data: {
          ballot_name: ballotName,
          end_time: new Date(ballot.endDate).toISOString().slice(0, -5)
        }
      }
    ]
    const transaction = await this.$api.signTransaction(actions)
    commit('resetBallots')
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const castVote = async function ({ commit, rootState }, { ballotName, options }) {
  const notification = {
    icon: 'fas fa-person-booth',
    title: 'notifications.trails.castVote',
    content: `${ballotName} ${options}`
  }

  try {
    const actions = [{
      account: 'trailservice',
      name: 'castvote',
      data: {
        voter: rootState.accounts.account,
        ballot_name: ballotName,
        options
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
  return notification.status === 'success'
}

export const registerVoter = async function ({ commit, state, rootState }, supply) {
  const notification = {
    icon: 'fas fa-user-plus',
    title: 'notifications.trails.registerVoter',
    content: `Treasury: ${supply}`
  }

  try {
    const actions = [{
      account: 'trailservice',
      name: 'regvoter',
      data: {
        voter: rootState.accounts.account,
        treasury_symbol: supplyToAsset(supply),
        referrer: null
      }
    }]
    const transaction = await this.$api.signTransaction(actions)
    commit('increaseVoters', state.treasuries.list.data.findIndex(t => t.max_supply === supply))
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

// Ballots

// Treasuries
export const fetchTreasuries = async function ({ commit, state, rootState }) {
  const result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'treasuries',
    limit: state.treasuries.list.pagination.limit
  })

  const voter = await this.$api.getTableRows({
    code: 'trailservice',
    scope: rootState.accounts.account,
    table: 'voters',
    limit: 1000
  })

  for await (const treasury of result.rows) {
    treasury.isRegistered = voter.rows.some(v => supplyToSymbol(v.liquid) === supplyToSymbol(treasury.max_supply))
  }

  commit('addTreasuries', result)
}

export const fetchTreasury = async function ({ commit }, treasury) {
  const result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'treasuries',
    limit: 1,
    lower_bound: treasury,
    upper_bound: treasury
  })
  commit('setTreasury', result.rows[0])
}

export const addTreasury = async function ({ commit, state, rootState }, { manager, maxSupply, access, title, description }) {
  const deposit = state.fees.find(fee => fee.key === 'treasury').value
  const notification = {
    icon: 'fas fa-users',
    title: 'notifications.trails.addTreasury',
    content: `Treasury manager: ${manager}, supply: ${maxSupply}, deposit: ${deposit}`
  }
  try {
    const actions = [
      {
        account: 'eosio.token',
        name: 'transfer',
        data: {
          from: rootState.accounts.account,
          to: 'trailservice',
          quantity: deposit,
          memo: 'fees-deposit'
        }
      },
      {
        account: 'trailservice',
        name: 'newtreasury',
        data: {
          manager,
          max_supply: maxSupply,
          access
        }
      },
      {
        account: 'trailservice',
        name: 'edittrsinfo',
        data: {
          treasury_symbol: supplyToAsset(maxSupply),
          title,
          description,
          icon: null
        }
      }
    ]
    const transaction = await this.$api.signTransaction(actions)
    commit('resetTreasuries')
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const editTreasury = async function ({ commit }, { title, description, treasury }) {
  const notification = {
    icon: 'fas fa-edit',
    title: 'notifications.trails.editTreasury',
    content: `Treasury: ${title}`
  }
  try {
    const actions = [
      {
        account: 'trailservice',
        name: 'edittrsinfo',
        data: {
          treasury_symbol: supplyToAsset(treasury.max_supply),
          title,
          description,
          icon: null
        }
      }
    ]
    const transaction = await this.$api.signTransaction(actions)
    commit('updateTreasury', { title, description, treasury })
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const mint = async function ({ commit }, { to, quantity, memo, supply }) {
  const notification = {
    icon: 'fas fa-comment-dollar',
    title: 'notifications.trails.mintTokens',
    content: `Mint ${quantity} ${supplyToSymbol(supply)} to ${to}`
  }
  try {
    const actions = [{
      account: 'trailservice',
      name: 'mint',
      data: {
        to,
        quantity: `${parseFloat(quantity).toFixed(supplyToDecimals(supply))} ${supplyToSymbol(supply)}`,
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
  return notification.status === 'success'
}
// Treasuries
