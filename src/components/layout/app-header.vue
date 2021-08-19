<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import HeaderMenu from '~/components/layout/header-menu'
import RightMenuAuthenticated from '~/components/layout/right-menu-authenticated'
import RightMenuGuest from '~/components/layout/right-menu-guest'

export default {
  name: 'app-header',
  components: {
    HeaderMenu,
    RightMenuAuthenticated,
    RightMenuGuest
  },
  data () {
    return {
      scrollPosition: null,
      isMenuOpened: false
    }
  },
  props: {
    activeFilter: {}
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapActions('accounts', ['autoLogin']),
    openMenu () { this.$emit('open') },
    goToHomePage () { this.$emit('goToHomePage') },
    toggleNote () { this.$emit('toggleNote') },
    updateScroll () { this.scrollPosition = window.scrollY },
    setActiveFilter (filter) {
      this.$emit('set-active-filter', filter)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.updateScroll)
  }
}
</script>

<template lang="pug">
    q-header(:class="{scrolled: scrollPosition > 50}")
      q-toolbar(content-center)
        q-btn.burger(
          flat
          dense
          round
          @click="openMenu"
          icon="img:statics/stroke.svg"
          aria-label="Menu"
          text-color="black"
        )
        q-toolbar-title.flex.items-center.logo-wrapper(shrink)
          img.logo(@click="goToHomePage" src="statics/telos-logo-new.svg")
        q-separator.title-separator(vertical inset)
        header-menu(@set-active-filter="setActiveFilter" :activeFilter="activeFilter")
        div.right-menu.col-grow.row.justify-end
          q-btn.notification-btn(
            v-if="isAuthenticated"
            dense
            flat
            round
            icon="img:statics/notification-icon.svg"
            @click="toggleNote"
            color="black"
          )
            q-badge.notification-badge(
              v-if="successCount"
              rounded
              color="primary"
              :label="successCount"
              floating
            )
            q-badge.notification-badge.badge-left(
              v-if="errorCount"
              rounded
              color="red"
              :label="errorCount"
              floating
            )
          right-menu-authenticated(landing-page=false v-if="isAuthenticated")
          right-menu-guest(landing-page=false v-if="!isAuthenticated")
      div.header-bottom.absolute-bottom
</template>

<style lang="sass">
.burger
  margin: 0 6px
  display: none
.q-header
  display: flex
  height: 80px
  background: white
.scrolled
  height: 64px
.q-toolbar
  width: 1366px
  margin: 0 auto
  padding: 0 93px
.logo-wrapper
  margin-right: 32px
  padding: 0
.logo
  width: 110px
  cursor: pointer
.title-separator
  margin-top: 18px
  margin-bottom: 18px
.header-bottom
  width: 100%
  border: 1px solid rgba(0, 9, 26, 0.05)
.right-menu
  gap: 24px
.notification-btn
  font-size: 11px
.notification-badge
  font-size: 10px
  padding: 1px 3px
  right: -3px
.badge-left
  left: -5px
  right: auto
.q-badge
  line-height: 10px
  border-radius: 6px
  top: 4px
@media (max-width: 970px)
  .right-menu
    gap: 6px
@media (max-width: 930px)
  .q-header
    height: 64px
  .q-toolbar
    padding: 0 34px
  .logo-wrapper
    margin-right: 20px
  .logo
    width: 80px
  .scrolled
    height: 48px
@media (max-width: 760px)
  .q-toolbar__title,
  .title-separator
    display: none
  .q-header
    height: 52px
  .burger
    display: block
@media (max-width: 400px)
  .q-toolbar
    padding: 0 12px
</style>
