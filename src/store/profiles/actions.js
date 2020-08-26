import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ commit }, mData) {
  const newProfileAction = [{
    account: 'profiles',
    name: 'newprofile',
    data: {
      account: this.$ualUser.accountName,
      ...mData
    }
  }]

  let transaction = null

  try {
    transaction = await this.$api.signTransaction(newProfileAction)
  } catch (e) {
    console.log(e)
  }

  return transaction
}

export const searchProfiles = async function ({ commit }, options = {}) {
  const profileApi = PPP.profileApi()
  const { search, clean, lastEvaluatedKey, limit } = options
  try {
    await profileApi.searchProfiles(search, limit, lastEvaluatedKey).then(response => {
      if (clean === true) commit('clearProfilesList')
      commit('setProfiles', response)
    })
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearProfilesList = function ({ commit }, options = {}) {
  commit('clearProfilesList')
}

export const getProfile = async function ({ commit }) {
  try {
    const profileResult = await this.$api.getTableRows({
      code: 'profiles',
      scope: 'profiles',
      table: 'profiles',
      limit: 1,
      index_position: 1,
      key_type: 'i64',
      lower_bound: this.$ualUser.accountName,
      upper_bound: this.$ualUser.accountName
    })

    const profile = profileResult.rows[0]
    commit('setProfile', profile)

    return profile
  } catch (error) {
    commit('general/setErrorMsg', error.message || error, { root: true })
  }
}

export const verifySMS = async function ({ commit }, code) {
  return PPP.profileApi().verifySms(code)
}

export const verifyEmail = async function ({ commit }, code) {
  return PPP.profileApi().verifyEmail(code)
}

export const setPPPLoading = async function ({ commit }, PPPLoading) {
  commit('setPPPLoading', PPPLoading)
}
