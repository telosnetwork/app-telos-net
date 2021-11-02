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
      voterInfo: {},
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
        this.producerData = (await axios.get(`${BUCKET_URL}/${lastKey}`)).data
        await this.getVotes()
      } catch (err) {
        console.log('Error', err)
      }
    },
    getLastKey (objectList) {
      const parser = new DOMParser()
      const keyArray = parser.parseFromString(objectList.data, 'text/xml').getElementsByTagName('Key')
      return keyArray[keyArray.length - 1].textContent
    },
    async getVotes () {
      if (this.account) {
        this.voterInfo = (await this.$store.$api.getAccount(this.account)).voter_info
        this.producerVotes = this.voterInfo.producers
        this.lastWeight = parseFloat(this.voterInfo.last_vote_weight).toFixed(2)
        this.lastStaked = this.voterInfo.last_stake
        this.stakedAmount = this.voterInfo.staked
      }
    },
    toggleView () {
      this.showCpu = !this.showCpu
    },
    castVote (e) {
      this.$refs.ValidatorDataTable.sendVoteTransaction()
    },
    resetVote (e) {
      this.$refs.ValidatorDataTable.resetVotes()
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
