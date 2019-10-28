import ecc from 'eosjs-ecc'

export const generateKeys = async () => {
  const privateKey = await ecc.randomKey()
  const publicKey = await ecc.privateToPublic(privateKey)
  return {
    privateKey,
    publicKey
  }
}
