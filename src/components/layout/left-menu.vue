<script>
export default {
  name: 'left-menu-authenticated',
  methods: {
    closeMenu: function () { this.$emit('close') },
    goToHomePage: function () { this.$emit('goToHomePage') }
  },
  data () {
    return {
      menuItems: [
        { label: this.$t('menu.contacts'), route: '/profiles/contacts' },
        { label: this.$t('menu.trailsTreasuries'), route: '/trails/treasuries' },
        { label: this.$t('menu.trailsBallots'), route: '/trails/ballots' },
        { label: this.$t('menu.tokens'), route: '/tokens' }
      ]
    }
  }
}
</script>

<template lang="pug">
  q-scroll-area(style="height: 100%; border-right: 1px solid #ddd")
    div.menu-logo-wrapper
      q-btn.burger(
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
      q-route-tab.aline-left.q-my-lg(
        v-for="(item, index) in menuItems"
        :key="index"
        :name="item.label"
        :label="item.label"
        :to="item.route"
        ripple
      )
</template>

<style lang="sass" scoped>
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
  .burger
    margin: 16px 0 0 24px
  .wrapper
    margin: 34px 0 0 28px
  .img
    cursor: pointer
</style>
