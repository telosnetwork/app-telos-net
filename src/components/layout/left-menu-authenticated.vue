<script>
export default {
  name: 'left-menu-authenticated'
}
</script>

<template lang="pug">
  q-scroll-area.fit
    q-list
      q-expansion-item(
        :content-inset-level="0.5"
        expand-separator
        icon="fas fa-comments"
        :label="$t('menu.trails')"
        default-opened
      )
        q-list
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
            exact
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-vote-yea")
            q-item-section {{ $t('menu.trailsBallots') }}
      q-expansion-item(
        :content-inset-level="0.5"
        expand-separator
        icon="fas fa-id-card"
        :label="$t('menu.profiles')"
        default-opened
      )
        q-list
          q-item(
            to="/signUp"
            exact
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-user")
            q-item-section {{ $t('menu.myProfile') }}
          q-item(
            to="/contactList"
            exact
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-users")
            q-item-section {{ $t('menu.contacts') }}
          q-item(
            to="/chatList"
            exact
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-comment-dots")
            q-item-section {{ $t('menu.chats') }}
          q-item(
            to="/registerApp"
            exact
            clickable
            v-ripple
          )
            q-item-section(avatar)
              q-icon(name="fas fa-plus-square")
            q-item-section {{ $t('menu.registerApp') }}
          q-item(
            to="/appList"
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
