<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BallotForm from '../components/ballot-form'
import BallotListItem from '../components/ballot-list-item'

export default {
  name: 'ballots-list',
  components: { BallotForm, BallotListItem },
  data () {
    return {
      show: false,
      voting: false,
      treasury: null,
      statuses: [],
      statusOptions: [
        { value: 'setup', label: 'Setup' },
        { value: 'voting', label: 'Voting' },
        { value: 'closed', label: 'Closed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'archived', label: 'Archived' }
      ]
    }
  },
  async mounted () {
    if (this.$route.query) {
      this.treasury = this.$route.query.treasury
    }
    this.resetBallots()
    await this.fetchFees()
    this.$refs.infiniteScroll.reset()
    this.$refs.infiniteScroll.poll()
  },
  methods: {
    ...mapActions('trails', ['fetchFees', 'fetchBallots', 'castVote', 'fetchTreasuries']),
    ...mapMutations('trails', ['resetBallots']),
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
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('trails', ['ballots', 'ballotsLoaded', 'treasuriesOptions'])
  },
  watch: {
    treasury: function (val, old) {
      if (val !== old) {
        this.resetBallots()
      }
    },
    treasuriesOptions: {
      immediate: true,
      handler: async function (val) {
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
      q-list(bordered)
        ballot-list-item(
          v-for="ballot in ballots.filter(b => statuses.length === 0 || statuses.includes(b.status))"
          :key="ballot.ballot_name"
          :ballot="ballot"
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
</template>
<style lang="sass" scoped>
.link
  text-decoration: none
</style>
