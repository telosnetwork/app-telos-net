
export const setMyApps = (state, myApps) => {
  state.appList = myApps
}

export const clearMyAppList = (state) => {
  state.appList = undefined
}
