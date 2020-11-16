// import PPP from '@smontero/ppp-client-api'

export const signUp = async function ({ commit }, profileData) {
  const actions = []

  await getProfile({ commit })

  if (!this.state.profiles.myProfile) {
    actions.push({
      account: 'profiles',
      name: 'newprofile',
      data: {
        account: this.$ualUser.accountName,
        ...profileData
      }
    })
  } else {
    const myProfile = this.state.profiles.myProfile
    // check undefined of all these in case the user is setting them to '' which would be falsy
    if (profileData.avatar !== undefined && myProfile.avatar !== profileData.avatar) {
      actions.push({
        account: 'profiles',
        name: 'editavatar',
        data: {
          account: this.$ualUser.accountName,
          new_avatar: profileData.avatar || ''
        }
      })
    }

    if (profileData.bio !== undefined && myProfile.bio !== profileData.bio) {
      actions.push({
        account: 'profiles',
        name: 'editbio',
        data: {
          account: this.$ualUser.accountName,
          new_bio: profileData.bio || ''
        }
      })
    }

    if (profileData.display !== undefined && myProfile.display !== profileData.display) {
      actions.push({
        account: 'profiles',
        name: 'editdisplay',
        data: {
          account: this.$ualUser.accountName,
          new_display_name: profileData.display || ''
        }
      })
    }

    if (profileData.status !== undefined && myProfile.status !== profileData.status) {
      actions.push({
        account: 'profiles',
        name: 'editstatus',
        data: {
          account: this.$ualUser.accountName,
          new_status: profileData.status || ''
        }
      })
    }
  }

  let transaction = null

  try {
    transaction = await this.$api.signTransaction(actions)
  } catch (e) {
    console.log(e)
  }

  return transaction
}

export const searchProfiles = async function ({ commit }, options = {}) {
  // const profileApi = PPP.profileApi()
  const { search, clean, lastEvaluatedKey, limit } = options
  try {
    const profileResult = await this.$api.getTableRows({
      code: 'profiles',
      scope: 'profiles',
      table: 'profiles',
      limit: limit,
      index_position: 1,
      key_type: 'i64',
      lower_bound: lastEvaluatedKey || 0
    })
    if (clean === true) {
      commit('clearProfilesList')
    }

    const filteredProfiles = profileResult.rows.filter(
      row => !search || row.account_name.startsWith(search.toLowerCase())
    )

    const lastKey = profileResult.rows ? profileResult.rows[profileResult.rows.length - 1] : undefined
    commit('setProfiles', { lastEvaluatedKey: lastKey, items: filteredProfiles })
  /*
  await profileApi.searchProfiles(search, limit, lastEvaluatedKey).then(response => {
    if (clean === true) commit('clearProfilesList')
    commit('setProfiles', response)
  })
  */
  } catch (error) {
    console.log('Error', error)
  }
}

export const clearProfilesList = function ({ commit }, options = {}) {
  commit('clearProfilesList')
}

export const getProfile = async function ({ commit }) {
  if (!this.$ualUser || !this.$ualUser.accountName) {
    return
  }

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

/*
export const verifySMS = async function ({ commit }, code) {
  return PPP.profileApi().verifySms(code)
}

export const verifyEmail = async function ({ commit }, code) {
  return PPP.profileApi().verifyEmail(code)
}

export const setPPPLoading = async function ({ commit }, PPPLoading) {
  commit('setPPPLoading', PPPLoading)
}
*/
