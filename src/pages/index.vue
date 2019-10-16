<script>
export default {
  name: 'page-index'
}
</script>

<template lang="pug">
  q-page.flex.column
    .col-3.main-title
      h1 {{ $t('common.appName') }}
    .col-9.flex.flex-center.col-grow.q-pa-lg
      div
        q-btn.full-width.q-mb-lg(
          to="/login"
          color="primary"
          :label="$t('pages.index.buttons.login')"
          icon="fas fa-globe-europe"
          rounded
          unelevated
          size="lg"
        )
        q-btn.full-width(
          to="/accounts/add"
          color="primary"
          :label="$t('pages.index.buttons.createAccount')"
          icon="fas fa-globe-europe"
          rounded
          outline
          size="lg"
        )
</template>

<style lang="sass" scoped>
.main-title
  color: white
  background: $primary
  max-height: 25%
  text-align: center
  h1
    font-size: 36px
    padding: 50px 20px 0
.q-btn-item
  /deep/div
    font-size: 14px
  /deep/i
    font-size: 18px
</style>
