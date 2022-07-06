export async function loadTokens ({ commit }) {
  let tokens = []
  let more = true
  let nextKey
  while (more) {
    let query = {
      code: process.env.TOKENMANAGER_CONTRACT,
      scope: process.env.TOKENMANAGER_CONTRACT,
      table: 'tokens',
      limit: 1000
    }

    if (nextKey) query.lower_bound = nextKey

    let response = await this.$api.getTableRows(query)
    tokens.push(...response.rows)
    more = response.more

    if (more) nextKey = response.next_key
  }

  commit('setTokens', tokens)
}

export async function loadConfig ({ commit }) {
  let response = await this.$api.getTableRows({
    code: process.env.TOKENMANAGER_CONTRACT,
    scope: process.env.TOKENMANAGER_CONTRACT,
    table: 'config',
    limit: 1
  })
  commit('setConfig', response.rows[0])
}

export async function doCreateToken ({ commit }, { symbol, name, logoSm, logoLg, maxSupply, decimals, createPrice }) {
  const notification = {
    icon: 'fas fa-info',
    title: 'notifications.tokens.create',
    content: `Create token ${name} (${symbol})`
  }
  try {
    const actions = [
      {
        account: process.env.TOKENMANAGER_CONTRACT,
        name: 'openacct',
        data: {
          account_name: this.$ualUser.accountName.toLowerCase()
        }
      },
      {
        account: 'eosio.token',
        name: 'transfer',
        data: {
          from: this.$ualUser.accountName.toLowerCase(),
          to: process.env.TOKENMANAGER_CONTRACT,
          quantity: createPrice,
          memo: `Payment for creating ${name} (${symbol}) token`
        }
      },
      {
        account: process.env.TOKENMANAGER_CONTRACT,
        name: 'createtoken',
        data: {
          owner: this.$ualUser.accountName.toLowerCase(),
          token_symbol: symbol,
          token_name: name,
          max_supply: `${maxSupply.toFixed(decimals)} ${
            symbol
          }`,
          logo_sm: logoSm,
          logo_lg: logoLg
        }
      }
    ]
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

export async function setMeta ({ commit }, { symbol, name, logoSm, logoLg }) {
  const notification = {
    icon: 'fas fa-info',
    title: 'notifications.tokens.setmeta',
    content: `Set token info for ${name} (${symbol})`
  }
  try {
    const transaction = await this.$api.signTransaction([
      {
        account: process.env.TOKENMANAGER_CONTRACT,
        name: 'setmeta',
        data: {
          token_symbol: symbol,
          token_name: name,
          logo_sm: logoSm,
          logo_lg: logoLg
        }
      }
    ])
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export async function issueTokens ({ commit }, { symbol, decimals, contractAccount, amount, memo }) {
  let quantity = `${parseFloat(amount).toFixed(decimals)} ${symbol}`
  const notification = {
    icon: 'fas fa-info',
    title: 'notifications.tokens.issue',
    content: `Issue ${quantity}`
  }
  try {
    const transaction = await this.$api.signTransaction([
      {
        account: contractAccount,
        name: 'issue',
        data: {
          to: this.$ualUser.accountName,
          quantity,
          memo
        }
      }
    ])
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export async function retireTokens ({ commit }, { symbol, decimals, contractAccount, amount, memo }) {
  let quantity = `${parseFloat(amount).toFixed(decimals)} ${symbol}`
  const notification = {
    icon: 'fas fa-info',
    title: 'notifications.tokens.retire',
    content: `Retire ${quantity}`
  }
  try {
    const transaction = await this.$api.signTransaction([
      {
        account: contractAccount,
        name: 'retire',
        data: {
          quantity,
          memo
        }
      }
    ])
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

export async function transferTokens ({ commit }, { symbol, decimals, contractAccount, amount, memo, to }) {
  let quantity = `${parseFloat(amount).toFixed(decimals)} ${symbol}`
  const notification = {
    icon: 'fas fa-info',
    title: 'notifications.tokens.transfer',
    content: `Transfer ${quantity}`
  }
  try {
    const transaction = await this.$api.signTransaction([
      {
        account: contractAccount,
        name: 'transfer',
        data: {
          from: this.$ualUser.accountName,
          to,
          quantity,
          memo
        }
      }
    ])
    notification.status = 'success'
    notification.transaction = transaction
  } catch (e) {
    notification.status = 'error'
    notification.error = e
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}
