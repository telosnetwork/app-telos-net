<script>
import { mapGetters } from 'vuex'

export default {
  name: 'congratulations',
  computed: {
    ...mapGetters('accounts', ['signUpAccount'])
  }
}
</script>

<template lang="pug">
  q-page.flex.align-center.column.q-pa-lg.congratulations
    .col-3
      h1 {{ $t('pages.accounts.add.congratulationsTitle') }}
      i18n(path="pages.accounts.add.congratulationsSubtitle" tag="h2")
        strong(slot="account") {{ signUpAccount }}
    .col-6
      img(src="statics/accounts/congratulations.jpg" alt="congratulations")
    .col-3
      q-btn.full-width(
        color="primary"
        :label="$t('pages.accounts.add.buttons.goToProfile')"
        size="lg"
        unelevated
        to="/"
      )
</template>

<style lang="sass" scoped>
.congratulations
  width: 100%
  max-width: 500px
  margin: 0 auto
  h1
    color: $primary
    font-size: 40px
    text-align: center
    font-weight: 600
    margin: 0
  h2
    color: $primary
    font-size: 20px
    text-align: center
    font-weight: 400
    margin: 0
  .q-btn-item
    margin-top: 50px
    /deep/div
      font-size: 12px
</style>
