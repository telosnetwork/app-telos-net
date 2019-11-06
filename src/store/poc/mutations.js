export const resetSafes = (state) => {
  state.safes.list.data = []
  state.safes.list.loaded = false
}

export const addSafes = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.safes.list.data.length ? rows.slice(1) : rows
    state.safes.list.data = state.safes.list.data.concat(arr)
  }
  state.safes.list.loaded = !more
}
