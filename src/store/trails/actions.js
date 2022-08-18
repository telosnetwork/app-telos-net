import slugify from 'slugify'
import { supplyToAsset, supplyToDecimals, supplyToSymbol } from '../../utils/assets'
// Fees
export const fetchFees = async function ({ commit }) {
  const result = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: 'telos.decide',
    table: 'config',
    limit: 1
  })
  commit('setFees', result.rows[0])
}
// Fees

// Ballots
export const fetchBallots = async function ({ commit, state }, query) {
  const result = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: 'telos.decide',
    table: 'ballots',
    limit: query.limit,
    index_position: query.index || 0,
    key_type: 'i64',
    lower_bound: query.lower,
    upper_bound: query.upper
  })
  let treasuries = {}

  for await (const ballot of result.rows) {
    let supply = supplyToSymbol(ballot.treasury_symbol)
    if (!treasuries.hasOwnProperty(supply)) {
      const treasury = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: 'telos.decide',
        table: 'treasuries',
        limit: 1,
        lower_bound: supply,
        upper_bound: supply
      })
      treasuries[supply] = treasury.rows[0]
    }

    ballot.treasury = treasuries[supply]
  }
  commit('addBallots', result)
}

export const fetchTreasuriesForUser = async function ({ commit }, account) {
  const res = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: account,
    table: 'voters',
    key_type: 'i64'
  })

  commit('setUserTreasuries', res)
}

export const fetchVotesForBallot = async function ({ commit }, ballot) {
  const res = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: ballot,
    table: 'votes',
    limit: 20
  })
  console.log(res)
  commit('setBallotVotes', res.rows)
}

export const fetchBallot = async function ({ commit }, ballot) {
  const result = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: 'telos.decide',
    table: 'ballots',
    limit: 1,
    lower_bound: ballot,
    upper_bound: ballot
  })

  const treasury = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: 'telos.decide',
    table: 'treasuries',
    limit: 1,
    lower_bound: supplyToSymbol(result.rows[0].treasury_symbol),
    upper_bound: supplyToSymbol(result.rows[0].treasury_symbol)
  })

  if (result.rows[0].category === 'proposal') {
    const proposalInfo = await this.$api.getTableRows({
      code: 'works.decide',
      scope: 'works.decide',
      table: 'proposals',
      limit: 1,
      lower_bound: ballot,
      upper_bound: ballot
    })

    result.rows[0].proposal_info = proposalInfo.rows[0]
  }

  result.rows[0].treasury = treasury.rows[0]

  commit('setBallot', result.rows[0])
}

export const addBallot = async function ({ commit, state, rootState }, ballot) {
  const ballotName = slugify(ballot.title, { replacement: '-', remove: /[*+~.()'"!:@?]/g, lower: true })
  const deposit = state.fees.find(fee => fee.key === 'ballot').value

  let togglebal = {
    account: 'telos.decide',
    name: 'togglebal',
    data: {
      ballot_name: ballotName,
      setting_name: null
    }
  }

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
          to: 'telos.decide',
          quantity: deposit,
          memo: 'fees-deposit'
        }
      },
      {
        account: 'telos.decide',
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
        account: 'telos.decide',
        name: 'editdetails',
        data: {
          ballot_name: ballotName,
          title: ballot.title,
          description: ballot.description,
          content: ballot.content
        }
      },
      {
        account: 'telos.decide',
        name: 'editminmax',
        data: {
          ballot_name: ballotName,
          new_min_options: ballot.minOptions,
          new_max_options: ballot.maxOptions
        }
      },
      {
        account: 'telos.decide',
        name: 'openvoting',
        data: {
          ballot_name: ballotName,
          end_time: new Date(ballot.endDate).toISOString().slice(0, -5)
        }
      }
    ]
    let isBoth = false
    if (ballot.treasurySymbol.symbol === 'VOTE') {
      togglebal.data.setting_name = 'votestake'
    } else if (!ballot.settings) {
      togglebal.data.setting_name = 'voteliquid'
    } else if (ballot.settings && ballot.config) {
      if (ballot.config === 'both') {
        for (let i of ['voteliquid', 'votestake']) {
          togglebal.data.setting_name = i
          isBoth = true
          actions.splice(2, 0, togglebal)
        }
      } else {
        togglebal.data.setting_name = ballot.config
      }
    }
    !isBoth && actions.splice(2, 0, togglebal)

    const transaction = await this.$api.signTransaction(actions)
    commit('resetBallots')
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const deleteBallot = async function ({ commit }, ballot) {
  const notification = {
    icon: 'fas fa-person-booth',
    title: 'notifications.trails.deleteBallot',
    content: `Ballot: ${ballot.title}`
  }
  try {
    const actions = [
      {
        account: 'telos.decide',
        name: 'closevoting',
        data: {
          ballot_name: ballot.ballot_name,
          broadcast: true
        }
      },
      {
        account: 'telos.decide',
        name: 'deleteballot',
        data: {
          ballot_name: ballot.ballot_name
        }
      }
    ]
    const transaction = await this.$api.signTransaction(actions)
    commit('resetBallots')
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export const cancelBallot = async function ({ commit }, ballot) {
  const notification = {
    icon: 'fas fa-person-booth',
    title: 'notifications.trails.cancelBallot',
    content: `Ballot: ${ballot.title}`
  }
  try {
    const actions = [
      {
        account: 'telos.decide',
        name: 'cancelballot',
        data: {
          ballot_name: ballot.ballot_name,
          memo: 'Cancel ballot'
        }
      }
    ]
    const transaction = await this.$api.signTransaction(actions)
    commit('resetBallots')
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
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
      account: 'telos.decide',
      name: 'refresh',
      data: {
        voter: rootState.accounts.account
      }
    }, {
      account: 'telos.decide',
      name: 'castvote',
      data: {
        voter: rootState.accounts.account,
        ballot_name: ballotName,
        options
      }
    }]
    const transaction = await this.$api.signTransaction(actions)
    transaction === null ? notification.status = 'error' : notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
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
      account: 'telos.decide',
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
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

// Ballots

// Treasuries
export const fetchTreasuries = async function ({ commit, state, rootState }) {
  const result = await this.$api.getTableRows({
    code: 'telos.decide',
    scope: 'telos.decide',
    table: 'treasuries',
    limit: state.treasuries.list.pagination.limit
  })

  const voter = await this.$api.getTableRows({
    code: 'telos.decide',
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
    code: 'telos.decide',
    scope: 'telos.decide',
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
          to: 'telos.decide',
          quantity: deposit,
          memo: 'fees-deposit'
        }
      },
      {
        account: 'telos.decide',
        name: 'newtreasury',
        data: {
          manager,
          max_supply: maxSupply,
          access
        }
      },
      {
        account: 'telos.decide',
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
    notification.error = e
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
        account: 'telos.decide',
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
    notification.error = e
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
      account: 'telos.decide',
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
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}
// Treasuries
