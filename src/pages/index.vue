<script>
export default {
  name: 'page-index'
}
</script>

<template lang="pug">
  q-page.flex.column
    .main-splash
      img.imgSplash(src="../app-splashscreen.png")
    .col-9.flex.flex-center.col-grow.q-pa-lg
      div
        q-btn.full-width.q-mb-lg(
          to="/login"
          color="primary"
          :label="$t('pages.index.buttons.login')"
          icon="app:login"
          rounded
          unelevated
          size="lg"
        )
        q-btn.full-width(
          to="/accounts/add"
          color="primary"
          :label="$t('pages.index.buttons.createAccount')"
          icon="app:create-account"
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
.main-splash
  max-height: 25%
  text-align: center
.p-title
  margin-top: 10px
  font-size: 18px
.q-btn-item
  /deep/div
    font-size: 14px
  /deep/i
    font-size: 18px
.imgSplash
  min-width: 200px
  max-height: 100px
  margin-top: 80px

@media screen and (max-width: 360px)
  .imgSplash
    max-width: 150px
    max-height: 100px
    margin-bottom: 20px
</style>
