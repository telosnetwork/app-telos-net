<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'treasury-view',
  async mounted () {
    await this.fetchTreasury()
  },
  computed: {
    ...mapGetters('trails', ['treasury'])
  },
  methods: {
    ...mapActions('trails', ['fetchTreasury'])
  }
}
</script>

<template lang="pug">

</template>

<style lang="stylus">

</style>
