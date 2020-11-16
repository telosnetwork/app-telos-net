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
          q-icon(name="app:my-profile")
        q-item-section {{ $t('menu.myProfile') }}
      q-item(
        to="/profiles/contacts"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:find-contacts")
        q-item-section {{ $t('menu.contacts') }}
      q-item(
        to="/trails/treasuries"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:groups")
        q-item-section {{ $t('menu.trailsTreasuries') }}
      q-item(
        to="/trails/ballots"
        clickable
        v-ripple
      )
        q-item-section(avatar)
          q-icon(name="app:decide")
        q-item-section {{ $t('menu.trailsBallots') }}
</template>

<style lang="stylus">

</style>
