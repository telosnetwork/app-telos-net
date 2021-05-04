<script>
export default {
  name: 'right-menu-guest',
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
div
  q-btn.q-mr-sm(
    to="/accounts/add"
    rounded
    outline
    :label="$t('pages.index.buttons.createAccount')"
    :text-color="landingPage ? 'black' : 'blue'"
    :color="landingPage ? 'black' : 'blue'"
  )
  q-btn.q-mr-sm(
    @click='loginClick'
    :label="$t('pages.index.buttons.login')"
    :color="landingPage ? 'primary' : 'secondary'"
    :text-color="landingPage ? 'white' : 'primary'"
    rounded
    unelevated
  )
</template>

<style lang="sass" scoped></style>
