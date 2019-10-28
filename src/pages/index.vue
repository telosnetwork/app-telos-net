<template lang="pug">
  q-page.flex.flex-center
    <router-link class="routers" to="/chat">{{ $t('components.index.router.chat') }}</router-link>
    <router-link class="routers" to="/signUp">{{ $t('components.index.router.signUp') }}</router-link>
    <router-link class="routers" to="/chatList">{{ $t('components.index.router.chatList') }}</router-link>
    <router-link class="routers" to="/contactList">{{ $t('components.index.router.contactList') }}</router-link>
    <router-link class="routers" to="/registerApp">{{ $t('components.index.router.registerApp') }}</router-link>
    <router-link class="routers" to="/appList">{{ $t('components.index.router.appList') }}</router-link>
</template>

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
