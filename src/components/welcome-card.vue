<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'welcome-card',
  data () {
    return {
      account: 'aleksey'
    }
  },
  computed: {
    // ...mapGetters('accounts', ['account'])
  },
  methods: {
    addToLocalStorage () {
      localStorage.isNotNewUser = false
    }
  }
}
</script>

<template lang="pug">
  q-card.welcome-card.q-my-lg
    img.bg1.absolute-right(src="statics/welcome-card-bg1.png")
    img.bg2.absolute-right(src="statics/welcome-card-bg2.png")
    img.bg3.absolute-bottom(src="statics/welcome-card-bg3.png")
    q-card-section.title-wrapper.row
      div.card-title {{ $t('pages.trails.ballots.welcomeCard.title') }} {{ account }}!
      img.self-center.title-img(src="statics/hello.png")
    q-card-section.card-text
      div.q-pt-none {{ $t('pages.trails.ballots.welcomeCard.textBeginning') }}
        span.q-pt-none.text-weight-bold {{ $t('pages.trails.ballots.welcomeCard.textBold') }}
        span.q-pt-none {{ $t('pages.trails.ballots.welcomeCard.textEnd') }}
    q-card-actions.btn-wrapper
      q-btn.q-mr-sm(
        @click="addToLocalStorage()"
        :label="$t('pages.trails.ballots.welcomeCard.btnLabel')"
        no-caps
        color='secondary'
        text-color='white'
      )
</template>

<style lang="sass" scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap')
  .welcome-card
    width: 100%
    height: 292px
    padding: 32px
    font-family: "Poppins", sans-serif
    border-radius: 12px;
  .title-wrapper
    margin: 32px 0 0 0
    padding: 0
  .card-title
    font-weight: 600
    font-size: 32px
    line-height: 32px
    letter-spacing: -0.015em;
  .title-img
    width: 32px
    height: 32px
    margin-left: 12px
  .card-text
    max-width: 620px
    padding: 0
    margin: 24px 0 36px 0
  .btn-wrapper
    padding: 0
  .bg3
    bottom: -1px
  .bg1
    width: 120px
    top: -13px
    right: 144px
  .bg2
    width: 120px
    top: 134px
    right: 24px
  .q-btn
    border-radius: 6px
</style>
