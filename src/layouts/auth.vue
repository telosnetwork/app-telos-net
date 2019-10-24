<script>
import { mapActions, mapGetters } from 'vuex'
import LeftMenuAuthenticated from '~/components/layout/left-menu-authenticated'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'

export default {
  name: 'layout-auth',
  components: {
    LeftMenuAuthenticated,
    RightMenuAuthenticated
  },
  data () {
    return {
      menu: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  },
  methods: {
    ...mapActions('accounts', ['autoLogin'])
  }
}
</script>

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
          icon="fas fa-bars"
          aria-label="Menu"
        )
        q-toolbar-title Telos Net
        right-menu-authenticated(v-if="isAuthenticated")
    q-drawer(
      show-if-above
      v-model="menu"
      side="left"
      bordered
    )
      left-menu-authenticated
    q-page-container
      router-view
</template>
