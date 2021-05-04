<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'left-menu-authenticated',
  data () {
    return {
      isAuthenticated: true
    }
  },
  methods: {
    closeMenu: function () { this.$emit('close') },
    goToHomePage: function () { this.$emit('goToHomePage') }
  }
  // computed: {
  //   ...mapGetters('accounts', ['isAuthenticated'])
  // }
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
        indicator-color='indigo-14'
      )
      q-route-tab.aline-left.q-my-lg(
        name="Contacts"
        label="Contacts"
        to="/profiles/contacts"
        ripple
      )
      div.custom-separator
      q-route-tab.aline-left.q-my-lg(
        name="Groups"
        label="Groups"
        to="/trails/treasuries"
        ripple
      )
      div.custom-separator
      q-route-tab.aline-left.q-my-lg(
        name="Ballots"
        label="Ballots"
        to="/trails/ballots"
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
</style>
