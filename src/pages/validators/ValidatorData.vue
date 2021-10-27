<template lang='pug'>
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
  }
}
</script>
