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
// Treasuries
