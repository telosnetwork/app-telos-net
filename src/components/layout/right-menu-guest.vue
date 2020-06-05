<script>
export default {
  name: 'right-menu-guest',
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
    @click='loginClick'
    :label="$t('pages.index.buttons.login')"
    color="accent"
    text-color="black"
    rounded
  )
  q-btn(
    to="/accounts/add"
    :label="$t('pages.index.buttons.createAccount')"
    color="secondary"
  )
</template>

<style lang="sass" scoped></style>
