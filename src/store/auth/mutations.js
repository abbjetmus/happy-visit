export function setAuthState (state, data) {
  state.isAuthenticated = data.isAuthenticated
  state.isReady = data.isReady
  state.uid = data.uid
}

export function setScroll (state, data) {
  state.scroll = data
}
