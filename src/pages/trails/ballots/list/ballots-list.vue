<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BallotForm from '../components/ballot-form'

export default {
  name: 'ballots-list',
  components: { BallotForm },
  data () {
    return {
      show: false,
      voting: false
    }
  },
  async mounted () {
    this.resetBallots()
    await this.fetchFees()
  },
  methods: {
    ...mapActions('trails', ['fetchFees', 'fetchBallots', 'castVote']),
    ...mapMutations('trails', ['resetBallots']),
    async onLoad (index, done) {
      await this.fetchBallots()
      done()
    },
    async onCastVote ({ option, ballotName }) {
      this.voting = true
      await this.castVote({
        ballotName,
        options: [option]
      })
      this.voting = false
    },
    isBallotOpened (ballot) {
      return new Date(ballot.end_time).getTime() > Date.now() && new Date(ballot.begin_time).getTime() < Date.now()
    },
    displayWinner (ballot) {
      if (!ballot.total_voters) return 'No votes'
      let winnerValue = -1
      let winner
      ballot.options.forEach(option => {
        if (parseFloat(option.value) > winnerValue) {
          winnerValue = parseFloat(option.value)
          winner = option.key
        }
      })
      return `Result: ${winner}, (${parseInt(winnerValue)} votes)`
    }
  },
  computed: {
    ...mapGetters('trails', ['ballots', 'ballotsLoaded'])
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  ballot-form(:show.sync="show")
  .ballots(ref="ballotsRef")
    q-infinite-scroll(
      :disable="ballotsLoaded"
      @load="onLoad"
      :offset="250"
      :scroll-target="$refs.ballotsRef"
    )
      q-list(bordered)
        q-item(
          v-for="ballot in ballots"
          :key="ballot.ballot_name"
        )
          q-item-section(avatar)
            router-link.link(:to="`/trails/ballots/${ballot.ballot_name}`") {{ ballot.publisher }}
          q-item-section
            q-item-label(overline) {{ ballot.title || "Default title" }}
            q-item-label(caption)
              | {{ $t('pages.trails.ballots.starts') }}: {{ ballot.begin_time }}
              br
              | {{ $t('pages.trails.ballots.ends') }}: {{ ballot.end_time }}
          q-item-section(side)
            q-btn(
              v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)"
              :label="$t('pages.trails.ballots.castVote')"
              color="primary"
              :loading="voting"
            )
              q-menu
                q-list
                  q-item(
                    v-for="option in ballot.options"
                    :key="option.key"
                    clickable
                    v-close-popup
                    @click="onCastVote({ option: option.key, ballotName: ballot.ballot_name })"
                  )
                    q-item-section {{ option.key }}
            strong(v-else) {{ displayWinner(ballot) }}
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
  q-page-sticky(
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
