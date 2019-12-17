<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ballot-list-item',
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
q-item
  q-item-section(avatar)
    strong {{ ballot.treasury.title || ballot.treasury_symbol }}
    router-link.link(:to="`/trails/ballots/${ballot.ballot_name}`") By {{ ballot.publisher }}
  q-item-section
    q-item-label(overline)
      router-link.link(:to="`/trails/ballots/${ballot.ballot_name}`") {{ ballot.title || "Default title" }}
    q-item-label(caption)
      | {{ $t('pages.trails.ballots.starts') }}: {{ new Date(ballot.begin_time).toLocaleDateString() }}
      br
      | {{ $t('pages.trails.ballots.ends') }}: {{ new Date(ballot.end_time).toLocaleDateString() }}
  q-item-section(side)
    q-btn(
      v-if="isAuthenticated && ballot.status !== 'cancelled' && isBallotOpened(ballot)"
      :label="$t('pages.trails.ballots.castVote')"
      color="primary"
      :loading="voting"
    )
      q-menu
        q-list(v-if="ballot.max_options === 1")
          q-item(
            v-for="option in ballot.options"
            :key="option.key"
            clickable
            v-close-popup
            @click="onCastVote({ option: option.key, ballotName: ballot.ballot_name })"
          )
            q-item-section {{ option.key }}
        q-list(v-else)
          q-item(
            v-for="option in ballot.options"
            :key="option.key"
          )
            q-item-section(side)
              q-checkbox(
                v-model="votes"
                :val="option.key"
              )
            q-item-section {{ option.key }}
          q-item
            q-item-section
              q-btn(
                color="primary"
                :label="$t('pages.trails.ballots.castVote')"
                :disabled="votes.length < ballot.min_options || votes.length > ballot.max_options"
                v-close-popup
                @click="onCastVote({ options: votes, ballotName: ballot.ballot_name })"
              )
    strong(v-else) {{ displayWinner(ballot) }}
</template>

<style lang="sass" scoped>
.link
  text-decoration: none
</style>
