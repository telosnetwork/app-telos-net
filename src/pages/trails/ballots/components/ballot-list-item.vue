<script>
import { mapActions, mapGetters } from 'vuex'
import BallotStatus from '../components/ballot-status'
import BallotChip from '../components/ballot-chip'
import Btn from '../../../../components/btn'

export default {
  name: 'ballot-list-item',
  components: { BallotStatus, BallotChip, Btn },
  props: {
    ballot: { type: Object, required: true },
    displayWinner: { type: Function, required: true },
    isBallotOpened: { type: Boolean, required: true },
    votingHasBegun: { type: Boolean, required: true },
    getStartTime: { type: Number, required: true },
    getEndTime: { type: Number, required: true }
  },
  data () {
    return {
      voting: false,
      votes: []
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    getWinner () {
      if (!this.ballot.total_voters) return 'No votes'
      let winnerValue = -1
      let winner
      this.ballot.options.forEach((option, index) => {
        if (parseFloat(option.value) > winnerValue) {
          winnerValue = parseFloat(option.value)
          winner = index
        }
      })
      return this.ballot.options[winner]
    },
    getLoser () {
      if (!this.ballot.total_voters || this.ballot.options.length !== 2) return false
      return this.ballot.options.find(x => x.key !== this.getWinner.key)
    }
  },
  methods: {
    ...mapActions('trails', ['castVote']),
    openUrl (url) {
      window.open(`${process.env.BLOCKCHAIN_EXPLORER}/account/${url}`)
    },
    log (msg, val) {
      console.log(msg, val)
    },
    getPercentofTotal (option) {
      const total = ((Number(option.value.split(' ')[0]) / Number(this.ballot.total_raw_weight.split(' ')[0])) * 100)
      return Number.isInteger(total) ? total : total.toFixed(2)
    },
    async onCastVote ({ options, option, ballotName }) {
      this.voting = true
      await this.castVote({
        ballotName,
        options: options || [option]
      })
      this.voting = false
      this.votes = []
    }
  }
}
</script>

<template lang="pug">
div
  q-card(:class="ballot.status === 'voting' && isBallotOpened ? '' : 'poll-ended'").poll-item
    q-card-section().card-img-wrapper
      template(v-if="isBallotOpened && ballot.status === 'voting'")
        img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon1.png`").bgr-icon1
        img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon2.png`").bgr-icon2
      template(v-else)
        img(:src="`statics/app-icons/inactive-bgr-icon1.png`").bgr-icon1
        img(:src="`statics/app-icons/inactive-bgr-icon2.png`").bgr-icon2
    ballot-chip(:type="ballot.category").absolute-top-left

    q-separator.card-separator-vertical(vertical inset)

    ballot-status(
      :ballot="ballot"
      :isBallotOpened="isBallotOpened"
      :getEndTime="getEndTime"
      :votingHasBegun="votingHasBegun"
      :getStartTime="getStartTime"
    )

    q-card-section().q-pb-none.cursor-pointer.title-section
      div.text-section.row.ballot-card-title-wrapper
        span.ballot-card-title {{ ballot.title || "Untitled Ballot" }}
      div.ballot-card-sub-title-wrapper
          span.opacity04 By&nbsp
          a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
          span.opacity04 &nbspin&nbsp
          span.opacity06 {{ ballot.treasury.title || "No treasury" }}

      div.text-section-row
        div.statics-section-item.section-item-btn
          btn.create-btn(
            :labelText="(isBallotOpened && ballot.status === 'voting') ? 'View proposal & vote' : 'View proposal'"
            btnWidth='220'
            fontSize='16'
            hoverBlue=true
          )
        div.statics-section-wrapper-scroll
          div.statics-section-wrapper
            div.statics-section-item(v-if="ballot.total_voters > 0")
              span.text-weight-bold {{ getPercentofTotal(getWinner) }}%&nbsp
              span.opacity06  {{ getWinner.key.toUpperCase() }} {{ getLoser.key ? ` lead over ${getLoser.key.toUpperCase()}` : ` lead over others` }}
            div.statics-section-item(v-else)
              span  {{ getWinner }}
            div.bar-custom-separator.text-section-separator
            div.statics-section-item
              span.text-weight-bold {{ `${ballot.total_voters} Accounts` }}
              span.opacity06 &nbspvoted
            div.bar-custom-separator.text-section-separator
            div.statics-section-item
              span.text-weight-bold {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}&nbsp
              span.opacity06 {{ ballot.total_raw_weight.split(' ')[1]  }}&nbsp
              span.opacity06 tokens

    q-card-section().q-pb-none.cursor-pointer.statics-section
      div.text-section.column
        div.statics-section-item(v-if="ballot.total_voters > 0")
          span.text-weight-bold {{ getPercentofTotal(getWinner) }}%&nbsp
          span.opacity06  {{ getWinner.key.toUpperCase() }} {{ getLoser.key ? ` lead over ${getLoser.key.toUpperCase()}` : ` lead over others` }}
        div.statics-section-item(v-else)
          span  {{ getWinner }}
        div.statics-section-item
          span.text-weight-bold {{ `${ballot.total_voters} Accounts` }}
          span.opacity06 &nbspvoted
        div.statics-section-item
          span.text-weight-bold {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}&nbsp
          span.opacity06 {{ ballot.total_raw_weight.split(' ')[1]  }}&nbsp
          span.opacity06 tokens

    q-card-section().row.justify-center.btn-section
      btn.create-btn(
        :labelText="(isBallotOpened && ballot.status === 'voting') ? 'View proposal & vote' : 'View proposal'"
        btnWidth='332'
        fontSize='16'
        hoverBlue=true
      )
</template>

<style lang="sass">
.column-direction > div,
  margin-top: 32px
.row-direction
  gap: 32px 20px
  margin-top: 32px
  justify-content: space-around !important
.poll-item
  box-shadow: none
  border-radius: 12px
  border: 2px solid #F2F3F4
  &:hover
    box-shadow: 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04)
.poll-ended
  border: none
  background: #F7F7F7
.poll-item .left-tag
  padding: 5px 16px 0 24px;
  position: absolute;
  left: 0;
  top: 118px;
  background: #fff;
  border-radius: 0px 16px 0px 0px !important
  min-height: 46px;
  min-width: 72px;
  z-index: 9;
.poll-ended .left-tag
  background: #F7F7F7
.column-direction .left-tag
  top: 136px;
.poll-item .left-tag cite
  padding: 0 0 0 2px;
  font-size: 7px;
  line-height: 11px;
  font-weight: 400;
  text-transform: uppercase;
  font-style: normal;
  display: block;
.poll-item .left-tag span
  font-size: 16px;
  line-height: 20px;
  display: block;
  font-weight: 400;
.link
  color: #0481d8;
.cursor-default
  cursor: default;
.capitalize
  text-transform: capitalize
.grey-bar
  background-color: #00000008;
  height: 70px;
  top: 100px;
.voting-section
  padding-top: 10px
  padding-bottom: 0px
.row-direction .q-card.poll-item
  overflow: hidden
  width: 380px;
  height: 472px
.column-direction .q-card.poll-item
  height: 200px
  display: flex
  flex-direction: row
.q-card > div.poll-item
  box-shadow: unset
  height 100px

.q-card > div:not(:last-child), .q-card > img:not(:last-child)
    border-bottom-left-radius: 0;
.card-img-wrapper
  position: relative
  overflow: hidden
  background: #F4F4F5
  border-radius: 6px !important
.column-direction .card-img-wrapper
  overflow: visible
.poll-ended .card-img-wrapper
  background: #EFEFF0
.row-direction .card-img-wrapper
  margin: 12px 12px 16px 12px
  height: 154px
.column-direction .card-img-wrapper
  margin: 12px
  height: 176px
  width: 20%
.title-section
  padding: 16px 24px 8px 24px
.column-direction .title-section
  position: relative
  width: 79%
  padding: 16px 16px 8px 32px
.ballot-card-title-wrapper
  height: 60px
  margin-bottom: 10px
.column-direction .ballot-card-title-wrapper
  height: auto
.ballot-card-sub-title-wrapper
  font-size: 12px
  line-height: 12px
.column-direction .text-section-row
  width: 100%
  display: flex
  position: absolute
  bottom: 0
  margin-bottom: 24px
  align-items: center
  & .statics-section-wrapper-scroll
    display: flex
    position: relative
    width: 65%
    overflow-x: auto
    scrollbar-color: #caccce #EFEFF0
    scrollbar-width: thin
    &::-webkit-scrollbar
      height: 8px
      background-color: #EFEFF0
    &::-webkit-scrollbar-thumb
      background-color: #caccce
      border-radius: 5px
.statics-section-wrapper-scroll .statics-section-wrapper
      display: flex
      max-width: 1000px
      align-items: center
.ballot-card-title
  font-weight: 600
  font-size: 20px
.statics-section
  padding: 16px 24px 8px 24px
.statics-section-item
  display: flex
  flex-wrap: nowrap
  width: max-content
  margin-bottom: 16px
  & span
    font-size: 16px
.column-direction .statics-section-item
  margin-bottom: 0
.row-direction .statics-section-item span
  line-height: 16px
.btn-section
  padding: 0
.bgr-icon1, .bgr-icon2
  position: absolute
.row-direction .bgr-icon1
  top: 5px
  right: 55px
.row-direction .bgr-icon2
  top: 71px
  right: -1px
.column-direction .bgr-icon1
  top: -2px
  right: 70px
.column-direction .bgr-icon2
  top: 74px
  right: 15px
.column-direction .section-item-btn
  display: block
  margin-right: 32px
.row-direction .section-item-btn,
.row-direction .text-section-row,
.row-direction .card-separator-vertical,
.column-direction .btn-section,
.column-direction .statics-section
  display: none
.section-item-btn
  height: auto
.column-direction .card-separator-vertical
  margin: 2px 0
  height: 192px
.column-direction .poll-ended .card-separator-vertical
  height: 196px
.column-direction .text-section-separator
  margin: 0 16px
.opacity04
  opacity: .4 !important
.opacity06
  opacity: .6 !important
@media (max-width: 1366px)
  .ballots > .q-infinite-scroll
    margin: 0 auto
  .row-direction
@media (max-width: 1270px)
  .column-direction .text-section-row .statics-section-wrapper-scroll
    width: 58%
@media (max-width: 1000px)
  .row-direction .q-card.poll-item
    width: 340px
    height: 434px
  .row-direction .left-tag
    top: 106px
  .ballot-card-title-wrapper
    height: 54px
  .ballot-card-title
    font-size: 18px
  .ballot-card-sub-title-wrapper
    font-size: 11px
  .btn-section
    padding: 0 24px
  .statics-section-item
    margin-bottom: 14px
    & span
      font-size: 14px
  .row-direction .card-img-wrapper
    height: 140px
  .ballot-card-title-wrapper
    margin-bottom: 5px
  .row-direction .bgr-icon1,
  .row-direction .bgr-icon2
    width: 40px
  .row-direction .bgr-icon1
    top: 21px
    right: 85px
  .row-direction .bgr-icon2
    top: 60px
    right: 33px
  @media (max-width: 600px)
    .row-direction
      margin-top: 0
  @media (max-width: 400px)
    .row-direction
      gap: 24px 20px
    .row-direction > div
      width: 100%
    .row-direction .q-card.poll-item,
    .row-direction .q-card.poll-item .poll-ended
      width: 100%
      border: none
      border-radius: 0
      &:hover
        box-shadow: none
    .btn-section > button
      width: 296px !important
</style>
