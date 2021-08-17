<script>
export default {
  name: 'left-menu-authenticated',
  methods: {
    closeMenu: function () { this.$emit('close') },
    goToHomePage: function () { this.$emit('goToHomePage') }
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
      ]
    }
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
        img(@click="goToHomePage" class="img" src="statics/telos-logo-new-big.png")
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
            :class="[el.filter === activeFilter ? 'active-tab': '']"
            )
</template>

<style lang="sass">
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap')
  .q-tabs
    font-family: "Poppins", sans-serif
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
      border-left: 5px solid #0E62FF !important
    .q-menu
      width: 320px;
</style>
