<template lang='pug'>
  .q-pa-md
    q-table(
      title="Block Producer Validation"
      :pagination.sync="pagination"
      :data="producerData"
      :columns="producerColumns"
      row-key="__index"
      @row-click="rowClicked"
    )
</template>

<script>
import axios from 'axios'
// import { getProducer } from '@telosnetwork/validator-checks/dist/client'

const BUCKET_URL = 'https://telos-producer-validation.s3.amazonaws.com'

export default {
  name: 'ValidatorDataTable',
  data () {
    return {
      pagination: {
        rowsPerPage: 50
      },
      producerData: [],
      producerColumns: [
        {
          name: 'number',
          label: '#',
          field: row => this.producerData.indexOf(row) + 1
        },
        {
          name: 'owner',
          label: 'Block Producer',
          field: 'owner'
        },
        {
          name: 'sslVerified',
          label: 'SSL',
          field: row => row.sslVerified === true
        },
        {
          name: 'apiVerified',
          label: 'API',
          field: row => row.apiVerified === true
        },
        {
          name: 'sslVerifiedTestNet',
          label: 'SSL(test net)',
          field: row => row.sslVerifiedTestNet === true
        },
        {
          name: 'apiVerifiedTestNet',
          label: 'API(test net)',
          field: row => row.apiVerifiedTestNet === true
        }
      ]
    }
  },
  async mounted () {
    await this.getData()
  },
  methods: {
    async getData () {
      // eslint-disable-next-line semi
      debugger;
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
    },
    rowClicked (e) {
      console.log(e)
    }
  }
}
</script>
