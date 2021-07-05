<script>
import { mapActions, mapGetters } from 'vuex'
import BallotStatus from '../components/ballot-status'
import BallotChip from '../components/ballot-chip'
import BallotViewOption from './ballot-view-option'

const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'
const regexWithUrl = new RegExp(/https?\:\/\/.*Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'

export default {
  name: 'ballot-view',
  components: { BallotStatus, BallotChip, BallotViewOption },
  props: {
    isBallotOpened: { type: Boolean, required: true },
    displayWinner: { type: Function, required: true },
    votingHasBegun: { type: Function, required: true },
    getStartTime: { type: Function, required: true },
    getEndTime: { type: Function, required: true },
    getLoser: { type: Function, required: true }
  },
  data () {
    return {
      loading: true,
      voting: false,
      votes: []
    }
  },
  async mounted () {
    await this.fetchBallot(this.$route.params.id)
    if (this.displayWinner(this.ballot)) {
      this.votes.push(this.displayWinner(this.ballot))
    }
    this.loading = false
  },
  beforeDestroy () {
    // this.$router.push(`/trails/ballots/`)
    // This resets the route on modal close but also glitches out the scroll position for it's parent.
    // Commenting out to prevent the bug as it doesn't really cause any problems when the route isn't reset.
  },
  computed: {
    ...mapGetters('trails', ['ballot']),
    daysSinceStarted () {
      const oneDay = 24 * 60 * 60 * 1000
      const today = Date.now()
      const startDate = new Date(this.ballot.begin_time).getTime()
      const diffDays = Math.round(Math.abs((today - startDate) / oneDay))
      return diffDays
    },
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
      // console.log('winner', winner)
      return this.ballot.options[winner]
    },
    ballotDescription () {
      if (this.getIPFShash) {
        return this.ballot.description.replace(regexWithUrl, '').replace(regex, '')
      }

      return this.ballot.description
    },
    ballotContent () {
      if (this.ballot.content.match(regex)) {
        return this.ballot.content.replace(regexWithUrl, '').replace(regex, '')
      }

      return this.ballot.content
    },
    getIPFShash () {
      if (this.ballot.description.match(regex)) {
        const r = regex.exec(this.ballot.description)[0]
        return r
      } else if (this.ballot.content.match(regex)) {
        const r = regex.exec(this.ballot.content)[0]
        return r
      } else {
        return false
      }
      // https://api.ipfsbrowser.com/ipfs/get.php?hash=QmS6QwbGDde7cdyvWfUSX5PPWrFkiumqTHouBV3jYhPXme
    }
  },
  methods: {
    ...mapActions('trails', ['fetchBallot', 'castVote']),
    openUrl (url) {
      window.open(`${process.env.BLOCKCHAIN_EXPLORER}/account/${url}`)
    },
    getPercentofTotal (option) {
      const total = ((Number(option.value.split(' ')[0]) / Number(this.ballot.total_raw_weight.split(' ')[0])) * 100)
      return Number.isInteger(total) ? total : total.toFixed(2)
    },
    async onCastVote ({ options, option, ballotName }) {
      this.voting = true
      console.log(this.ballot)
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

.row.bg-white.justify-between.popup-wrapper
  template(v-if="!loading && ballot")
    //- q-card(:class="ballot.status === 'voting' && isBallotOpened ? '' : 'poll-ended'").poll-item
    //-   q-card-section().card-img-wrapper
    //-     template(v-if="isBallotOpened && ballot.status === 'voting'")
    //-       img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon1.png`").bgr-icon1
    //-       img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon2.png`").bgr-icon2
    //-     template(v-else)
    //-       img(:src="`statics/app-icons/inactive-bgr-icon1.png`").bgr-icon1
    //-       img(:src="`statics/app-icons/inactive-bgr-icon2.png`").bgr-icon2
    //-   ballot-chip(:type="ballot.category").absolute-top-left

    //-   q-separator.card-separator-vertical(vertical inset)

    //-   ballot-status(
    //-     :ballot="ballot"
    //-     :isBallotOpened="isBallotOpened"
    //-     :getEndTime="getEndTime"
    //-     :votingHasBegun="votingHasBegun"
    //-     :getStartTime="getStartTime"
    //-   )

    //-   q-card-section().q-pb-none.cursor-pointer.title-section
    //-     div.text-section.row.ballot-card-title-wrapper
    //-       span.ballot-card-title {{ ballot.title || "Untitled Ballot" }}
    //-     div.ballot-card-sub-title-wrapper
    //-         span.opacity04 By&nbsp
    //-         a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
    //-         span.opacity04 &nbspin&nbsp
    //-         span.opacity06 {{ ballot.treasury.title || "No treasury" }}
    .col-xs.col-sm-auto(style="min-width: 240px;")
      q-card.popup-left-col.poll-item(
        id="ballot-card"
        flat
        square
        bordered
      )
        q-card-section.card-img-section
          div.card-img-wrapper
            template(v-if="isBallotOpened(ballot) && ballot.status === 'voting'")
              img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon1.png`").bgr-icon1
              img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon2.png`").bgr-icon2
            template(v-else)
              img(:src="`statics/app-icons/inactive-bgr-icon1.png`").bgr-icon1
              img(:src="`statics/app-icons/inactive-bgr-icon2.png`").bgr-icon2
            ballot-chip(:type="ballot.category").absolute-top-left
            ballot-status(
              :ballot="ballot"
              :isBallotOpened="isBallotOpened(ballot)"
              :getEndTime="getEndTime(ballot)"
              :votingHasBegun="votingHasBegun(ballot)"
              :getStartTime="getStartTime(ballot)"
            )
          //- (v-if="ballot.options.length === 2")
          div
            template(v-if="displayWinner(ballot)")
              div(v-for="(option, index) in ballot.options" :key="index" :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'progress-bar-success' : 'progress-bar-fail' : ''").progress-bar(:style="{ width: `${getPercentofTotal(option)}%` }" :title="`Voted ${option.key}: ${ getPercentofTotal(option) }%`")
            div(v-else title="No votes yet").progress-bar.progress-no-votes

          q-list(dense)
            template(v-for="option in ballot.options")
              ballot-view-option(
                :option="option"
                :ballot="ballot"
                :isBallotOpened="isBallotOpened(ballot)"
                :displayWinner="displayWinner"
                :votes="votes"
              )
            q-item(v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").capitalize
              q-item-section
                q-btn(
                  color="primary"
                  outline
                  :label="$t('pages.trails.ballots.vote')"
                  :disabled="(votes.length < ballot.min_options || votes.length > ballot.max_options)"
                  @click="onCastVote({ options: votes, ballotName: ballot.ballot_name })"
                )
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
        //- q-card-section.dashed-bottom
        //-   ballot-chip(:type="ballot.category" color="#9793fa").absolute-top-right.lt-sm

        //-   ballot-status(
        //-     :ballot="ballot"
        //-     :isBallotOpened="isBallotOpened(ballot)"
        //-     :getEndTime="getEndTime(ballot)"
        //-     :votingHasBegun="votingHasBegun(ballot)"
        //-     :getStartTime="getStartTime(ballot)"
        //-   )

        //-   div.q-py-sm
        //-   div.q-mt-lg
        //-     span.text-h6.text-secondary {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}
        //-     span.text-caption  {{ ballot.total_raw_weight.split(' ')[1]  }} voted
        //-   //- (v-if="ballot.options.length === 2")
        //-   div.progress.q-mt-sm.full-width
        //-     template(v-if="displayWinner(ballot)")
        //-       div(v-for="(option, index) in ballot.options" :key="index" :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'progress-bar-success' : 'progress-bar-fail' : ''").progress-bar(:style="{ width: `${getPercentofTotal(option)}%` }" :title="`Voted ${option.key}: ${ getPercentofTotal(option) }%`")
        //-     div(v-else title="No votes yet").progress-bar.progress-no-votes

        //-   q-list(dense)
        //-     q-item(
        //-       v-for="option in ballot.options"
        //-       :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'text-green' : 'text-red' : ''"
        //-       :key="option.key"
        //-     ).no-padding.capitalize
        //-       q-item-section(side)
        //-         q-checkbox(
        //-           v-model="votes"
        //-           :disable="ballot.status !== 'cancelled' && !isBallotOpened(ballot)"
        //-           keep-color
        //-           :color="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'green' : 'red' : ''"
        //-           :val="option.key"
        //-         )
        //-       q-item-section {{ option.key }}
        //-     q-item(v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").capitalize
        //-       q-item-section
        //-         q-btn(
        //-           color="primary"
        //-           outline
        //-           :label="$t('pages.trails.ballots.vote')"
        //-           :disabled="(votes.length < ballot.min_options || votes.length > ballot.max_options)"
        //-           @click="onCastVote({ options: votes, ballotName: ballot.ballot_name })"
        //-         )
    .col-xs-12.col-sm
      q-card(
        flat
        square
      ).popup-right-col
        q-card-section
          q-btn(icon="close" flat v-close-popup).absolute-top-right.gt-xs
          div.text-section.row.ballot-card-title-wrapper
            span.ballot-card-title {{ ballot.title || "Untitled Ballot" }}
          div.ballot-card-sub-title-wrapper
            span.opacity04 By&nbsp
            a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
            span.opacity04 &nbspin&nbsp
            span.opacity06 {{ ballot.treasury.title || "No treasury" }}
          q-btn(icon="close" flat v-close-popup).absolute-top-right.lt-sm
          //- ballot-chip(:type="ballot.category" color="#9793fa").absolute-top-right.gt-xs

        q-separator.popup-separator
        q-card-section.description-section-wrapper
          div.description-section
            div(:class="getIPFShash ? `q-pb-md` : `q-pb-xl q-mb-lg`") {{ ballotDescription }}
            div(v-if="ballotContent").q-pb-md {{ ballotContent }}
            embed(v-if="getIPFShash" :src="`https://api.ipfsbrowser.com/ipfs/get.php?hash=${getIPFShash}`" type="application/pdf" style="width: 100%; height: 100%; min-height: 480px;").kv-preview-data.file-preview-pdf.file-zoom-detail.shadow-1
            div(v-else).text-center.absolute-bottom
              img(src="/statics/app-icons/no-pdf.svg" style="width: 60px;")
              p(style="color: #a1c1ff").text-caption No PDF found
  q-inner-loading(v-else)
    q-spinner(size="3em")
</template>
<style lang="sass" scoped>
.open-sans
  font-family: open sans,arial,sans-serif;
.link
  color: #0481d8;
.ballot-status
  right: 0
  top: 0
.winner
  color: green
  font-size: 15px
  font-weight: 600
.dashed-bottom
  border-bottom: 1px dashed rgba(0, 0, 0, 0.12)
#ballot-card
  width: auto
.poll-item .range .progress
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 1rem;
  overflow: hidden;
  font-size: .75rem;
  background-color: #e9ecef;
  border-radius: .25rem;

.progress
  margin-bottom: 13px;
  height: 10px;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  background: #ff5746;

.poll-item .progress .progress-bar-success
  background: #3bad6d;
  border-radius: 10px;
  border: 2px solid #fff;
  border-left: 0;
  height: calc(100% + 4px);
  top: -2px;
  position: relative;

.poll-item .progress .progress-no-votes
  background: #e7e4e4;
  border-radius: 10px;
  border: 2px solid #fff;
  border-left: 0;
  height: calc(100% + 4px);
  top: -2px;
  position: relative;
.card-img-section
  padding: 0
.popup-wrapper
  max-width: 1180px !important
  max-height: 640px
  box-shadow: 0px 20px 48px rgba(0, 9, 26, 0.08), 0px 7px 15px rgba(0, 9, 26, 0.05), 0px 3px 6px rgba(0, 9, 26, 0.04), 0px 1px 2.25px rgba(0, 9, 26, 0.0383252)
  border-radius: 12px
  overflow: hidden
  & .poll-item
    border: none
  & .ballot-card-title-wrapper
    height: auto
  & .bgr-icon1
    top: -2px
    right: 70px
  & .bgr-icon2
    top: 74px
    right: 15px
  & .card-img-wrapper
    overflow: visible
  & .absolute-top-left
    top: -6px
    left: -12px
  & .left-tag
    top: 126px
    left: -12px
.popup-left-col .card-img-wrapper
  margin: 12px
  height: 176px
  width: 244px
.description-section-wrapper
  height: 500px
  overflow: auto
  scrollbar-color: #caccce #EFEFF0
  scrollbar-width: thin
  &::-webkit-scrollbar
    width: 6px
    background-color: #EFEFF0
  &::-webkit-scrollbar-thumb
    background-color: #caccce
    border-radius: 5px
.description-section
  height: max-content
.popup-right-col
  border-left: 1px solid #F2F3F4
.popup-separator
  background: #F2F3F4
</style>
