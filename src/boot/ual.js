import { UAL } from 'universal-authenticator-library'
import { Anchor } from 'ual-anchor'

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    origin: process.env.TELOS_ORIGIN,
    rpcEndpoints: [{
      protocol: process.env.NETWORK_PROTOCOL,
      host: process.env.NETWORK_HOST,
      port: process.env.NETWORK_PORT
    }]
  }

  const authenticators = [
    new Anchor([mainChain], { appName: process.env.APP_NAME })
  ]

  const ual = new UAL([mainChain], 'tet-ual', authenticators)
  store['$ual'] = ual
  Vue.prototype.$ual = ual
}
