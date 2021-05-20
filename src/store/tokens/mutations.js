export function setTokens (state, tokens) {
  state.tokens = tokens
}

export function setConfig (state, config) {
  state.config = config
}

export function createToken (state, enabled) {
  state.createToken = enabled
  state.editToken = null
}

export function editToken (state, token) {
  state.createToken = false
  state.editingToken = token
}
