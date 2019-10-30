export const needVerifyComm = (state) => {
  const profile = state.myProfile

  if (profile.commPref === 'EMAIL') {
    return !!profile.emailInfo.needsToVerify
  } else if (profile.commPref === 'SMS') {
    return !!profile.smsInfo.needsToVerify
  }
}
