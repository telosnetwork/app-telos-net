<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(
          v-if="isAuthenticated"
          flat
          dense
          round
          @click="menu = !menu"
          icon="menu"
          aria-label="Menu"
        )
        q-toolbar-title Telos Net
        login(v-if="!isAuthenticated")
        right-menu-authenticated(v-if="isAuthenticated")
    q-page-container
      router-view
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Login from '~/components/layout/login'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'

export default {
  name: 'main-layout',
  components: {
    RightMenuAuthenticated,
    Login
  },
  data () {
    return {
      menu: false
    }
  },
  async mounted () {
    await this.autoLogin()
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  },
  methods: {
    ...mapActions('accounts', ['autoLogin'])
  }
}
</script>
