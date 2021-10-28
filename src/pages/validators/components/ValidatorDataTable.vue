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
      q-tr( slot="body" slot-scope="props" :props="props")
        q-td( key="number") {{props.cols[0].value}}
        q-td( key="owner" ) {{props.cols[1].value }}
        q-td(v-if='props.cols[2].value' key="social").no-decoration
          a(v-if="props.cols[2].value.website" :href="props.cols[2].value.website")
            q-icon(
              name="fas fa-globe"
              size="xs"
              color='primary'
            )
          a(v-if="props.cols[2].value.social.twitter" :href="getLink('twitter.com',props.cols[2].value.social.twitter)")
            q-icon(
              name="fab fa-twitter"
              size="xs"
              color='primary'
            )
          a(v-if="props.cols[2].value.social.github" :href="getLink('github.com',props.cols[2].value.social.github)")
            q-icon(
              name="fab fa-github"
              size="xs"
              color='primary'
            )
          a(v-if="props.cols[2].value.social.telegram" :href="getLink('t.me',props.cols[2].value.social.telegram)")
            q-icon(
              name="fab fa-telegram"
              size="xs"
              color='primary'
            )
        q-td(v-else key="social")
        q-td( key="votes" align="center") {{props.cols[3].value }}
        q-td( key="sslVerified" align='left')
          q-icon(
            v-if="props.cols[4].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="apiVerified" align='left')
          q-icon(
            v-if="props.cols[5].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="sslVerifiedTestNet" align='left')
          q-icon(
            v-if="props.cols[6].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
          )
        q-td( key="apiVerifiedTestNet" align='left')
          q-icon(
            v-if="props.cols[7].value === true"
            name="fas fa-check"
            size="xs"
            color='green'
          )
          q-icon(
            v-else
            name="fas fa-times"
            size="xs"
            color='red'
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
          field: row => this.producerData.indexOf(row) + 1,
          align: 'left',
          sortable: true
        },
        {
          name: 'owner',
          label: 'Block Producer',
          field: 'owner',
          align: 'left',
          sortable: true
        },
        {
          name: 'social',
          label: 'Links',
          field: row => row.org,
          align: 'left'
        },
        {
          name: 'votes',
          label: 'Total Votes',
          field: row => (row.total_votes / 1000000000).toFixed(1) + 'B',
          align: 'center',
          sortable: true
        },
        {
          name: 'sslVerified',
          label: 'SSL',
          field: row => row.sslVerified === true,
          align: 'left',
          sortable: true
        },
        {
          name: 'apiVerified',
          label: 'API',
          field: row => row.apiVerified === true,
          align: 'left',
          sortable: true
        },
        {
          name: 'sslVerifiedTestNet',
          label: 'SSL*',
          field: row => row.sslVerifiedTestNet === true,
          align: 'left',
          sortable: true
        },
        {
          name: 'apiVerifiedTestNet',
          label: 'API*',
          field: row => row.apiVerifiedTestNet === true,
          align: 'left',
          sortable: true
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
    },
    getLink (domain, username) {
      return `https://${domain}.com/${username}`
    }
  }
}
</script>
<style lang="scss" scoped>
.no-decoration{
  a:-webkit-any-link {
    text-decoration: none;
  }
}
.hidden{
  display: none;
}
</style>
