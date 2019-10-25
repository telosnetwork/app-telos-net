<script>
import { mapActions, mapGetters } from 'vuex'
import TreasuryCard from './components/treasury-card'

export default {
  name: 'treasuries-list',
  components: {
    TreasuryCard
  },
  methods: {
    ...mapActions('trails', ['fetchTreasuries']),
    async onLoad (index, done) {
      await this.fetchTreasuries()
      done()
    }
  },
  computed: {
    ...mapGetters('trails', ['treasuries', 'treasuriesLoaded'])
  }
}
</script>

<template lang="pug">
  q-page.q-pa-lg
    .treasuries(ref="treasuriesRef")
      q-infinite-scroll(
        :disable="treasuriesLoaded"
        @load="onLoad"
        :offset="250"
        :scroll-target="$refs.treasuriesRef"
      )
        .row.q-col-gutter-md
          .col-xs-12.col-sm-6.col-md-4(v-for="treasury in treasuries")
            treasury-card(:treasury="treasury")
</template>
