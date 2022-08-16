<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

const IPFS = require('ipfs-core')

export default {
  name: 'ballot-form',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      form: {
        title: null,
        category: 'poll',
        description: null,
        imageUrl: null,
        IPFSString: null,
        treasurySymbol: null,
        votingMethod: '1token1vote',
        maxOptions: 1,
        minOptions: 1,
        initialOptions: [],
        endDate: null,
        config: 'votestake'
      },
      prompt: false,
      userBalance: null,
      votingMethodOptions: [
        { value: '1acct1vote', label: 'One vote per account' },
        { value: '1tokennvote', label: 'All tokens to each vote' },
        { value: '1token1vote', label: 'All tokens split to each vote' },
        { value: '1tsquare1v', label: 'One token equals one square vote' },
        { value: 'quadratic', label: 'Quadratic' }
      ],
      categoryOptions: [
        { value: 'election', label: 'Election' },
        { value: 'leaderboard', label: 'Leaderboard' },
        { value: 'poll', label: 'Poll' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'referendum', label: 'Referendum' }
      ],
      submitting: false,
      file: null,
      cid: null,
      fee: null
    }
  },
  computed: {
    ...mapGetters('trails', ['treasuries', 'userTreasury', 'ballotFees']),
    ...mapGetters('accounts', ['account']),
    getTreasurySymbols () {
      if (this.userTreasury) {
        const symbols = this.userTreasury.map(treasury => ({
          symbol: treasury.delegated.replace(/[^a-zA-Z]/gi, '')
        }))
        return this.treasuries.filter((v) => {
          return symbols.some(v2 => { return v.symbol === v2.symbol })
        }).map(treasury => ({
          label: treasury.title ? `${treasury.title} (${treasury.supply})` : treasury.supply,
          value: treasury.supply,
          symbol: treasury.supply.replace(/[^a-zA-Z]/gi, '')
        }))
      } else {
        return null
      }
    },
    isStakeable () {
      let selectedTreasurySettings = this.treasuries.find(t => (t.access === 'public' || t.manager === this.account) && t.symbol === this.form.treasurySymbol?.symbol)?.settings
      return selectedTreasurySettings ? selectedTreasurySettings.find(i => i.key === 'stakeable').value : null
    },
    configEnable () {
      return this.form.treasurySymbol?.symbol !== 'VOTE' && this.isStakeable
    },
    available () {
      if (this.userBalance) {
        const ballotFee = this.onlyNumbers(this.ballotFees.value)
        return this.userBalance >= ballotFee
      } else {
        return null
      }
    }
  },
  methods: {
    ...mapActions('trails', ['addBallot', 'fetchTreasuriesForUser', 'fetchFees']),
    async onAddBallot () {
      this.submitting = true
      const success = await this.addBallot(this.createBallotObject())
      this.submitting = false
      if (success) {
        this.$emit('update:show', false)
        this.resetBallot()
      }
    },
    async openConfirmation () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.prompt = true
    },
    resetBallot () {
      this.form = {
        title: null,
        category: null,
        description: null,
        imageUrl: null,
        treasurySymbol: null,
        votingMethod: '1token1vote',
        initialOptions: [],
        endDate: null,
        IPFSString: null
      }
      this.file = null
      this.cid = null
    },
    onCansel () {
      this.$emit('update:show', false)
      this.resetBallot()
    },
    addBallotOption (val, done) {
      done(val.toLowerCase(), 'add-unique')
    },
    createBallotObject () {
      return {
        title: this.form.title,
        category: this.form.category,
        description: (this.form.IPFSString && this.form.IPFSString.trim() !== '') ? `${this.form.description} ${this.form.IPFSString}` : this.form.description,
        content: this.form.imageUrl ? `{\"imageUrl\":\"${this.form.imageUrl}\"}` : '',
        treasurySymbol: this.form.treasurySymbol,
        votingMethod: this.form.votingMethod,
        maxOptions: this.form.maxOptions,
        minOptions: this.form.minOptions,
        initialOptions: this.form.initialOptions,
        endDate: this.form.endDate,
        config: this.form.config,
        settings: this.isStakeable
      }
    },
    async convertToIFPS (file) {
      const ipfs = await IPFS.create()
      this.cid = await ipfs.add(file)
    }
  },
  watch: {
    file: function () {
      this.convertToIFPS(this.file)
    },
    account: async function (account) {
      this.fetchTreasuriesForUser(account)
      const getAccount = await this.$store.$api.getAccount(this.account)
      this.userBalance = this.onlyNumbers(getAccount.core_liquid_balance)
      this.fee = this.ballotFees.value
    },
    cid: function () {
      this.form.IPFSString = this.cid.path
    }
  },
  mounted () {
    this.fetchFees()
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  persistent
)
  q-card(
    flat
    bordered
    style="width: 400px; max-width: 80vw;"
  )

    q-card-section.bg-primary.text-white
      .text-h6 Create a ballot
    q-card-section
      q-input(
        ref="title"
        v-model="form.title"
        label="Title"
        :rules="[rules.required]"
      )
      q-select(
        ref="category"
        v-model="form.category"
        label="Category"
        :options="categoryOptions"
        emit-value
        map-options
        :rules="[rules.required]"
      )
      q-select(
        ref="votingMethod"
        v-model="form.votingMethod"
        label="Voting method"
        :options="votingMethodOptions"
        emit-value
        map-options
        :rules="[rules.required]"
      )
      q-input(
        ref="description"
        v-model="form.description"
        label="Description"
        type="textarea"
        :rules="[rules.required]"
      )
      q-input(
        class="q-mb-md"
        ref="img"
        v-model="form.imageUrl"
        label="Image URL"
        placeholder="https://..."
        hint="Upload an image and paste the url here to include it in your ballot."
        :rules="[rules.required]"
      )
      q-file(v-model="file" label="Upload PDF")
        template(v-slot:prepend)
          q-icon(name="attach_file")
      q-select(
        ref="treasurySymbol"
        v-model="form.treasurySymbol"
        label="Treasury"
        :options="getTreasurySymbols"
        :rules="[rules.required]"
      )
      q-select(
        ref="initialOptions"
        v-model="form.initialOptions"
        label="Options"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        @new-value="addBallotOption"
        :rules="[rules.required, rules.minimumOptions(2)]"
      )
      .row
        q-input.col-6(
          type="number"
          ref="minOptions"
          v-model="form.minOptions"
          label="Min options"
          :rules="[rules.required, rules.integer, rules.positiveInteger]"
        )
        q-input.col-6(
          type="number"
          ref="maxOptions"
          v-model="form.maxOptions"
          label="Max options"
          :rules="[rules.required, rules.integer, rules.positiveInteger, rules.greaterOrEqualThan(form.minOptions), rules.greaterOrEqualThan(2)]"
        )
      .row(
        v-if="configEnable"
      )
        q-radio(
          v-model="form.config"
          label="Stakeble"
          val="votestake"
        )
        q-radio(
          v-model="form.config"
          label="Liquid"
          val="voteliquid"
        )
        q-radio(
         v-model="form.config"
         label="Both"
         val="both"
        )
      q-input(
        ref="endDate"
        v-model="form.endDate"
        label="End date"
        :rules="[rules.required, rules.dateFuture(Date.now())]"
      )
        template(v-slot:append)
          q-icon.cursor-pointer(name="event")
            q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
              q-date(
                v-model="form.endDate"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY-MM-DD HH:mm"
              )
          q-icon.cursor-pointer(name="access_time")
            q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
              q-time(
                v-model="form.endDate"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY-MM-DD HH:mm"
              )
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="onCansel()"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="openConfirmation()"
      )
    q-dialog(
      v-model="prompt"
      persistent
    )
      q-card(
        style="min-width: 350px"
      )
        q-card-section.row.items-center
          span.q-ml-sm(
            v-if="available"
          ) There will be a {{fee}} fee for creating a ballot.
          span.q-ml-sm(
            v-else
          ) {{ "Insufficient balance to create a ballot." }}
        q-card-actions.text-primary(
          align="right"
        )
          q-btn(
            flat
            label="Cancel"
            v-close-popup
          )
          q-btn(
            v-if="available"
            flat
            label="Accept"
            v-close-popup
            @click="onAddBallot()"
          )
</template>
<style scoped>

</style>
