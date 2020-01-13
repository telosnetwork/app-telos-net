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
      idx: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['loading'])
  },
  methods: {
    ...mapActions('accounts', ['login', 'autoLogin']),
    async onLogin (idx) {
      this.idx = idx
      await this.login({ idx: this.idx, returnUrl: this.$route.query.returnUrl })
    },
    async onAccountEntered (account) {
      await this.login({ idx: this.idx, account, returnUrl: this.$route.query.returnUrl })
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
  div
    h2.title ¿Autorizar a Starting 11 a acceder a tu cuenta?
  .row.justify-center.items-center
    q-img.app_icon(src='https://placeimg.com/500/300/nature', style="height: 140px; max-width: 150px")
    .col-xs-12.col-md-6
      q-list
        q-item(
          v-for="(wallet, idx) in $ual.authenticators"
          :key="wallet.getStyle().text"
          v-ripple
          :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }"
          v-if="wallet.shouldRender()"
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
    request-account(
      @accountEntered="onAccountEntered"
    )

</template>

<style>
  .title {
    color: #ffffff;
    font-size: 25px;
    text-align: center;
  }
  .app_icon {
    margin: 10px;
    margin-bottom: 50px;
  }
</style>
