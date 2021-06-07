<script>
import { mapGetters } from 'vuex'
import Btn from './btn'

export default {
  name: 'welcome-card',
  components: { Btn },
  data () {
    return {
      isNewUser: true
    }
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  methods: {
    addToLocalStorage () {
      localStorage.isNewUser = false
      this.isNewUser = false
    }
  }
}
</script>

<template lang="pug">
  transition(name="fade")
    q-card.welcome-card(v-if="isNewUser" flat bordered)
      img.bg320px.absolute-top(src="statics/welcome-card-bg320px.png")
      img.bg1.absolute-right(src="statics/welcome-card-bg1.png")
      img.bg2.absolute-right(src="statics/welcome-card-bg2.png")
      img.bg3.absolute(src="statics/welcome-card-bg3.png")
      q-card-section.title-wrapper.row
        div.card-title {{ $t('pages.trails.ballots.welcomeCard.title') }} {{ account }}!
        img.self-center.title-img(src="statics/hello.png")
      q-card-section.card-text
        div.q-pt-none {{ $t('pages.trails.ballots.welcomeCard.textBeginning') }}
          span.q-pt-none.text-weight-bold {{ $t('pages.trails.ballots.welcomeCard.textBold') }}
          span.q-pt-none {{ $t('pages.trails.ballots.welcomeCard.textEnd') }}
      q-card-actions.btn-wrapper
        btn(
          :labelText="$t('pages.trails.ballots.welcomeCard.btnLabel')"
          primary
          btnWidth='94'
          @clickBtn="addToLocalStorage()"
          fontSize='16'
        )
</template>

<style lang="sass" scoped>
  .q-card--bordered
    border: 2px solid rgba(58, 51, 77, 0.05)
  .welcome-card
    width: 100%
    height: 292px
    padding: 32px
    margin: 40px 0
    border-radius: 12px
  .title-wrapper
    margin: 32px 0 0 0
    padding: 0
  .card-title
    font-weight: 600
    font-size: 32px
    line-height: 32px
    letter-spacing: -0.015em
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
    width: 538px
    bottom: -1px
    right: -1px
  .bg1
    width: 120px
    top: -13px
    right: 144px
  .bg2
    width: 120px
    top: 134px
    right: 24px
  .bg320px
    display: none
  .fade-enter-active, .fade-leave-active
    transition: all .5s ease-in-out
  .fade-enter, .fade-leave-to
    transform: translateY(-300px)
    opacity: 0
  @media (max-width: 768px)
    .card-text
      max-width: 362px
    .card-title
      font-size: 24px
    .title-img
      width: 24px
      height: 24px
    .card-text
      font-size: 14px
  @media (max-width: 514px)
    .bg1
      width: 100px
      right: 50px
    .bg2
      width: 90px
      top: 165px
      right: 12px
  @media (max-width: 400px)
    .welcome-card
      height: 465px
      padding: 250px 0 0 0
      margin: 0
      border-radius: 0
    .title-wrapper
      margin: 0 12px 0 12px
    .card-text
      margin: 16px 12px 24px 12px
    .btn-wrapper
      margin: 0 12px
    .bg3
      display: none
    .bg1
      display: none
    .bg2
      display: none
    .bg320px
      display: block
    .q-card--bordered
      border: none
</style>
