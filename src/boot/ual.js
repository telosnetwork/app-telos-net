import { UAL } from 'universal-authenticator-library'
import { EOSIOAuth } from '@smontero/ual-eosio-reference-authenticator'
import { KeycatAuthenticator } from '@telosnetwork/ual-telos-keycat'
import { Ledger } from 'ual-ledger'
import { Scatter } from 'ual-scatter'
import { Sqrl } from '@smontero/ual-sqrl'
import { Anchor } from 'ual-anchor'
import { Wombat } from 'ual-wombat'

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
    new KeycatAuthenticator([mainChain]),
    new Anchor([mainChain], { appName: process.env.APP_NAME }),
    new Sqrl([mainChain], { appName: process.env.APP_NAME }),
    new Wombat([mainChain], { appName: process.env.APP_NAME }),
    new Ledger([mainChain]),
    new Scatter([mainChain], { appName: process.env.APP_NAME }),
    new EOSIOAuth([mainChain], { appName: process.env.APP_NAME, protocol: 'eosio' })
  ]

  const ual = new UAL([mainChain], 'tet-ual', authenticators)
  store['$ual'] = ual
  Vue.prototype.$ual = ual
}
