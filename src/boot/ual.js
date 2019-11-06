import { UAL } from 'universal-authenticator-library'
import { EOSIOAuth } from '@smontero/ual-eosio-reference-authenticator'
import { KeycatAuthenticator } from '@smontero/ual-keycat'
import { Ledger } from 'ual-ledger'
import { Lynx } from '@smontero/ual-lynx'
import { Scatter } from 'ual-scatter'
import { Sqrl } from '@smontero/ual-sqrl'
import { TokenPocket } from '@smontero/ual-token-pocket'

export default async ({ Vue, store }) => {
  const mainChain = {
    chainId: process.env.NETWORK_CHAIN_ID,
    rpcEndpoints: [{
      protocol: process.env.NETWORK_PROTOCOL,
      host: process.env.NETWORK_HOST,
      port: process.env.NETWORK_PORT
    }]
  }
  const authenticators = [
    new EOSIOAuth([mainChain], { appName: process.env.APP_NAME, protocol: 'eosio' }),
    new Sqrl([mainChain], { appName: process.env.APP_NAME }),
    new KeycatAuthenticator([mainChain]),
    new Ledger([mainChain]),
    new Lynx([mainChain]),
    new Scatter([mainChain], { appName: process.env.APP_NAME }),
    new TokenPocket([mainChain])
  ]

  const ual = new UAL([mainChain], 'tet-ual', authenticators)
  store['$ual'] = ual
  Vue.prototype.$ual = ual
}
