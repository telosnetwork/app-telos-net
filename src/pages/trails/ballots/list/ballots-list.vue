<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BallotForm from '../components/ballot-form'
import BallotListItem from '../components/ballot-list-item'
import BallotView from '../view/ballot-view'

export default {
  name: 'ballots-list',
  components: { BallotForm, BallotListItem, BallotView },
  data () {
    return {
      show: false,
      showBallot: false,
      statusChange: false,
      timeAtMount: undefined,
      openedBallot: {},
      voting: false,
      treasury: null,
      statuses: ['voting'],
      statusOptions: [
        { value: 'voting', label: 'Active' }, // abstracting "Voting" to "Active" for better UX and clarity
        { value: 'closed', label: 'Closed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'archived', label: 'Archived' },
        { value: 'setup', label: 'Setup' }
      ]
    }
  },
  async mounted () {
    console.log(`mounted`)
    this.timeAtMount = Date.now()
    this.statusChange = false
    if (this.$route.params.id) {
      this.showBallot = true
    }
    if (this.$route.query) {
      this.treasury = this.$route.query.treasury
    }
    this.resetBallots()

    console.log(`after reset ballots`)
    await this.fetchFees()
    this.$refs.infiniteScroll.reset()
    this.$refs.infiniteScroll.poll()
  },
  methods: {
    ...mapActions('trails', ['fetchFees', 'fetchBallots', 'castVote', 'fetchTreasuries', 'fetchBallotsByStatus']),
    ...mapMutations('trails', ['resetBallots', 'stopAddBallots']),
    async onLoad (index, done) {
      if (!this.ballotsLoaded) {
        const filter = {
          index: 4,
          lower: this.treasury || (this.$route.query && this.$route.query.treasury),
          upper: this.treasury || (this.$route.query && this.$route.query.treasury)
        }
        await this.fetchBallots(filter)

        done()
      } else {
        this.$refs.infiniteScroll.stop()
      }
    },
    openBallot (ballot) {
      if (this.showBallot) {
        console.log('closing ballot', ballot)
        this.showBallot = false
        return
      }
      console.log('opening ballot', ballot)
      this.timeAtMount = Date.now()
      this.$router.push(`/trails/ballots/${ballot.ballot_name}/${this.timeAtMount}`)
      // the timestamp prevents scroll glitches on the infinite list
    },
    isBallotOpened (ballot) {
      let endTime = new Date(ballot.end_time).getTime()
      let notExpired = endTime > Date.now()
      let startTime = new Date(ballot.begin_time).getTime()
      let isStarted = startTime < Date.now()
      return notExpired && isStarted
    },
    displayWinner (ballot) {
      if (!ballot.total_voters) return false
      let winnerValue = -1
      let winner
      ballot.options.forEach(option => {
        if (parseFloat(option.value) > winnerValue) {
          winner = option.key
        }
      })
      return winner
    },
    votingHasBegun (ballot) {
      let startTime = new Date(ballot.begin_time).getTime()
      let isStarted = startTime < Date.now()
      return isStarted
    },
    getStartTime (ballot) {
      return new Date(ballot.begin_time).getTime()
    },
    getEndTime (ballot) {
      return new Date(ballot.end_time).getTime()
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('trails', ['ballots', 'ballotsLoaded', 'treasuriesOptions'])
  },
  watch: {
    '$route' (to, from) {
      console.log(`watching $route`)
      if (to.params.id !== undefined) {
        this.showBallot = true
      } else {
        this.showBallot = false
      }
    },
    treasury: function (val, old) {
      console.log(`watching treasury`)
      if (val !== old) {
        this.resetBallots()
      }
    },
    statuses: function (val, old) {
      console.log(`watching statuses`)
      if (val !== old) {
        this.resetBallots()
      }
    },
    treasuriesOptions: {
      immediate: true,
      handler: async function (val) {
        console.log(`watching treasuriesOptions`)
        if (!val.length) {
          // TODO past 100 groups we need to switch to autocomplete search
          await this.fetchTreasuries()
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  ballot-form(:show.sync="show")
  .row.col-12.banner.justify-center.items-center.q-mb-md.border-white.q-card--bordered.relative-position
    div.row.justify-center.items-center.q-my-md.text-center
      img(src="/statics/app-icons/vote.svg" style="width: 40px")
      img(src="/statics/telos-logo-white.svg" style="width: 85px").on-right
      span.text-h4.text-white ,
      span.on-right.text-h4.text-white your vote matters
    div.banner-grey-bar.absolute-bottom

  .row.flex.justify-end
    q-select.q-mb-lg.q-mr-sm(
      v-model="statuses"
      :options="statusOptions"
      label="Status"
      multiple
      :style="{width: '200px'}"
      emit-value
      map-options
    )
      template(v-slot:option="scope")
        q-item(
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        )
          q-item-section(side)
            q-checkbox(
              v-model="statuses"
              :val="scope.opt.value"
            )
          q-item-section
            q-item-label(v-html="scope.opt.label")
    q-select.q-mb-lg(
      v-model="treasury"
      :options="treasuriesOptions"
      label="Group filter"
      :style="{width: '200px'}"
      emit-value
      map-options
    )

  .ballots(ref="ballotsRef")
    q-infinite-scroll(
      ref="infiniteScroll"
      :disable="ballotsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.ballotsRef"
    )
      div.row.justify-around.q-gutter-x-md.q-gutter-y-xl
        ballot-list-item(
          @click.native="openBallot(ballot)"
          v-for="(ballot, index) in ballots.filter(b => statuses.length === 0 || statuses.includes(b.status))"
          :key="index"
          :ballot="ballot"
          :displayWinner="displayWinner"
          :isBallotOpened="isBallotOpened(ballot)"
          :votingHasBegun="votingHasBegun(ballot)"
          :getStartTime="getStartTime(ballot)"
          :getEndTime="getEndTime(ballot)"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
    v-if="isAuthenticated"
    position="bottom-right"
    :offset="[18, 18]"
  )
    q-btn(
      fab
      icon="fas fa-plus"
      color="accent"
      @click="show = true"
    )
  q-dialog(full-width v-model="showBallot" :key="$route.params.id + timeAtMount" transition-show="slide-up" transition-hide="slide-down").full-width
    //- div(style="width: 80vw").bg-white
      //- p test
    ballot-view(
      :isBallotOpened="isBallotOpened"
      :displayWinner="displayWinner"
      :votingHasBegun="votingHasBegun"
      :getStartTime="getStartTime"
      :getEndTime="getEndTime"
    )
      //- q-btn(v-close-popup color="secondary").float-right Close
</template>
<style lang="sass" scoped>
.link
  text-decoration: none
.banner
  background: #571aff99;
.banner .banner-grey-bar
  background-color: #0000001a;
  height: 46%;
  width: 100%;
</style>
