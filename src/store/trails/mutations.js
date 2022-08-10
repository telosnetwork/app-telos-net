import { supplyToSymbol } from '../../utils/assets'

const VOTE_SYMBOL = 'VOTE'
const HALF_YEAR_IN_MS = 15552000000

export const setFees = (state, config) => {
  state.fees = config.fees
}

export const resetBallots = (state) => {
  console.log(`resetballots called`)
  state.ballots.list.data = []
  state.ballots.list.loaded = false
  console.log(`ballots reset`)
}

const removeOldBallot = (ballots, timeLimit) =>
  ballots.filter(
    (ballot) => new Date().getTime() - new Date(ballot.end_time).getTime() < timeLimit
  )

export const addBallots = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.ballots.list.data.length ? rows.slice(1) : rows
    const filteredArr = removeOldBallot(arr, HALF_YEAR_IN_MS)
    state.ballots.list.data = state.ballots.list.data.concat(filteredArr)
  }
  state.ballots.list.loaded = !more
}

export const setBallots = (state, { rows, more }) => {
  if (rows) {
    state.ballots.list.data = rows
  }
  state.ballots.list.loaded = !more
}

export const stopAddBallots = (state) => {
  state.ballots.list.loaded = true
}

export const setBallot = (state, ballot) => {
  state.ballots.view.ballot = ballot
}

export const setUserTreasuries = (state, treasuries) => {
  state.userTreasuries = treasuries
}

export const setBallotVotes = (state, voters) => {
  state.ballotVoters = voters
}

export const resetTreasuries = (state) => {
  state.treasuries.list.data = []
  state.treasuries.list.loaded = false
}

const putVoteFirst = (treasuries) => {
  if (treasuries[0] && treasuries[0].symbol === VOTE_SYMBOL) {
    return treasuries
  }

  const voteTreasury = treasuries.find((treasury) => treasury.symbol === VOTE_SYMBOL)
  const indexOfVote = treasuries.indexOf(voteTreasury)
  treasuries.splice(indexOfVote, 1)
  return [ voteTreasury, ...treasuries ]
}

const sortTreasuries = (treasuries) => {
  const sortArr = treasuries.sort((treasuryA, treasuryB) => treasuryB.voters - treasuryA.voters)
  return putVoteFirst(sortArr)
}

export const addTreasuries = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.treasuries.list.data.length ? rows.slice(1) : rows
    const stateArr = state.treasuries.list.data.length < state.treasuries.list.pagination.limit ? [] : state.treasuries.list.data
    const fullArr = stateArr.concat(arr
      .map(treasury => ({
        ...treasury,
        symbol: supplyToSymbol(treasury.max_supply)
      })))
    state.treasuries.list.data = sortTreasuries(fullArr)
  }
  state.treasuries.list.loaded = !more
}

export const updateTreasury = (state, { title, description, treasury }) => {
  const obj = state.treasuries.list.data.find(t => t.max_supply === treasury.max_supply)
  obj.title = title
  obj.description = description
}

export const setTreasury = (state, treasury) => {
  state.treasuries.view.treasury = treasury
}

export const increaseVoters = (state, idx) => {
  state.treasuries.list.data[idx].voters++
  state.treasuries.list.data[idx].isRegistered = true
}
