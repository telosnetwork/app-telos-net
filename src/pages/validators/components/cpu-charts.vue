<template>
    <highcharts :options="chartOptions" :updateArgs="[true, false]"  ref="highcharts"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CpuCharts',
  data () {
    return {
      chartOptions: {
        title: {
          text: 'Validator CPU Performance'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'microseconds'
          }
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      },
      benchmarkDays: 1
    }
  },
  components: {
    highcharts: Chart
  },
  computed: {
    ...mapState('validators', ['benchmarks'])
  },
  async mounted () {
    this.loadBenchmarks({ days: this.benchmarkDays })
  },
  watch: {
    benchmarks () {
      this.$refs.highcharts.chart.series = []
      for (let i = 0; i < this.benchmarks.length; i++) {
        let benchmark = this.benchmarks[i]
        this.$refs.highcharts.chart.addSeries(benchmark, i === (this.benchmarks.length - 1))
      }
    }
  },
  methods: {
    ...mapActions('validators', ['loadBenchmarks'])
  }
}
</script>
