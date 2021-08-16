<script>
import { mapGetters } from 'vuex'

export default {
  name: 'header-menu',
  computed: {
    ...mapGetters('accounts', ['isAuthenticated'])
  },
  data () {
    return {
      menuItems: [
        { label: this.$t('menu.contacts'), route: '/profiles/contacts' },
        { label: this.$t('menu.trailsTreasuries'), route: '/trails/treasuries' },
        [
          { label: this.$t('menu.amendBallots'), filter: 'amend-ballots' },
          { label: this.$t('menu.TFElection'), filter: 't-f-election' },
          { label: this.$t('menu.polls'), filter: 'polls' },
          { label: this.$t('menu.workerProposals'), filter: 'worker-proposals' }
        ],
        { label: this.$t('menu.tokens'), route: '/tokens' }
      ]
    }
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
    template(
      v-for="(item, index) in menuItems"
    )
      q-route-tab.q-mx-sm.header-menu-tab(
        :key="index"
        :name="item.label"
        :label="item.label"
        :to="item.route"
        v-if="!item.length"
      )
      q-btn-dropdown.header-submenu-tab(auto-close stretch flat label="Decide" v-else)
        q-list(v-for="(el,i) of item")
          q-route-tab.q-mx-sm.header-submenu-item(
            :key="i"
            :name="el.label"
            :label="el.label"
            :to="'/trails/ballots'"
            @click="$emit('set-active-filter', el.filter)"
            )
      div.custom-separator
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
    &:last-child
      display: none
  .header-submenu-tab
    font-weight: bold
    text-transform: capitalize
    margin: 0 8px
  .header-submenu-item
    margin: 0
  @media (max-width: 1070px)
    .q-tabs
      margin: 0
      font-size: 14px
  @media (max-width: 960px)
    .header-menu-tab
      padding: 0 8px
  @media (max-width: 760px)
    .q-tabs
      display: none
</style>
