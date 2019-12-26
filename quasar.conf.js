require('dotenv').config()

const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [
      'layouts',
      'axios',
      'i18n',
      { path: 'ual', server: false },
      { path: 'api', server: false },
      'ppp',
      'mixins',
      'ga'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.sass'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v4',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // 'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'fontawesome-v5', // Quasar icon set
      // lang: 'de', // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: false,

      components: [
        'QAvatar',
        'QBadge',
        'QBtn',
        'QCard',
        'QCardActions',
        'QCardSection',
        'QChatMessage',
        'QCheckbox',
        'QChip',
        'QDate',
        'QDialog',
        'QDrawer',
        'QEditor',
        'QExpansionItem',
        'QFab',
        'QFabAction',
        'QForm',
        'QHeader',
        'QIcon',
        'QImg',
        'QInfiniteScroll',
        'QInnerLoading',
        'QInput',
        'QItem',
        'QItemLabel',
        'QItemSection',
        'QLayout',
        'QList',
        'QMenu',
        'QOptionGroup',
        'QPage',
        'QPageContainer',
        'QPageSticky',
        'QPopupProxy',
        'QRadio',
        'QScrollArea',
        'QSelect',
        'QSeparator',
        'QSpace',
        'QSpinner',
        'QSpinnerComment',
        'QSpinnerDots',
        'QTime',
        'QToggle',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip'
      ],

      directives: [
        'ClosePopup',
        'Ripple'
      ],

      // Quasar plugins
      plugins: ['Notify', 'Loading']
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: false,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      env: {
        APP_NAME: process.env.APP_NAME, // Used by scatter
        NETWORK_PROTOCOL: process.env.NETWORK_PROTOCOL,
        NETWORK_HOST: process.env.NETWORK_HOST,
        NETWORK_PORT: process.env.NETWORK_PORT,
        NETWORK_CHAIN_ID: process.env.NETWORK_CHAIN_ID,
        PPP_ENV: process.env.PPP_ENV,
        WEBSERVICES_URL: process.env.WEBSERVICES_URL,
        WEBSERVICES_API_KEY: process.env.WEBSERVICES_API_KEY,
        BLOCKCHAIN_EXPLORER: process.env.BLOCKCHAIN_EXPLORER,
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })

        cfg.module.rules.push({
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        })

        cfg.module.rules.push({
          test: /\.mjs$/,
          type: 'javascript/auto'
        })

        cfg.plugins.push(new CopyWebpackPlugin(
          [{ from: './src/statics/*.json', to: './', force: true, flatten: true }],
          { copyUnmodified: true }
        ))

        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '~': path.resolve(__dirname, 'src')
        }
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Telos Net',
        // short_name: 'Telos Net',
        // description: 'TODO desc',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    // https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'telos-net'
      }
    }
  }
}
