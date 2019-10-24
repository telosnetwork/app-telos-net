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
</template>

<style lang="stylus">

</style>
