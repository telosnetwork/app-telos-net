<script>
import Btn from '../btn'

export default {
  name: 'right-menu-guest',
  components: { Btn },
  props: {
    landingPage: Boolean
  },
  methods: {
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
    btnWidth='160'
    fontSize='15'
  )
  btn.login-btn(
    @clickBtn='loginClick'
    :labelText="$t('pages.index.buttons.login')"
    primary
    btnWidth='75'
    fontSize='15'
  )
</template>

<style lang="sass">
  .btns-wrapper
    gap: 24px
  @media (max-width: 980px)
    .btns-wrapper
      gap: 12px
    .create-btn,
    .login-btn
      font-size: 14px !important
    .create-btn
      width: auto !important
    .login-btn
      width: auto !important
</style>
