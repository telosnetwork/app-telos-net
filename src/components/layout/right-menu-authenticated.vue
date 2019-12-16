<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'right-menu-authenticated',
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
    flat
    no-caps
  )
  q-btn(
    :label="$t('common.buttons.logout')"
    @click="logout"
    color="secondary"
  )
</template>
