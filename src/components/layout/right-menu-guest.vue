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
  btn(
    to="/accounts/add"
    :labelText="$t('pages.index.buttons.createAccount')"
    btnWidth=160
    fontSize=15
  )
  btn(
    @clickBtn='loginClick'
    :labelText="$t('pages.index.buttons.login')"
    primary
    btnWidth=75
    fontSize=15
  )
  //- q-btn.q-mr-sm(
  //-   to="/accounts/add"
  //-   rounded
  //-   outline
  //-   :label="$t('pages.index.buttons.createAccount')"
  //-   :text-color="landingPage ? 'black' : 'blue'"
  //-   :color="landingPage ? 'black' : 'blue'"
  //- )
  //- q-btn.q-mr-sm(
  //-   @click='loginClick'
  //-   :label="$t('pages.index.buttons.login')"
  //-   :color="landingPage ? 'primary' : 'secondary'"
  //-   :text-color="landingPage ? 'white' : 'white'"
  //-   rounded
  //-   unelevated
  //- )
</template>

<style lang="sass" scoped>
  .btns-wrapper
    width: 250px
</style>
