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
      treasury: '',
      statuses: [],
      categories: [],
      isBallotListRowDirection: true,
      currentPage: 1,
      limit: 1000,
      page: 1,
      sortMode: ''
    }
  },
  props: {
    activeFilter: {
      type: String
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
    openBallotForm () {
      this.show = true
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
    getLocalTime (isoDate) {
      const msOffset = new Date().getTimezoneOffset() * 60 * 1000
      return new Date(isoDate).getTime() - msOffset
    },
    isBallotOpened (ballot) {
      let endTime = this.getLocalTime(ballot.end_time)
      let notExpired = endTime > Date.now()
      let startTime = this.getLocalTime(ballot.begin_time)
      let isStarted = startTime < Date.now()
      return notExpired && isStarted
    },
    isBallotNotStarted (ballot) {
      const startTime = this.getLocalTime(ballot.begin_time)
      return startTime > Date.now()
    },
    displayWinner (ballot) {
      if (!ballot.total_voters) return false
      let winnerValue = -1
      let winner
      ballot.options.forEach(option => {
        if (parseFloat(option.value) > winnerValue) {
          winnerValue = parseFloat(option.value)
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
      return this.getLocalTime(ballot.begin_time)
    },
    getEndTime (ballot) {
      return this.getLocalTime(ballot.end_time)
    },
    isNewUser () {
      return localStorage.isNewUser
    },
    updateTreasury (newTreasury) {
      this.treasury = newTreasury
    },
    updateStatuses (newStatuses) {
      this.statuses = newStatuses
    },
    updateCategories (newCategories) {
      this.categories = newCategories
    },
    filterBallots (ballots) {
      const ballotFiltered = ballots.filter(b => {
        if (this.statuses) {
          if (this.statuses.length === 0) {
            return true
          } else if (this.statuses.includes('active') && this.statuses.includes('expired')) {
            return this.statuses.includes(b.status) || b.status === 'voting'
          } else if (this.statuses.includes('active')) {
            return this.statuses.includes(b.status) || (this.isBallotOpened(b) && b.status === 'voting')
          } else if (this.statuses.includes('expired')) {
            return this.statuses.includes(b.status) || (!this.isBallotOpened(b) && this.votingHasBegun(b) && b.status === 'voting')
          } else if (this.statuses.includes('not started')) {
            return this.statuses.includes(b.status) || (this.isBallotNotStarted(b) && b.status === 'voting')
          }
          return this.statuses.includes(b.status)
        }
      })
      return ballotFiltered.filter(b => this.categories.length === 0 || this.categories.includes(b.category))
    },
    changeDirection (isBallotListRowDirection) {
      this.isBallotListRowDirection = isBallotListRowDirection
    },
    getLoser () {
      if (!this.ballot.total_voters || this.ballot.options.length !== 2) return false
      return this.ballot.options.find(x => x.key !== this.getWinner.key)
    },
    sortBallots (ballots, method) {
      if (method === 'A-Z') {
        return ballots.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
      } else if (method === 'Z-A') {
        return ballots.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1)
      } else if (method === 'Most popular') {
        return ballots.sort((a, b) => a.total_voters < b.total_voters ? 1 : -1)
      } else if (method === 'Least popular') {
        return ballots.sort((a, b) => a.total_voters > b.total_voters ? 1 : -1)
      } else if (method === '') {
        return ballots
      }
    },
    changeSortOption (option) {
      this.sortMode = option
    },
    ballotContentImg (ballot) {
      try {
        return JSON.parse(ballot.content).imageUrl
      } catch (error) {
        return null
      }
    },
    updateCards (params) {
      this.treasury = params.treasury
      this.statuses = params.tatus
      this.categories = params.type
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
  welcome-card(v-if="!isNewUser() && isAuthenticated")
  action-bar(
    @update-treasury="updateTreasury"
    @update-statuses="updateStatuses"
    @update-categories="updateCategories"
    @change-diraction="changeDirection"
    @open-ballot-form="openBallotForm"
    @change-sort-option="changeSortOption"
    @update-cards="updateCards"
    :treasuriesOptions="treasuriesOptions"
    :activeFilter="activeFilter")
  ballot-form(:show.sync="show")
  .ballots(ref="ballotsRef")
    q-infinite-scroll(
      ref="infiniteScroll"
      @load="onLoad"
      :offset="250"
    )
      div(:class="isBallotListRowDirection ? 'row-direction' : 'column-direction'")
        ballot-list-item(
          @click.native="openBallot(ballot)"
          v-for="(ballot, index) in sortBallots(filterBallots(ballots),sortMode)"
          :key="index"
          :ballot="ballot"
          :displayWinner="displayWinner"
          :isBallotOpened="isBallotOpened(ballot)"
          :votingHasBegun="votingHasBegun(ballot)"
          :getStartTime="getStartTime(ballot)"
          :getEndTime="getEndTime(ballot)"
          :getLoser="getLoser"
          :ballotContentImg="ballotContentImg"
        )
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-dialog(v-model="showBallot" :key="$route.params.id + timeAtMount" transition-show="slide-up" transition-hide="slide-down")
    //- div(style="width: 80vw").bg-white
      //- p test
    ballot-view(
      :isBallotOpened="isBallotOpened"
      :displayWinner="displayWinner"
      :votingHasBegun="votingHasBegun"
      :getStartTime="getStartTime"
      :getEndTime="getEndTime"
      :getLoser="getLoser"
      :ballotContentImg="ballotContentImg"
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
  flex-wrap: wrap
  gap: 32px 20px
  margin-top: 32px
.column-direction
  display: flex
  flex-direction: column
.pagination-wrapper
  margin: 24px 0
@media (max-width: 1366px)
  .row-direction
    justify-content: space-between
    max-width: 800px
    margin: 0 auto
    margin-top: 32px
@media (max-width: 768px)
    .row-direction
      justify-content: center
@media (max-width: 600px)
    .row-direction
      margin-top: 0
    .pagination-wrapper
      margin-bottom: 100px
      font-size: 12px
@media (max-width: 400px)
    .row-direction
      gap: 24px 20px
</style>
