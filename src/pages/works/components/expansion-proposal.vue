<template lang="pug">
    q-expansion-item(
        :key="proposal.ballot_name"
        :label="proposal.title"
        :caption="proposal.description"
        group="proposals"
        @before-show="onShow"
    )
      template(v-slot:header)
        q-item-section(avatar)
          q-avatar(:icon="icon" :color="iconColor" text-color="white" font-size=".75em")
        q-item-section
          q-item-label {{ proposal.title }}
          q-item-label(caption) {{ proposal.description }}
        q-item-section Milestone {{ proposal.current_milestone }} of {{ proposal.milestones }}
          div
            q-linear-progress(
            v-if="proposal.status == 'inprogress' || proposal.status == 'passed' || proposal.status == 'failed'"
            :value="yesVotes" color="positive" track-color="negative" rounded
            size="35px"
        )
              div.absolute-full.flex.flex-center
                q-badge(color="white" text-color="primary" :label="`${(yesVotes * 100).toFixed(2)}% YES`")
      q-card()
        q-card-section
          q-item-section
            q-item-label Proposer: {{ proposal.proposer }}
            q-item-label Category: {{ proposal.category }}
          q-item-section.q-pa-md {{ contentText }}
          iframe(v-if="!!contentUrl" :src="contentUrl" width="100%" height="600px")
</template>

<script>
import { mapGetters } from 'vuex'
const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm')
const regexWithIpfs = new RegExp(/\/ipfs\/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm')
const regexWithUrl = new RegExp(/https?\:\/\/.*\/ipfs\/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm')
const IPFS_URL_BASE = 'https://ipfs.telos.miami/ipfs/'

export default {
  props: {
    proposal: Object
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account'])
  },
  data () {
    return {
      icon: null,
      iconColor: null,
      contentUrl: null,
      contentText: null,
      haveVoted: null,
      yesVotes: 0,
      vote: null
    }
  },
  beforeMount () {
    this.setIcon()
    this.setYesVotes()
    this.findContent()
  },
  methods: {
    setYesVotes () {
      const opts = this.proposal.ballotData.options
      const yes = parseFloat(opts[2].value.split(' ')[0])
      const no = parseFloat(opts[1].value.split(' ')[0])
      // const total = parseFloat(this.proposal.ballotData.total_raw_weight.split(' ')[1])
      this.yesVotes = yes / (yes + no)
    },
    findContent () {
      let contentText = this.proposal.content
      let contentUrl

      if (contentText.match(regex)) {
        contentUrl = IPFS_URL_BASE + regex.exec(contentText)[0]
        contentText = contentText.replace(regexWithUrl, '').replace(regexWithIpfs, '').replace(regex, '')
      }

      this.contentText = contentText
      if (contentUrl) {
        this.contentUrl = contentUrl
      }
    },
    setIcon () {
      switch (this.proposal.category) {
        case 'marketing':
          this.icon = 'campaign'
          this.iconColor = 'positive'
          break
        case 'apps':
          this.icon = 'web'
          this.iconColor = 'primary'
          break
        case 'developers':
          this.icon = 'code'
          this.iconColor = 'accent'
          break
        case 'education':
          this.icon = 'school'
          this.iconColor = 'negative'
          break
      }
    },
    async onShow () {
      if (!this.isAuthenticated) {
        return
      }

      const result = await this.$api.getTableRows({
        code: 'telos.decide',
        scope: this.proposal.proposal_name,
        table: 'votes',
        lower_bound: this.account,
        upper_bound: this.account
      })

      if (result.rows) {
        this.haveVoted = true
        this.vote = result.rows[0]
      }
    }
  }
}
</script>
