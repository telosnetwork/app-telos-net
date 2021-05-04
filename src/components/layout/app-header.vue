<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('notifications', ['successCount', 'errorCount'])
  },
  methods: {
    ...mapMutations('notifications', ['initNotifications', 'unmarkRead', 'unmarkNew']),
    ...mapActions('accounts', ['autoLogin']),
    openMenu: function () { this.$emit('open') },
    goToHomePage: function () { this.$emit('goToHomePage') },
    toggleNote: function () { this.$emit('toggleNote') }
  }
}
</script>

<template lang="pug">
    q-header()
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
          img.logo(@click="goToHomePage" src="statics/telos-logo-new.png")
        q-separator.title-separator(vertical inset)
        header-menu()
        div.col-grow.row.justify-end
          q-btn.q-mx-lg(
            v-if="isAuthenticated"
            dense
            flat
            round
            icon="img:statics/notification-icon.svg"
            @click="toggleNote"
            size="sm"
            color="black"
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
      div.header-bottom.absolute-bottom
</template>

<style lang="sass" scoped>
.burger
  margin: 0 6px
.q-header
  display: flex
  height: 82px
  background: white
.q-toolbar
  width: 1366px
  margin: 0 auto
  padding: 0 93px
.logo-wrapper
  margin: 0 32px 0 0
  padding: 0
.logo
  width: 110px
.title-separator
  margin-top: 18px;
  margin-bottom: 18px;
.header-bottom
  width: 100%
  border: 1px solid rgba(0, 9, 26, 0.05)
.notification-badge
  font-size: 10px
  padding: 2px 3px
  right: -5px
.badge-left
  left: -5px
  right: auto
@media (max-width: 890px)
  .q-toolbar
    padding: 0 12px
@media (min-width: 820px)
  .burger
    display: none
@media (max-width: 820px)
  .q-toolbar__title,
  .title-separator
    display: none
  .q-header
    height: 52px
</style>
