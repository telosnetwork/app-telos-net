<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BallotForm from '../components/ballot-form'
import BallotListItem from '../components/ballot-list-item'
import BallotView from '../view/ballot-view'
import WelcomeCard from '../../../../components/welcome-card'
import ActionBar from '../../../../components/action-bar'

export default {
  name: 'ballots-list',
  components: { BallotForm, BallotListItem, BallotView, WelcomeCard, ActionBar },
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
      categories: [],
      statusOptions: [
        { value: 'voting', label: 'Active' }, // abstracting "Voting" to "Active" for better UX and clarity
        { value: 'closed', label: 'Closed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'archived', label: 'Archived' },
        { value: 'setup', label: 'Setup' }
      ],
      isBallotListRowDirection: true,
      currentPage: 1,
      limit: 12,
      page: 1
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
      console.log(this.ballots)
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
    },
    isNewUser () {
      return localStorage.isNewUser
    },
    updateTreasury (newTreasury) {
      this.treasury = newTreasury
    },
    updateStatuses (newStatuses) {
      console.log(newStatuses)
      this.statuses = newStatuses
    },
    updateCategories (newCategories) {
      this.categories = newCategories
    },
    filterBallots (ballots) {
      const ballotFiltered = ballots.filter(b => this.statuses.length === 0 || this.statuses.includes(b.status))
      return ballotFiltered.filter(b => this.categories.length === 0 || this.categories.includes(b.category))
    },
    changeDirection (isBallotListRowDirection) {
      this.isBallotListRowDirection = isBallotListRowDirection
      console.log(this.isBallotListRowDirection)
    },
    getPage (ballots) {
      return ballots.slice((this.page - 1) * this.limit, (this.page - 1) * this.limit + this.limit)
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
    }
  }
}
</script>

<template lang="pug">
q-page
  welcome-card(v-if="!isNewUser()")
  action-bar(
    @update-treasury="updateTreasury"
    @update-statuses="updateStatuses"
    @update-categories="updateCategories"
    @change-diraction="changeDirection"
    :treasuriesOptions="treasuriesOptions")
  ballot-form(:show.sync="show")

  .ballots(ref="ballotsRef")
    q-infinite-scroll(
      ref="infiniteScroll"
      :disable="ballotsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.ballotsRef"
    )
      div(:class="isBallotListRowDirection ? 'row-direction' : 'column-direction'")
        ballot-list-item(
          @click.native="openBallot(ballot)"
          v-for="(ballot, index) in getPage(filterBallots(ballots))"
          :key="index"
          :ballot="ballot"
          :displayWinner="displayWinner"
          :isBallotOpened="isBallotOpened(ballot)"
          :votingHasBegun="votingHasBegun(ballot)"
          :getStartTime="getStartTime(ballot)"
          :getEndTime="getEndTime(ballot)"
        )
      div.flex.flex-center.pagination-wrapper
        q-pagination(
          v-model="page"
          :min="currentPage"
          :max="Math.ceil(filterBallots(ballots).length / limit)"
          :max-pages="6"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
          size="12px"
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
.row-direction
  display: flex
  justify-content: space-between
  flex-wrap: wrap
.column-direction
  display: flex
  flex-direction: column
.pagination-wrapper
  margin: 24px 0
@media (max-width: 600px)
  .pagination-wrapper
    margin-bottom: 100px
    font-size: 12px
</style>
