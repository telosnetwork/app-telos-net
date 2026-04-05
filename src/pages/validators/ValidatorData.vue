<template lang='pug'>
div
  q-btn.toggle(@click='toggleView' :label='toggleLabel' color='primary')
  q-btn.toggle( v-if='account' @click='castVote' :disable='!voteChanged' label='Vote' color='primary')
  q-btn.toggle( v-if='account' @click='resetVote' :disable='!voteChanged' label='Reset' color='primary')
  ValidatorDataChart(v-if='showCpu')
  ValidatorDataTable( v-else
    ref="ValidatorDataTable"
    :producerData='producerData'
    :producerVotes='producerVotes'
    :lastWeight='lastWeight'
    :lastStaked='lastStaked'
    :stakedAmount='stakedAmount'
    :lastUpdated='lastUpdated'
    @vote-changed='toggleVoteButtons'
    @get-votes='getVotes'
  )
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import ValidatorDataChart from './components/ValidatorDataChart.vue'
import ValidatorDataTable from './components/ValidatorDataTable.vue'

const BUCKET_URL = 'https://telos-producer-validation.s3.amazonaws.com'

export default {
  name: 'Validator',
  components: {
    ValidatorDataChart,
    ValidatorDataTable
  },
  data () {
    return {
      lastUpdated: '',
      producerData: [],
      producerVotes: [],
      showCpu: false,
      voteChanged: false,
      resetFlag: false,
      lastWeight: '0',
      lastStaked: 0,
      stakedAmount: 0

    }
  },
  async mounted () {
    await this.getData()
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    toggleLabel () {
      return this.showCpu ? 'View Table' : 'View Graph'
    }
  },
  methods: {
    async getData () {
      try {
        const objectList = await axios.get(BUCKET_URL)
        const lastKey = this.getLastKey(objectList)
        if (!lastKey) {
          console.warn('No validator data found in S3 bucket')
          return
        }
        this.producerData = (await axios.get(`${BUCKET_URL}/${lastKey}`)).data
        await this.getVotes()
      } catch (err) {
        console.error('Failed to load validator data:', err)
      }
    },
    getLastKey (objectList) {
      const parser = new DOMParser()
      const contentsArray = parser.parseFromString(objectList.data, 'text/xml').getElementsByTagName('Contents')
      if (!contentsArray || contentsArray.length === 0) {
        return null
      }
      const lastEntry = contentsArray[contentsArray.length - 1]
      if (!lastEntry || !lastEntry.childNodes || lastEntry.childNodes.length < 2) {
        return null
      }
      this.lastUpdated = lastEntry.childNodes[1].textContent
      return lastEntry.childNodes[0].textContent
    },
    async getVotes () {
      if (this.account) {
        const accountData = await this.$store.$api.getAccount(this.account)
        const voterInfo = accountData && accountData.voter_info
        if (!voterInfo) {
          this.producerVotes = []
          this.lastWeight = '0'
          this.lastStaked = 0
          this.stakedAmount = 0
          return
        }
        this.producerVotes = voterInfo.producers || []
        this.lastWeight = parseFloat(voterInfo.last_vote_weight || 0).toFixed(2)
        this.lastStaked = voterInfo.last_stake || 0
        this.stakedAmount = voterInfo.staked || 0
      }
    },
    toggleView () {
      this.showCpu = !this.showCpu
    },
    castVote (e) {
      if (this.$refs.ValidatorDataTable) {
        this.$refs.ValidatorDataTable.sendVoteTransaction()
      }
    },
    resetVote (e) {
      if (this.$refs.ValidatorDataTable) {
        this.$refs.ValidatorDataTable.resetVotes()
      }
    },
    toggleVoteButtons (val) {
      this.voteChanged = val
    }
  }
}
</script>
<style lang='sass'>
.toggle
  margin-top: 0.75rem
  margin-left: 1rem
</style>
