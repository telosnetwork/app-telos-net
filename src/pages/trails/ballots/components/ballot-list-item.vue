<script>
import { mapActions, mapGetters } from 'vuex'
import BallotStatus from '../components/ballot-status'
import BallotChip from '../components/ballot-chip'

export default {
  name: 'ballot-list-item',
  components: { BallotStatus, BallotChip },
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
    ...mapGetters('accounts', ['isAuthenticated'])
  },
  methods: {
    ...mapActions('trails', ['castVote']),
    log (msg, val) {
      console.log(msg, val)
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
div.col-auto
  q-card(:class="ballot.status === 'voting' && isBallotOpened ? '' : 'poll-ended'").poll-item
    template(v-if="ballot.category === 'poll'")
      img(src="statics/app-icons/poll-w.png").poll-image
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      ballot-chip(type="Poll" color="#9793fa").absolute-top-right

    template(v-else-if="ballot.category === 'referendum'")
      img(src="statics/app-icons/referendum-w.png").poll-image
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      ballot-chip(type="Referendum" color="#94d5fa").absolute-top-right

    template(v-else-if="ballot.category === 'proposal'")
      img(src="statics/app-icons/proposal-w.png").poll-image
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      ballot-chip(type="Proposal" color="#e293fa").absolute-top-right

    template(v-else-if="ballot.category === 'election'")
      img(src="statics/app-icons/election-w.png").poll-image
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      ballot-chip(type="Election" color="#93b8fa").absolute-top-right

    template(v-else-if="ballot.category === 'leaderboard'")
      img(src="statics/app-icons/leaderboard-w.png").poll-image
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      ballot-chip(type="Leaderboard" color="#fa93a2").absolute-top-right

    ballot-status(
      :ballot="ballot"
      :isBallotOpened="isBallotOpened"
      :getEndTime="getEndTime"
      :votingHasBegun="votingHasBegun"
      :getStartTime="getStartTime"
    )

    q-card-section().q-pb-none.cursor-pointer
      div.text-section.row
        span.link.text-subtitle2.text-weight-bolder.ellipsis {{ ballot.title || "Untitled Ballot" }}
        div.ellipsis-3-lines {{ ballot.description || "No description" }}

    q-card-section.voting-section.bg-grey-1

      div(@click="log('ballot', ballot); getEndTime; isBallotOpened")
        q-scroll-area(horizontal style="height: 40px;").rounded-borders.row.justify-end
          div.row.no-wrap.q-mb-sm
            q-chip(v-for="(option, index) in ballot.options" :key="index" dense outline :color="displayWinner(ballot) ? displayWinner(ballot) === ballot.options[index].key ? 'green' : 'red' : ''" :icon="displayWinner(ballot) === ballot.options[index].key ? 'done' : ''").capitalize {{ `${ballot.options[index].key}: ` }}
              span(v-if="ballot.total_voters > 0").q-pl-xs {{ (Number(ballot.options[index].value.split(' ')[0]) / Number(ballot.total_raw_weight.split(' ')[0]) * 100).toFixed(2) }}%
              span(v-else).q-pl-xs 0.00%
</template>

<style lang="sass">
.poll-ended .text-section, .poll-ended .voting-section, .poll-ended img.poll-image
  opacity: .4 !important;
  outline: 0 !important;
.poll-item .left-tag
  padding: 5px 7px 0 10px;
  position: absolute;
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.1);
  left: 0;
  top: 0;
  background: #fff;
  border-radius: 7px 0 20px 0 !important;
  min-height: 40px;
  min-width: 72px;
  z-index: 9;
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
.text-section
  height: 86px;
.grey-bar
  background-color: #00000008;
  height: 70px;
  top: 100px;
.voting-section
  padding-top: 10px
  padding-bottom: 0px
.q-card.poll-item
  overflow: hidden
  width: 340px;
.q-card > div.poll-item
  box-shadow: unset
  height 100px

.q-card > div:not(:last-child), .q-card > img:not(:last-child)
    border-bottom-left-radius: 0;
</style>
