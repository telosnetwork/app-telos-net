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
  q-btn(
    :label="$t('common.buttons.logout')"
    @click="logout"
    :color="landingPage ? 'primary' : 'secondary'"
    :text-color="landingPage ? 'white' : 'primary'"
    rounded
    unelevated
  )
</template>
