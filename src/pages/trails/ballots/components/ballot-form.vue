<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

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
        treasurySymbol: null,
        votingMethod: '1token1vote',
        maxOptions: 1,
        minOptions: 1,
        initialOptions: [],
        endDate: null
      },
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
      submitting: false
    }
  },
  computed: {
    ...mapGetters('trails', ['treasuries']),
    ...mapGetters('accounts', ['account']),
    getTreasurySymbols () {
      return this.treasuries
        .filter(t => t.access === 'public' || t.manager === this.account)
        .map(treasury => ({
          label: treasury.title ? `${treasury.title} (${treasury.supply})` : treasury.supply,
          value: treasury.supply
        }))
    }
  },
  methods: {
    ...mapActions('trails', ['addBallot']),
    async onAddBallot () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.addBallot(this.form)
      this.submitting = false
      if (success) {
        this.$emit('update:show', false)
        this.resetBallot()
      }
    },
    resetBallot () {
      this.form = {
        title: null,
        category: null,
        description: null,
        treasurySymbol: null,
        votingMethod: '1token1vote',
        initialOptions: [],
        endDate: null
      }
    },
    addBallotOption (val, done) {
      done(val.toLowerCase(), 'add-unique')
    }
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
        :rules="[rules.required]"
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
          :rules="[rules.required, rules.integer, rules.positiveInteger, rules.greaterOrEqualThan(form.minOptions)]"
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
        @click="$emit('update:show', false)"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="onAddBallot()"
      )
</template>
<style scoped>

</style>
