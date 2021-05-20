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
