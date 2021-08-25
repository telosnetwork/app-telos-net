<script>
export default {
  name: 'left-menu-authenticated',
  methods: {
    closeMenu: function () { this.$emit('close') },
    goToHomePage: function () { this.$emit('goToHomePage') },
    updateWidth () {
      this.clientWidth = window.innerWidth
    }
  },
  props: {
    activeFilter: {}
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
      ],
      localFilter: this.activeFilter,
      clientWidth: 0
    }
  },
  watch: {
    activeFilter: function () {
      this.localFilter = this.activeFilter
    },
    '$route' (to, from) {
      if (!to.path.includes('/trails/ballots')) {
        this.localFilter = ''
      }
    },
    clientWidth: function () {
      if (this.clientWidth > 760) {
        this.closeMenu()
      }
    }
  },
  created () {
    window.addEventListener('resize', this.updateWidth)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateWidth)
  }
}
</script>

<template lang="pug">
  q-scroll-area(style="height: 100%; border-right: 1px solid #ddd")
    div.menu-logo-wrapper
      q-btn.burger-close(
          flat
          dense
          round
          @click="closeMenu"
          icon="close"
          aria-label="Menu"
          text-color="black"
        )
      div.wrapper
        img(@click="goToHomePage" class="img" src="statics/telos-logo-new.svg")
    q-tabs(
        no-caps
        vertical
        switch-indicator
        class="text-grey text-teal"
        active-color="grey-9"
        indicator-color='primary'
      )
      q-route-tab.aline-left.q-my-lg.left-menu-tab(
        v-for="(item, index) in menuItems"
        :key="index"
        :name="item.label"
        :label="item.label"
        :to="item.route"
        v-if="!item.length"
        ripple
      )
      q-btn-dropdown.header-submenu-tab(auto-close stretch flat label="Decide" v-else)
        q-list
          q-route-tab.q-mx-sm.header-submenu-item(
            v-for="(el,i) of item"
            :key="i"
            :name="el.label"
            :label="el.label"
            :to="'/trails/ballots'"
            @click="$emit('set-active-filter', el.filter)"
            :class="[el.filter === localFilter ? 'active-tab': '']"
            )
</template>

<style lang="sass">
  .aline-left
    justify-content: left
    padding: 0 27px
    font-size: 22px
    line-height: 22px
    font-weight: 600
  .menu-logo-wrapper
    height: 162px
    border-bottom: 1px solid rgba(0, 9, 26, 0.1)
  @media (max-width: 760px)
    .burger-close
      margin: 16px 0 0 24px
    .wrapper
      margin: 34px 0 0 28px
    .img
      cursor: pointer
      width: 144px
    .left-menu-tab
      padding-left: 27px !important
    .header-submenu-tab
      font-size: 22px
      font-weight: bold
      text-transform: capitalize
      padding-left: 27px !important
      width: 100%
      margin: 0
      & .q-btn__wrapper
        padding: 0
        & .q-btn__content
          justify-content: flex-start
    .header-submenu-item
      margin: 0
      border-bottom: none !important
      border-left: 5px solid transparent !important
    .active-tab
      border-bottom: none !important
      border-left: 5px solid $primary !important
    .q-menu
      width: 320px;
</style>
