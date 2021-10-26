<template>
    <cpu-charts></cpu-charts>
</template>

<script>
import axios from 'axios'
// import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3'
import CpuCharts from './components/cpu-charts.vue'
// import { getProducer } from '@telosnetwork/validator-checks/dist/client'
// const creds = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// }
// const s3Client = new S3Client({ region: 'us-east-1' })
// const bucket = 'telos-producer-validation'
// const headers = {
//   'Content-Type': 'application/json'
// }

export default {
  name: 'validators',
  components: {
    CpuCharts
  },
  async mounted () {
    // eslint-disable-next-line semi
    debugger;
    await this.getObjects()
  },
  methods: {
    async getObjects () {
      try {
        const objectList = await axios.get(`https://telos-producer-validation.s3.amazonaws.com/test-data-1635219133373`)
        // const objectList = await axios.get('https://api.github.com/users/mapbox')

        // const objectList = await s3Client.send(new ListObjectsCommand(bucketParam))
        // // await s3Client.send(new ListObjectsCommand(bucketParam))

        // // eslint-disable-next-line semi
        // debugger;
        console.dir(objectList.data)
      } catch (err) {
        // eslint-disable-next-line semi
        debugger;
        console.log('Error', err)
      }
    }
  }
}
</script>
