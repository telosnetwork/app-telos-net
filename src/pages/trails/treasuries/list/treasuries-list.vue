<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TreasuryCard from '../components/treasury-card'
import TreasuryForm from '../components/treasury-form'

export default {
  name: 'treasuries-list',
  components: {
    TreasuryCard,
    TreasuryForm
  },
  data () {
    return {
      show: false
    }
  },
  async mounted () {
    this.resetTreasuries()
    await this.fetchFees()
    this.$refs.infiniteScroll.reset()
    this.$refs.infiniteScroll.poll()
    await this.maybeLoadTreasuries()
  },
  methods: {
    ...mapActions('trails', ['fetchTreasuries', 'fetchFees']),
    ...mapMutations('trails', ['resetTreasuries']),
    async onLoad (index, done) {
      await this.maybeLoadTreasuries()
      done()
    },
    async maybeLoadTreasuries () {
      if (!this.treasuriesLoaded) {
        await this.fetchTreasuries()
      } else {
        this.$refs.infiniteScroll.stop()
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated']),
    ...mapGetters('trails', ['treasuries', 'treasuriesLoaded'])
  }
}
</script>

<template lang="pug">
  q-page.q-pa-lg
    treasury-form(:show.sync="show")
    .treasuries(ref="treasuriesRef")
      q-infinite-scroll(
        ref="infiniteScroll"
        @load="onLoad"
        :offset="250"
        :scroll-target="$refs.treasuriesRef"
      )
        .row.q-col-gutter-md
          .col-xs-12.col-sm-6(v-for="treasury in treasuries")
            treasury-card(:treasury="treasury")
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
