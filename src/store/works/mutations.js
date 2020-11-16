export function clearWorks (state) {
  state.active = []
  state.inactive = []
}

export function addActive (state, proposal) {
  state.active.push(proposal)
}

export function addInactive (state, proposal) {
  state.inactive.push(proposal)
}
