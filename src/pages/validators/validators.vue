<template>
    <cpu-charts></cpu-charts>
</template>

<script>
import axios from 'axios'
import CpuCharts from './components/cpu-charts.vue'
// import { getProducer } from '@telosnetwork/validator-checks/dist/client'

const BUCKET_URL = 'https://telos-producer-validation.s3.amazonaws.com'

export default {
  name: 'validators',
  components: {
    CpuCharts
  },
  data () {
    return {
      producerData: []
    }
  },
  async mounted () {
    await this.getData()
  },
  methods: {
    async getData () {
      try {
        const objectList = await axios.get(BUCKET_URL)
        const lastKey = this.getLastKey(objectList)
        this.producerData = (await axios.get(`${BUCKET_URL}/${lastKey}`)).data
      } catch (err) {
        console.log('Error', err)
      }
    },
    getLastKey (objectList) {
      const parser = new DOMParser()
      const keyArray = parser.parseFromString(objectList.data, 'text/xml').getElementsByTagName('Key')
      return keyArray[keyArray.length - 1].textContent
    }
  }
}
</script>
