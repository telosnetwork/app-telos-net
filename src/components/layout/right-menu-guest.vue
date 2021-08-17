<script>
import Btn from '../btn'

import { mapActions } from 'vuex'
export default {
  name: 'right-menu-guest',
  components: { Btn },
  props: {
    landingPage: Boolean
  },
  mounted () {
    this.$router.onReady(() => {
      this.autoLogin(this.$route.fullPath)
    })
  },
  methods: {
    ...mapActions('accounts', ['autoLogin']),
    loginClick () {
      this.$router.push({
        path: '/login/', query: { returnUrl: this.$route.path }
      })
    }
  }
}
</script>

<template lang="pug">
div.btns-wrapper.row.justify-between
  btn.create-btn(
    to="/accounts/add"
    :labelText="$t('pages.index.buttons.createAccount')"
    fontSize='15'
  )
  btn.login-btn(
    @clickBtn='loginClick'
    :labelText="$t('pages.index.buttons.login')"
    primary
    fontSize='15'
  )
</template>

<style lang="sass">
  .btns-wrapper
    gap: 24px
  .create-btn,
  .login-btn
    padding: 0 12px
  @media (max-width: 990px)
    .btns-wrapper
      gap: 12px
    .create-btn,
    .login-btn
      font-size: 13px !important
      padding: 0 9px
</style>
