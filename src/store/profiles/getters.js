export const needVerifyComm = (state) => {
  const profile = state.myProfile
  console.log(profile)

  if (!profile.publicData.isVerified || profile.publicData.isVerified === 0) {
    return true
  } else {
    return false
  }

  // if (profile.commPref === 'EMAIL') {
  //   return !!profile.emailInfo.needsToVerify
  // } else if (profile.commPref === 'SMS') {
  //   return !!profile.smsInfo.needsToVerify
  // }
}

export const isRegistered = (state) => {
  const profile = state.myProfile
  // console.log('isRegistered', profile)
  if (profile === undefined) {
    return false
  } else if (profile !== undefined) {
    return true
  }

  return false
}

export const isPPPLoading = (state) => {
  return state.isPPPLoading
}
