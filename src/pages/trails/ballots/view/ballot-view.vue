<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ballot-view',
  data () {
    return {
      loading: true,
      voting: false
    }
  },
  async mounted () {
    await this.fetchBallot(this.$route.params.id)
    this.loading = false
  },
  computed: {
    ...mapGetters('trails', ['ballot'])
  },
  methods: {
    ...mapActions('trails', ['fetchBallot', 'castVote']),
    async onCastVote (option) {
      this.voting = true
      await this.castVote({
        ballotName: this.$route.params.id,
        options: [option]
      })
      this.voting = false
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
      q-card-actions(align="right")
        q-btn(
          v-for="option in ballot.options"
          :key="option.key"
          :label="option.key"
          color="primary"
          @click="onCastVote(option.key)"
          :loading="voting"
        )
    q-inner-loading(
      v-else
    )
      q-spinner(size="3em")
</template>

<style lang="sass">
.ballot-status
  right: 0
  top: 0
</style>
