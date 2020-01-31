
export const setMyApps = (state, myApps) => {
  state.appList = myApps
}

export const clearMyAppList = (state) => {
  state.appList = undefined
}

export const setSelectedApp = (state, selectedApp) => {
  state.selectedApp = selectedApp
}

export const setAuthorizedAppList = (state, authorizedAppList) => {
  state.authorizedAppList = authorizedAppList
}

export const clearAuthorizedAppList = (state) => {
  state.authorizedAppList = undefined
}
