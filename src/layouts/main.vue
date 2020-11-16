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
    }
  },
  async mounted () {
    this.initNotifications()
  }
}
</script>

<template lang="pug">
  q-layout(view="hHh Lpr lff")
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
          img.logo(@click="toLanding" src="statics/telos-logo-white.svg")
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
        right-menu-authenticated(landing-page=false v-if="isAuthenticated")
        right-menu-guest(landing-page=false v-if="!isAuthenticated")
    q-drawer(
      v-model="right"
      side="right"
      overlay
      bordered
    )
      right-menu-notifications
    q-drawer(
      v-model="menu"
      show-if-above

      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay

      :width="250"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
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
