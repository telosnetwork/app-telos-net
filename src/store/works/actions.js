export const fetchWorks = async function ({ commit, state }) {
  commit('clearWorks')
  let more = true
  let nextKey = ''
  while (more) {
    const result = await this.$api.getTableRows({
      code: 'works.decide',
      scope: 'works.decide',
      table: 'proposals',
      lower_bound: nextKey || '',
      upper_bound: ''
    })
    more = result.more
    nextKey = result.next_key
    result.rows.map(async row => decorateAndCommit(commit, this.$api, row))
  }
}

async function decorateAndCommit (commit, api, proposal) {
  const result = await api.getTableRows({
    code: 'telos.decide',
    scope: 'telos.decide',
    table: 'ballots',
    lower_bound: proposal.proposal_name,
    upper_bound: proposal.proposal_name
  })
  proposal.ballotData = result.rows[0]
  commit((proposal.ballotData.status === 'voting' ? 'addActive' : 'addInactive'), proposal)
}
