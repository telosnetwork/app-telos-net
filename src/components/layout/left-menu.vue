<script>
import { mapGetters } from 'vuex'

export default {
  name: 'left-menu-authenticated',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  }
}
</script>

<template lang="pug">
  q-scroll-area.fit
    q-list
      q-item(
        v-if="isAuthenticated"
        to="/profiles/myProfile"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fas fa-user")
        q-item-section {{ $t('menu.myProfile') }}
      q-item(
        v-if="isAuthenticated"
        to="/profiles/chat"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fas fa-comment-dots")
        q-item-section {{ $t('menu.chats') }}
      q-item(
        v-if="isAuthenticated"
        to="/profiles/contacts"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fas fa-users")
        q-item-section {{ $t('menu.contacts') }}
      q-item(
        to="/trails/treasuries"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fas fa-users")
        q-item-section {{ $t('menu.trailsTreasuries') }}
      q-item(
        to="/trails/ballots"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="fas fa-vote-yea")
        q-item-section {{ $t('menu.trailsBallots') }}
      q-item(
        v-if="isAuthenticated"
        to="/profiles/registerApp"
        exact
        clickable
        v-ripple
       )
        q-item-section(avatar)
          q-icon(name="fas fa-plus-square")
        q-item-section {{ $t('menu.registerApp') }}
      q-item(
        v-if="isAuthenticated"
        to="/profiles/appList"
        exact
        clickable
        v-ripple
       )
        q-item-section(avatar)
          q-icon(name="fas fa-list-alt")
        q-item-section {{ $t('menu.appList') }}
</template>

<style lang="stylus">

</style>
