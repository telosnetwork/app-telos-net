<script>
import { mapActions, mapMutations } from 'vuex'
import { DeepError } from '@smontero/ppp-client-api'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-send-tokens',
  mixins: [validation],
  data () {
    return {
      form: {
        to: null,
        quantity: null,
        memo: null
      },
      transactionId: null,
      submitting: false
    }
  },
  methods: {
    ...mapActions('transfers', ['sendTokens']),
    ...mapMutations('general', ['setErrorMsg']),
    async onSendTokens () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      try {
        const result = await this.sendTokens(this.form)
        if (result) {
          this.transactionId = result.transactionId
          console.log(result)
        }
      } catch (e) {
        const error = new DeepError(e)
        this.setErrorMsg(error.message)
      }
      this.submitting = false
    },
    openUrl (url) {
      window.open(`${process.env.BLOCKCHAIN_EXPLORER}${url}`)
    }
  }
}
</script>

<template lang="pug">
q-page.flex.flex-center
  q-card
    q-card-section
      q-input.q-mb-lg(
        ref="to"
        v-model="form.to"
        color="accent"
        label="To"
        outlined
        maxlength="12"
        :rules="[rules.required, rules.accountFormat, rules.accountLength, rules.accountExists]"
        lazy-rules
        :debounce="200"
        @blur="form.to = (form.to || '').toLowerCase()"
      )
      q-input.q-mb-lg(
        ref="quantity"
        v-model="form.quantity"
        color="accent"
        label="Amount"
        outlined
        :rules="[rules.required]"
        lazy-rules
      )
      q-input.q-mb-lg(
        ref="memo"
        v-model="form.memo"
        color="accent"
        label="Memo"
        outlined
      )
      q-btn.full-width(
        color="primary"
        label="Send"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onSendTokens"
      )
    q-card-section(v-if="transactionId")
      q-btn(
        label="Transaction"
        color="primary"
        icon="fas fa-external-link-alt"
        @click="openUrl(`/transaction/${transactionId}`)"
        target="_blank"
        dense
        flat
        size="8px"
      )

</template>
