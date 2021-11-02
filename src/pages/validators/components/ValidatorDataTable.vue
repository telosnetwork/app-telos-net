<template lang='pug'>
.q-pa-md
  .validator-count(v-if='account') Selected Validators:
    span( :class="{'full-selection' : maxSelected }") {{ currentVote.length }} of 30
  .q-pa-md.row.items-start.q-gutter-md(v-if='account')
    q-card( v-for='(prod,i) in currentVote').producer-card
      .q-card-section {{ prod }}
          q-icon(
            name="fas fa-times"
            size="xs"
            color='primary'
            @click='removeVote(prod)'
          )
  q-table(
    title="Validators"
    :pagination.sync="pagination"
    :data="producerData"
    :columns="producerColumns"
    row-key="__index"
  )
    template( v-slot:top-right class='testnet-indicator') *test net
    q-tr( slot="body" slot-scope="props" :props="props")
      q-td( key="selected")
        q-checkbox( v-if='account' v-model='currentVote' :val='props.cols[2].value' )
      q-td( key="number" class='vote-indicator') {{props.cols[1].value}}
      q-td( key="owner" ) {{props.cols[2].value }}
      q-td( key="country" )
        span(:class='getFlag(props.cols[3].value)').flag-icon
      q-td(v-if='props.cols[4].value' key="social" align="center").no-decoration
        a(v-if="props.cols[4].value.website" :href="props.cols[4].value.website")
          q-icon(
            name="fas fa-globe"
            size="xs"
            color='primary'
          )
        a(v-if="props.cols[4].value.social.twitter" :href="getLink('twitter.com',props.cols[4].value.social.twitter)")
          q-icon(
            name="fab fa-twitter"
            size="xs"
            color='primary'
          )
        a(v-if="props.cols[4].value.social.github" :href="getLink('github.com',props.cols[4].value.social.github)")
          q-icon(
            name="fab fa-github"
            size="xs"
            color='primary'
          )
        a(v-if="props.cols[4].value.social.telegram" :href="getLink('t.me',props.cols[4].value.social.telegram)")
          q-icon(
            name="fab fa-telegram"
            size="xs"
            color='primary'
          )
      q-td(v-else key="social-none")
      q-td( key="votes" align="right") {{props.cols[5].value }}
      q-td( key="sslVerified" align='left')
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
      q-td( key="apiVerified" align='left')
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
      q-td( key="sslVerifiedTestNet" align='left')
        q-icon(
          v-if="props.cols[8].value === true"
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
          v-if="props.cols[9].value === true"
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
      q-td( key="lifetimeProducedBlocks" align='right' ) {{props.cols[10].value }}
      q-td( key="lifetimeMissedBlocks" align='right') {{props.cols[11].value }}
      q-td( key='missedBlocksPer' align='left') {{props.cols[12].value }} %
</template>

<script>
import { mapGetters } from 'vuex'
import * as iso from 'iso-3166-1'

export default {
  name: 'ValidatorDataTable',
  props: {
    producerVotes: { type: Array, required: true },
    producerData: { type: Array, required: true }
  },
  data () {
    return {
      currentVote: [],
      pagination: {
        rowsPerPage: 21
      },
      producerColumns: [
        {
          name: 'selected',
          label: ' ',
          align: 'left',
          sortable: false,
          style: 'width: 1rem'
        },
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
          name: 'country',
          label: 'Country',
          field: row => this.getCountry(row.location),
          align: 'center',
          sortable: true
        },
        {
          name: 'social',
          label: 'Links',
          field: row => row.org,
          align: 'center'
        },
        {
          name: 'votes',
          label: 'Total Votes',
          field: row => (row.total_votes / 10000).toFixed(0),
          align: 'right',
          sortable: true,
          sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10)
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
        },
        {
          name: 'lifetimeProducedBlocks',
          label: 'LPB',
          field: 'lifetime_produced_blocks',
          align: 'center',
          sortable: true,
          sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'lifetimeMissedBlocks',
          label: 'LMB',
          field: 'lifetime_missed_blocks',
          align: 'center',
          sortable: true,
          sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'missedBlocksPer',
          label: 'LMB(%)',
          field: row => (parseFloat(row.lifetime_missed_blocks / row.lifetime_produced_blocks) * 100).toFixed(5),
          align: 'left',
          sortable: true,
          sort: (a, b, rowA, rowB) => parseFloat(a, 10) - parseFloat(b, 10)
        }
      ]
    }
  },
  mounted () {
    this.resetVotes()
  },
  watch: {
    producerVotes (val) {
      this.$emit('vote-changed', false)
      if (this.currentVote.length === 0) {
        this.currentVote = [...val]
      }
    },
    currentVote (val) {
      if (val.length > 30) {
        this.currentVote.pop()
        alert('You can only vote for 30 validators.')
        return
      }
      if (this.areEqualArrays(val, this.producerVotes)) {
        this.$emit('vote-changed', false)
      } else {
        this.$emit('vote-changed', true)
      }
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    maxSelected () {
      return this.currentVote.length === 30
    }
  },
  methods: {
    removeVote (index) {
      this.currentVote.splice(index, 1)
    },
    getLink (domain, username) {
      return `https://${domain}/${username}`
    },
    getCountry (numeric) {
      const countryObj = iso.whereNumeric(numeric) ?? { alpha2: '' }
      return (countryObj.alpha2).toLowerCase()
    },
    getFlag (alpha2) {
      if (alpha2) {
        return `flag-icon-${alpha2}`
      }
      return ''
    },
    areEqualArrays (firstArray, secondArray) {
      if (!Array.isArray(firstArray) || !Array.isArray(secondArray) || firstArray.length !== secondArray.length) {
        return false
      }
      var tempFirstArray = firstArray.concat().sort()
      var tempSecondArray = secondArray.concat().sort()
      for (var i = 0; i < tempFirstArray.length; i++) {
        if (tempFirstArray[i] !== tempSecondArray[i]) {
          return false
        }
      }
      return true
    },
    resetVotes () {
      this.currentVote = [...this.producerVotes]
    },
    async sendVoteTransaction () {
      const voteActions = [{
        account: 'eosio',
        name: 'voteproducer',
        data: {
          voter: this.account,
          proxy: '',
          producers: [...this.currentVote]
        }
      }]
      try {
        await this.$store.$api.signTransaction(voteActions)
        this.$emit('get-votes')
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style lang='sass' scoped>
@import url('../../../../node_modules/flag-icon-css/sass/flag-icons.scss')
.testnet-indicator
  margin-right: .5rem;
.producer-card
  padding: .2rem .2rem .2rem .5rem;
  height: 2rem;
  line-height: 1.6rem;
  i
    cursor: pointer;
    padding-bottom: .4rem;
    padding-left: .2rem;
.validator-count
  margin-left: 1rem;
  span
    margin-left: .25rem;
    &.full-selection
      margin-left: .25rem;
      font-weight: 600;
</style>
