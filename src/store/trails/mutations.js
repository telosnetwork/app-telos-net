export const addBallots = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.ballots.list.data.length ? rows.slice(1) : rows
    state.ballots.list.data = state.ballots.list.data.concat(arr)
  }
  state.ballots.list.loaded = !more
}

export const addTreasuries = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.treasuries.list.data.length ? rows.slice(1) : rows
    state.treasuries.list.data = state.treasuries.list.data.concat(arr)
  }
  state.treasuries.list.loaded = !more
}
