<template lang='pug'>
  div
    q-btn.toggle(@click='toggleView' :label='toggleLabel' color='primary')
    ValidatorDataChart(v-if='showCpu')
    ValidatorDataTable(v-else)
</template>

<script>
import ValidatorDataChart from './components/ValidatorDataChart.vue'
import ValidatorDataTable from './components/ValidatorDataTable.vue'

export default {
  name: 'Validator',
  components: {
    ValidatorDataChart,
    ValidatorDataTable
  },
  data () {
    return {
      showCpu: false
    }
  },
  computed: {
    toggleLabel () {
      return this.showCpu ? 'View Table' : 'View Graph'
    }
  },
  methods: {
    toggleView () {
      this.showCpu = !this.showCpu
    }
  }
}
</script>
<style lang='sass'>
.toggle
  margin-top: 0.75rem
  margin-left: 1rem
</style>
