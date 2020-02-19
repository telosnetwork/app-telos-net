<script>
import { mapActions, mapGetters } from 'vuex'
import Countdown from '../components/countdown'

export default {
  name: 'ballot-list-item',
  components: { Countdown },
  props: {
    ballot: { type: Object, required: true }
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
    isBallotOpened (ballot) {
      let endTime = new Date(ballot.end_time).getTime()
      let isOlder = endTime > Date.now()
      let startTime = new Date(ballot.begin_time).getTime()
      let isStarted = startTime > Date.now()
      return isOlder && isStarted
    },
    getEndTime (ballot) {
      return new Date(ballot.end_time).getTime()
    },
    displayWinner (ballot) {
      if (!ballot.total_voters) return false
      let winnerValue = -1
      let winner
      ballot.options.forEach(option => {
        if (parseFloat(option.value) > winnerValue) {
          // winnerValue = parseFloat(option.value)
          winner = option.key
        }
      })
      return winner
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
  //- (v-if="ballot.total_voters > 0")
  q-card(@click="$router.push(`/trails/ballots/${ballot.ballot_name}`)" :class="ballot.status === 'voting' && isBallotOpened(ballot) ? '' : 'poll-ended'").my-card.poll-item.cursor-pointer
    template(v-if="ballot.category === 'poll'")
      img(src="statics/app-icons/poll-w.png")
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      q-chip(round text-color="white" style="background: #9793fa").absolute-top-right.capitalize.no-margin.text-weight-bold
        q-avatar
          img(src="statics/app-icons/poll-icon.svg").poll-icon
        span Poll
    template(v-else-if="ballot.category === 'referendum'")
      img(src="statics/app-icons/referendum-w.png")
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      q-chip(round text-color="white" style="background: #94d5fa").absolute-top-right.capitalize.no-margin.text-weight-bold
        q-avatar
          img(src="statics/app-icons/referendum-icon.svg").poll-icon
        span Referendum
    template(v-else-if="ballot.category === 'proposal'")
      img(src="statics/app-icons/proposal-w.png")
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      q-chip(round text-color="white" style="background: #e293fa").absolute-top-right.capitalize.no-margin.text-weight-bold
        q-avatar
          img(src="statics/app-icons/proposal-icon.svg").poll-icon
        span Proposal
    template(v-else-if="ballot.category === 'election'")
      img(src="statics/app-icons/election-w.png")
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      q-chip(round text-color="white" style="background: #93b8fa").absolute-top-right.capitalize.no-margin.text-weight-bold
        q-avatar
          img(src="statics/app-icons/election-icon.svg").poll-icon
        span Election
    template(v-else-if="ballot.category === 'leaderboard'")
      img(src="statics/app-icons/leaderboard-w.png")
      div.grey-bar.absolute-top
        div.col-auto.absolute-bottom-right.q-pr-sm
          span.text-caption.text-grey-9.text-weight-medium {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }} {{ ballot.total_raw_weight.split(' ')[1]  }}
          span.text-grey-9.text-weight-light  voted
      q-chip(round text-color="white" style="background: #fa93a2").absolute-top-right.capitalize.no-margin.text-weight-bold
        q-avatar
          img(src="statics/app-icons/leaderboard-icon.svg").poll-icon
        span Leaderboard

    div(:class="ballot.status === 'closed' || ballot.status === 'cancelled' ? 'text-grey-7' : 'link'").left-tag.left-tag-left
      template(v-if="ballot.status === 'voting' && isBallotOpened(ballot)")
        cite Time Remaining
        countdown(v-if="ballot.status === 'voting' && isBallotOpened(ballot)" :endtime="getEndTime(ballot)")

      template(v-else)
        cite Status
        span(v-if="ballot.status === 'setup'") SETUP
        span(v-else) ENDED

    q-card-section(@click="log('ballot', ballot)").q-pb-none
      div.text-section.row
        span.link.text-subtitle2.text-weight-bolder.ellipsis {{ ballot.title || "Untitled Ballot" }}
         //- div.text-subtitle2 by {{ ballot.publisher }}
        div.ellipsis-3-lines {{ ballot.description + ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }}

    q-card-section.voting-section.bg-grey-1
      //- q-linear-progress(size="25px" :value="Number(ballot.options[0].value.split(' ')[0]) / Number(ballot.options[1].value.split(' ')[0])" color="green" track-color="red")
      //- q-linear-progress(v-if="ballot.options.length === 2 && ballot.total_voters > 0" size="10px" :value="Number(ballot.options[1].value.split(' ')[0]) / Number(ballot.options[0].value.split(' ')[0])" color="teal" track-color="primary").q-my-sm
      //- div.voting-section.row.justify-between
      div
        q-scroll-area(horizontal style="height: 40px;").rounded-borders.row.justify-end
          div.row.no-wrap.q-mb-sm
            q-chip(v-for="(option, index) in ballot.options" :key="index" dense outline :color="displayWinner(ballot) ? displayWinner(ballot) === ballot.options[index].key ? 'green' : 'red' : ''" :icon="displayWinner(ballot) === ballot.options[index].key ? 'done' : ''").capitalize {{ `${ballot.options[index].key}: ` }}
              span(v-if="ballot.total_voters > 0").q-pl-xs {{ Number(ballot.options[index].value.split(' ')[0]) / Number(ballot.total_raw_weight.split(' ')[0]) * 100 }}%
              span(v-else).q-pl-xs 0%
    //- q-item
    //-   q-item-section(avatar)
    //-     strong {{ ballot.treasury.title || ballot.treasury_symbol }}
    //-     router-link.link(:to="`/trails/ballots/${ballot.ballot_name}`") By {{ ballot.publisher }}
    //-   q-item-section
    //-     q-item-label(overline)
    //-       router-link.link(:to="`/trails/ballots/${ballot.ballot_name}`") {{ ballot.title || "Default title" }}
    //-     q-item-label(caption)
    //-       | {{ $t('pages.trails.ballots.starts') }}: {{ new Date(ballot.begin_time).toLocaleDateString() }}
    //-       br
    //-       | {{ $t('pages.trails.ballots.ends') }}: {{ new Date(ballot.end_time).toLocaleDateString() }}
    //-   q-item-section(side)

    //-  v-if="isAuthenticated && ballot.status !== 'cancelled' && isBallotOpened(ballot)"
    //- q-btn(
    //-   v-if="isAuthenticated && ballot.status !== 'cancelled' && isBallotOpened(ballot)"
    //-   :label="$t('pages.trails.ballots.castVote')"
    //-   color="primary"
    //-   :loading="voting"
    //- )
    //-   q-menu
    //-     q-list(v-if="ballot.max_options === 1")
    //-       q-item(
    //-         v-for="option in ballot.options"
    //-         :key="option.key"
    //-         clickable
    //-         v-close-popup
    //-         @click="onCastVote({ option: option.key, ballotName: ballot.ballot_name })"
    //-       )
    //-         q-item-section {{ option.key }}
    //-     q-list(v-else)
    //-       q-item(
    //-         v-for="option in ballot.options"
    //-         :key="option.key"
    //-       )
    //-         q-item-section(side)
    //-           q-checkbox(
    //-             v-model="votes"
    //-             :val="option.key"
    //-           )
    //-         q-item-section {{ option.key }}
    //-       q-item
    //-         q-item-section
    //-           q-btn(
    //-             color="primary"
    //-             :label="$t('pages.trails.ballots.castVote')"
    //-             :disabled="votes.length < ballot.min_options || votes.length > ballot.max_options"
    //-             v-close-popup
    //-             @click="onCastVote({ options: votes, ballotName: ballot.ballot_name })"
    //-           )
</template>

<style lang="sass" scoped>
.poll-ended
  opacity: .4 !important;
  outline: 0 !important;
.link
  color: #0481d8;
  cursor: pointer;
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
.q-chip .q-avatar img.poll-icon
  width: 32px;
  padding-left: 10px;
  margin-right: 4px;
.q-card.poll-item
  overflow: hidden
  width: 340px;

.q-card > div.poll-item
  box-shadow: unset
  height 100px
.poll-item .left-tag
  padding: 5px 7px 0 10px;
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  border-radius: 7px 0 20px 0;
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
</style>
