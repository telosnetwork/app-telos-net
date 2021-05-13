<script>
import { mapGetters } from 'vuex'

export default {
  name: 'header-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  }
}
</script>

<template lang="pug">
  q-tabs(
      no-caps
      class="text-grey text-teal"
      indicator-color='primary'
      active-color="grey-9"
    )
    q-route-tab.q-mx-sm(
      name="Contacts"
      label="Contacts"
      to="/profiles/contacts"
    )
    div.custom-separator
    q-route-tab.q-mx-sm(
      name="Groups"
      label="Groups"
      to="/trails/treasuries"
    )
    div.custom-separator
    q-route-tab.q-mx-sm(
      name="Ballots"
      label="Ballots"
      to="/trails/ballots"
    )
</template>

<style lang="sass" scoped>
  .q-tabs
    height: 100%
    margin: 0 16px
    font-size: 16px
    font-weight: 600
  .custom-separator
    width: 4px
    height: 4px
    background: rgba(0, 9, 26, 0.1)
    border-radius: 2px
  @media (max-width: 735px)
    .q-tabs
      display: none
  @media (max-width: 890px)
    .q-tabs
      margin: 0
      font-size: 14px
</style>
