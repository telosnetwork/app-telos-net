<script>
import { mapActions, mapGetters } from 'vuex'
import gravatar from '../../pages/profiles/gravatar'

export default {
  name: 'right-menu-authenticated',
  components: {
    gravatar
  },
  data () {
    return {
      isProfileMenuOpen: false,
      isDialogOpen: false,
      avatar: ''
    }
  },
  props: {
    landingPage: Boolean
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    myProfile () {
      return this.$store.state.profiles.myProfile
    }
  },
  beforeMount: async function () {
    this.showIsLoading(true)
    const response = await this.getProfile()
    if (response !== undefined) {
      this.avatar = response.avatar
    }
    this.showIsLoading(false)
  },
  methods: {
    ...mapActions('accounts', ['logout']),
    ...mapActions('profiles', ['getProfile']),
    toggleProfileMenu () { this.isProfileMenuOpen = !this.isProfileMenuOpen },
    showProfileMenuDialog () {
      this.isDialogOpen = true
    }
  }
}
</script>

<template lang="pug">
div
  q-btn.menu(
    :class="{'menu-open': isProfileMenuOpen}"
    flat
    :icon-right="isProfileMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
    color="dark"
    no-caps
  )
    gravatar(size='32px' :avatar='avatar' :account='account')
    span.menu-title {{account}}
    q-menu(
      @show="toggleProfileMenu"
      @hide="toggleProfileMenu"
      fit
    )
      q-list.profile-menu-list(dense)
        q-item
          q-btn.item-btn.edit-profile-btn(
            :label="$t('common.buttons.editProfile')"
            icon="far fa-edit"
            to="/profiles/myProfile"
            flat
            align="left"
            no-caps
          )
        q-item
          q-btn.item-btn.logout-btn(
            :label="$t('common.buttons.logout')"
            icon="power_settings_new"
            @click="logout"
            flat
            color="dark"
            align="left"
            no-caps
          )
  q-btn.collapsed-menu(flat round @click="showProfileMenuDialog()")
    gravatar(size='32px' :avatar='avatar' :account='account')
  q-dialog(
    v-model="isDialogOpen"
    position="bottom"
  )
    div.column.dialog-wrapper
      div.flex.justify-between.dialog-title
        div.flex.items-center
          gravatar(size='32px' :avatar='avatar' :account='account')
          div.user-name {{ account }}
        q-btn.close-btn(
          flat
          dense
          round
          v-close-popup
          icon="close"
          text-color="dark"
        )
      div.dialog-btn-wrapper.column
        q-btn.dialog-btn(
          :label="$t('common.buttons.editProfile')"
          icon="far fa-edit"
          to="/profiles/myProfile"
          flat
          align="left"
          no-caps
        )
        q-btn.dialog-btn(
          :label="$t('common.buttons.logout')"
          icon="power_settings_new"
          @click="logout"
          flat
          color="warning"
          align="left"
          no-caps
        )
</template>

<style lang="sass">
  .menu
    min-width: 151px
    font-size: 16px !important
    letter-spacing: -0.015em
    border-radius: 6px 6px 0 0 !important
  .q-btn.menu .q-icon
    font-size: 1em !important
  .menu-title
    margin: 0 12px
  .menu-open
    box-shadow: 0px 20px 48px rgba(21, 0, 77, 0.08), 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04), 0px 1px 2.25px rgba(21, 0, 77, 0.0383252)
  .q-menu
    box-shadow: 0px 20px 48px rgba(21, 0, 77, 0.08), 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04), 0px 1px 2.25px rgba(21, 0, 77, 0.0383252)
    border-radius: 0 0 6px 6px
  .on-right
    font-size: 14px !important
  .on-left
    width: 32px
    height: 32px
  .profile-menu-list > .q-item
    margin: 8px
    padding: 0 !important
  .item-btn,
  .dialog-btn
    width: 100%
    font-size: 14px
  .item-btn .q-icon
    width: 20px !important
    height: 20px !important
  .q-btn
    &:hover,
    &:focus,
    &:active
      &.edit-profile-btn
        color: var(--q-color-primary) !important
  .q-btn
    &:hover,
    &:focus,
    &:active
      &.logout-btn
        color: var(--q-color-warning) !important
  .collapsed-menu
    display: none
    margin-left: 20px
  .dialog-wrapper
    max-width: 400px
    min-width: 320px
    padding: 24px 12px !important
    background: white
    box-shadow: 0px 20px 48px rgba(21, 0, 77, 0.08), 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04), 0px 1px 2.25px rgba(21, 0, 77, 0.0383252) !important
    border-radius: 12px 12px 0 0 !important
  .dialog-title
    width: 100%
    margin-bottom: 24px
    box-shadow: none !important
  .user-name
    margin-left: 12px
    font-size: 16px
    color: var(--q-color-dark)
  .close-btn
    justify-self: flex-end
  .dialog-btn-wrapper
    box-shadow: none !important
    border: 1px solid #F2F3F4
    border-radius: 6px !important
  .dialog-btn
    border-radius: 0 !important
    border-bottom: 1px solid #F2F3F4
    &:first-child
      border-radius: 6px 6px 0 0
      border-bottom: 1px solid #F2F3F4
    &:last-child
      border-radius: 0 0 6px 6px
  .q-dialog__inner--bottom > div
    width: 100% !important
  @media (max-width: 970px)
    .menu
      font-size: 14px !important
  @media (max-width: 760px)
    .collapsed-menu
      display: block
    .menu
      display: none
</style>
