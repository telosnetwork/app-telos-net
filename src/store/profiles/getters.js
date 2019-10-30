export const needVerifyComm = (state) => {
  const profile = state.myProfile

  if (profile.commPref === 'EMAIL') {
    return !!profile.emailInfo.needsToVerify
  } else if (profile.commPref === 'SMS') {
    return !!profile.smsInfo.needsToVerify
  }
}

export const isRegistered = (state) => {
  const profile = state.myProfile

  if (profile === undefined) {
    return false
  } else if (profile !== undefined) {
    return true
  }

  return false
}
