<script>
import { mapActions, mapGetters } from 'vuex'
import BallotStatus from '../components/ballot-status'
import BallotChip from '../components/ballot-chip'
const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'
const regexWithUrl = new RegExp(/https?\:\/\/.*Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'

export default {
  name: 'ballot-view',
  components: { BallotStatus, BallotChip },
  props: {
    isBallotOpened: { type: Function, required: true },
    displayWinner: { type: Function, required: true },
    votingHasBegun: { type: Function, required: true },
    getStartTime: { type: Function, required: true },
    getEndTime: { type: Function, required: true }
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
    getLoser () {
      if (!this.ballot.total_voters || this.ballot.options.length !== 2) return false
      return this.ballot.options.find(x => x.key !== this.getWinner.key)
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
      return (Number(option.value.split(' ')[0]) / Number(this.ballot.total_raw_weight.split(' ')[0])) * 100
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

.row.bg-white.justify-between(style="max-width: 1200px !important;")
  template(v-if="!loading && ballot")
    .col-xs-12.col-sm
      q-card.full-width(
        flat
        square
        bordered
      ).full-height
        q-card-section
          .text-h6.q-pt-sm {{ ballot.title || 'Untitled Ballot' }}
          .col-auto
            q-chip(dense square outline color="grey") {{ ballot.ballot_name }}
            span by
            a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
          q-btn(icon="close" flat v-close-popup).absolute-top-right.lt-sm
          ballot-chip(:type="ballot.category" color="#9793fa").absolute-top-right.gt-xs

        q-separator
        q-card-section(:style="{ height: getIPFShash ? 'auto' : 'calc(100% - 105px)' }")
          div(:class="getIPFShash ? `q-pb-md` : `q-pb-xl q-mb-lg`") {{ ballotDescription }}
          div(v-if="ballotContent").q-pb-md {{ ballotContent }}
          embed(v-if="getIPFShash" :src="`https://api.ipfsbrowser.com/ipfs/get.php?hash=${getIPFShash}`" type="application/pdf" style="width: 100%; height: 100%; min-height: 480px;").kv-preview-data.file-preview-pdf.file-zoom-detail.shadow-1
          div(v-else).text-center.absolute-bottom
            img(src="/statics/app-icons/no-pdf.svg" style="width: 60px;")
            p(style="color: #a1c1ff").text-caption No PDF found

    .col-xs.col-sm-auto(style="min-width: 240px;")
      q-card(
        id="ballot-card"
        flat
        square
        bordered
      ).poll-item.full-height
        q-card-section.dashed-bottom
          q-btn(icon="close" flat v-close-popup).absolute-top-right.gt-xs
          ballot-chip(:type="ballot.category" color="#9793fa").absolute-top-right.lt-sm

          ballot-status(
            :ballot="ballot"
            :isBallotOpened="isBallotOpened(ballot)"
            :getEndTime="getEndTime(ballot)"
            :votingHasBegun="votingHasBegun(ballot)"
            :getStartTime="getStartTime(ballot)"
          )

          div.q-py-sm
          div.q-mt-lg
            span.text-h6.text-secondary {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}
            span.text-caption  {{ ballot.total_raw_weight.split(' ')[1]  }} voted
          //- (v-if="ballot.options.length === 2")
          div.progress.q-mt-sm.full-width
            template(v-if="displayWinner(ballot)")
              div(v-for="(option, index) in ballot.options" :key="index" :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'progress-bar-success' : 'progress-bar-fail' : ''").progress-bar(:style="{ width: `${getPercentofTotal(option)}%` }" :title="`Voted ${option.key}: ${ getPercentofTotal(option) }%`")
            div(v-else title="No votes yet").progress-bar.progress-no-votes

          q-list(dense)
            q-item(
              v-for="option in ballot.options"
              :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'text-green' : 'text-red' : ''"
              :key="option.key"
            ).no-padding.capitalize
              q-item-section(side)
                q-checkbox(
                  v-model="votes"
                  :disable="ballot.status !== 'cancelled' && !isBallotOpened(ballot)"
                  keep-color
                  :color="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'green' : 'red' : ''"
                  :val="option.key"
                )
              q-item-section {{ option.key }}
            q-item(v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").capitalize
              q-item-section
                q-btn(
                  color="primary"
                  outline
                  :label="$t('pages.trails.ballots.vote')"
                  :disabled="(votes.length < ballot.min_options || votes.length > ballot.max_options)"
                  @click="onCastVote({ options: votes, ballotName: ballot.ballot_name })"
                )
        q-card-section.open-sans.q-pb-sm
          div.q-pt-sm
            span.text-h6.text-weight-light.text-grey-8 {{ ballot.total_voters }}
            span.text-caption.text-grey-6  {{ ballot.total_voters === 1 ? `account voted` : `accounts voted` }}
          template(v-if="ballot.total_voters > 0")
            q-separator.q-my-sm
            div
              span.text-h6.text-weight-light.text-grey-8 {{ getPercentofTotal(getWinner) }}%
              span.text-caption.text-grey-6  {{ getWinner.key.toUpperCase() }} {{ getLoser.key ? ` lead over ${getLoser.key.toUpperCase()}` : ` lead over others` }}
          q-separator.q-my-sm
          div
            span.text-h6.text-weight-thin.text-grey-8 {{ daysSinceStarted }}
            span.text-caption.text-grey-6  days since {{ ballot.category }} started
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
</style>
