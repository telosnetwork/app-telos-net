<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'right-menu-authenticated',
  props: {
    landingPage: Boolean
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  methods: {
    ...mapActions('accounts', ['logout'])
  }
}
</script>

<template lang="pug">
div
  q-btn(
    to="/profiles/myProfile"
    :label="account"
    :text-color="landingPage ? 'black' : 'white'"
    flat
    no-caps
  )
    q-avatar(size="32px")
      img(src="statics/user.png")
  q-btn.arrow-btn(
    flat
    icon="fas fa-chevron-down"
    size="sm"
    color="black"
  )
    q-menu
      q-list(dense)
        q-item
          q-btn(
            :label="$t('common.buttons.logout')"
            @click="logout"
            :color="landingPage ? 'primary' : 'secondary'"
            :text-color="landingPage ? 'white' : 'primary'"
            rounded
            unelevated
          )
</template>

<style lang="sass" scoped>
</style>
