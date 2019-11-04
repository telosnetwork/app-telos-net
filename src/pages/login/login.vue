<script>
import { mapActions, mapGetters } from 'vuex'
import RequestAccount from './components/request-account'

export default {
  name: 'page-login',
  components: {
    RequestAccount
  },
  data () {
    return {
      show: false,
      error: null,
      requestAccount: false,
      idx: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['loading'])
  },
  methods: {
    ...mapActions('accounts', ['login', 'autoLogin', 'fetchAvailableAccounts']),
    async onLogin (idx) {
      this.idx = idx
      this.error = null
      const authenticator = this.$ual.authenticators[idx]
      await authenticator.init()
      const requestAccount = await authenticator.shouldRequestAccountName()
      if (requestAccount) {
        await this.fetchAvailableAccounts({ idx })
        this.requestAccount = requestAccount
      } else {
        this.loginUser()
      }
    },
    async loginUser (account) {
      const error = await this.login({ idx: this.idx, account, returnUrl: this.$route.query.returnUrl })
      if (!error) {
        this.show = false
      } else {
        this.error = error
      }
    },
    openUrl (url) {
      window.open(url)
    }
  },
  async mounted () {
    await this.autoLogin(this.$route.query.returnUrl)
  }
}
</script>

<template lang="pug">
  div
    q-list.full-width
      q-item(
        v-for="(wallet, idx) in $ual.authenticators"
        :key="wallet.getStyle().text"
        v-ripple
        :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }"
      )
        q-item-section.cursor-pointer(
          avatar
          @click="onLogin(idx)"
        )
          img(
            :src="wallet.getStyle().icon"
            width="30"
          )
        q-item-section.cursor-pointer(@click="onLogin(idx)") {{ wallet.getStyle().text }}
        q-item-section(avatar)
          .flex
            q-spinner(
              v-if="loading === wallet.getStyle().text"
              :color="wallet.getStyle().textColor"
              size="2em"
            )
            q-btn(
              v-else
              :color="wallet.getStyle().textColor"
              icon="fas fa-download"
              @click="openUrl(wallet.getOnboardingLink())"
              target="_blank"
              dense
              flat
              size="12px"
            )
              q-tooltip {{ $t('pages.login.getApp') }}
      q-item(
        v-if="error"
        :active="!!error"
        active-class="bg-red-1 text-grey-8"
      )
        q-item-section {{ error }}
    request-account(
      :show.sync="requestAccount"
      @accountEntered="loginUser"
    )

</template>
