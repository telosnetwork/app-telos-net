<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ballots-list',
  mounted () {
    this.resetBallots()
  },
  methods: {
    ...mapActions('trails', ['fetchBallots']),
    ...mapMutations('trails', ['resetBallots']),
    async onLoad (index, done) {
      await this.fetchBallots()
      done()
    }
  },
  computed: {
    ...mapGetters('trails', ['ballots', 'ballotsLoaded'])
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
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
            q-item-label(overline) {{ ballot.ballot_name }}
            q-item-label {{ ballot.title || "Default title" }}
            q-item-label(caption)
              | {{ $t('pages.trails.ballots.starts') }}: {{ ballot.begin_time }}
              br
              | {{ $t('pages.trails.ballots.ends') }}: {{ ballot.end_time }}
          q-item-section(side)
            q-btn(
              :label="$t('pages.trails.ballots.castVote')"
              color="primary"
              :disable="ballot.status === 'cancelled'"
            )
              q-menu
                q-list
                  q-item(
                    v-for="option in ballot.options"
                    :key="option.key"
                    clickable
                    v-close-popup
                  )
                    q-item-section {{ option.key }}
      template(v-slot:loading)
        .row.justify-center.q-my-md
          q-spinner-dots(
            color="primary"
            size="40px"
          )
</template>
<style lang="sass" scoped>
.link
  text-decoration: none
</style>
