<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AppHeader from '~/components/layout/app-header'
import LeftMenu from '~/components/layout/left-menu'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'

export default {
  name: 'layout-auth',
  components: {
    AppHeader,
    LeftMenu,
    RightMenuNotifications
  },
  data () {
    return {
      menu: false,
      right: false,
      miniState: true
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapActions('accounts', ['autoLogin']),
    toggleNotifications () {
      if (this.right) {
        this.unmarkRead()
      }
      this.right = !this.right
    },
    toLanding () {
      this.$router.push({ path: '/' })
    },
    toggleMenu () {
      this.menu = !this.menu
    },
    closeMenu () {
      this.menu = false
    }
  },
  async mounted () {
    this.initNotifications()
  }
}
</script>

<template lang="pug">
  q-layout(view="lHh lpR lFr")
    app-header(@open="toggleMenu" @goToHomePage="toLanding" @toggleNote="toggleNotifications")
    q-drawer(
      v-model="right"
      side="right"
      overlay
      bordered
    )
      right-menu-notifications
    q-drawer(
      v-model="menu"
      :width="320"
      :breakpoint="500"
      overlay
    )
      left-menu(@close="closeMenu" @goToHomePage="toLanding")
    q-page-container
      router-view
</template>

<style lang="sass" scoped>
  .q-layout
    max-width: 1366px
    margin: 0 auto
    padding: 0 93px
  @media (max-width: 890px)
    .q-layout
      padding: 0 34px
  @media (max-width: 400px)
    .q-layout
      padding: 0
</style>
