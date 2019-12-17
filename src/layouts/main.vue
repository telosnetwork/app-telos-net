<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import LeftMenu from '~/components/layout/left-menu'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import RightMenuGuest from '~/components/layout/right-menu-guest'
import RightMenuNotifications from '~/components/layout/right-menu-notifications'

export default {
  name: 'layout-auth',
  components: {
    LeftMenu,
    RightMenuAuthenticated,
    RightMenuGuest,
    RightMenuNotifications
  },
  data () {
    return {
      menu: false,
      right: false
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
    }
  },
  async mounted () {
    this.initNotifications()
  }
}
</script>

<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(
          flat
          dense
          round
          @click="menu = !menu"
          icon="fas fa-bars"
          aria-label="Menu"
        )
        q-toolbar-title.flex.items-center
          img.logo(src="statics/telos-logo-white.svg")
        q-btn(
          v-if="isAuthenticated"
          dense
          flat
          round
          icon="fas fa-broadcast-tower"
          @click="toggleNotifications"
          size="sm"
        )
          q-badge.notification-badge(
            v-if="successCount"
            color="green"
            :label="successCount"
            floating
          )
          q-badge.notification-badge.badge-left(
            v-if="errorCount"
            color="red"
            :label="errorCount"
            floating
          )
        right-menu-authenticated(v-if="isAuthenticated")
        right-menu-guest(v-if="!isAuthenticated")
    q-drawer(
      v-model="right"
      side="right"
      overlay
      bordered
    )
      right-menu-notifications
    q-drawer(
      show-if-above
      v-model="menu"
      side="left"
      bordered
    )
      left-menu
    q-page-container
      router-view
</template>

<style lang="sass" scoped>
.logo
  max-height: 30px
  max-width: 100px
.notification-badge
  font-size: 10px
  padding: 2px 3px
  right: -5px
.badge-left
  left: -5px
  right: auto
</style>
