<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ballot-view',
  data () {
    return {
      loading: true,
      voting: false,
      votes: []
    }
  },
  async mounted () {
    await this.fetchBallot(this.$route.params.id)
    this.loading = false
  },
  computed: {
    ...mapGetters('trails', ['ballot']),
    getWinner () {
      if (!this.ballot.total_voters) return 'No votes'
      let winnerValue = -1
      let winner
      this.ballot.options.forEach((option, idx) => {
        if (parseFloat(option.value) > winnerValue) {
          winnerValue = parseFloat(option.value)
          winner = idx
        }
      })
      return winner
    }
  },
  methods: {
    ...mapActions('trails', ['fetchBallot', 'castVote']),
    async onCastVote ({ options, option, ballotName }) {
      this.voting = true
      await this.castVote({
        ballotName,
        options: options || [option]
      })
      this.voting = false
      this.votes = []
    },
    isBallotOpened () {
      return new Date(this.ballot.end_time).getTime() > Date.now() && new Date(this.ballot.begin_time).getTime() < Date.now()
    },
    getBallotStatusColor (status) {
      switch (status) {
        case 'cancelled':
          return 'red'
        case 'voting':
          return 'green'
        default:
          return 'white'
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg.row.flex.justify-center
  .col-xs-12.col-md-8
    q-card.full-width(
      v-if="!loading && ballot"
      flat
      bordered
    )
      q-card-section.bg-primary.text-white.relative
        .absolute.ballot-status
          q-chip(
            :color="getBallotStatusColor(ballot.status)"
            text-color="white"
            dense
            size="xs"
          )
            | {{ ballot.status }}
        .text-h6 {{ ballot.title || 'Default title' }}
        .text-subtitle2 {{ ballot.treasury.title }}
        .text-right Opened from {{ new Date(ballot.begin_time).toLocaleDateString() }} to {{ new Date(ballot.end_time).toLocaleDateString() }}
      q-card-section
        .q-pa-lg {{ ballot.description }}
      q-card-section(v-if="ballot.content")
        .q-pa-lg {{ ballot.content }}
      q-card-section.flex.justify-between
        q-chip(
          icon="fas fa-user-check"
          color="white"
          text-color="primary"
          dense
          size="xs"
        )
          | {{ ballot.total_voters }}
      q-card-section
        .text-right.text-italic {{ ballot.publisher }}
      q-separator
      q-card-actions(
        align="right"
        v-if="ballot.status !== 'cancelled' && isBallotOpened()"
      )
        q-btn(
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
      q-card-actions(
        v-else
        align="right"
      )
        span.full-width.text-right(
          v-for="(option, idx) in ballot.options"
          :key="idx"
          :class="{ winner: idx === getWinner}"
        ) {{ option.key }} {{ parseInt(option.value) }} votes
    q-inner-loading(
      v-else
    )
      q-spinner(size="3em")
</template>

<style lang="sass" scoped>
.ballot-status
  right: 0
  top: 0
.winner
  color: green
  font-size: 15px
  font-weight: 600
</style>
