export const setFees = (state, config) => {
  state.fees = config.fees
}

export const resetBallots = (state) => {
  state.ballots.list.data = []
  state.ballots.list.loaded = false
}

export const addBallots = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.ballots.list.data.length ? rows.slice(1) : rows
    state.ballots.list.data = state.ballots.list.data.concat(arr)
  }
  state.ballots.list.loaded = !more
}

export const setBallot = (state, ballot) => {
  state.ballots.view.ballot = ballot
}

export const resetTreasuries = (state) => {
  state.treasuries.list.data = []
  state.treasuries.list.loaded = false
}

export const addTreasuries = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.treasuries.list.data.length ? rows.slice(1) : rows
    state.treasuries.list.data = state.treasuries.list.data.concat(arr)
  }
  state.treasuries.list.loaded = !more
}

export const setTreasury = (state, treasury) => {
  state.treasuries.view.treasury = treasury
}

export const increaseVoters = (state, idx) => {
  state.treasuries.list.data[idx].voters++
}
