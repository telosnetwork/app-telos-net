<script>
import { mapActions } from 'vuex'
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
    async onSendTokens () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const result = await this.sendTokens(this.form)
      if (result) {
        this.transactionId = result.transactionId
        console.log(result)
      }
      this.submitting = false
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
      a(
        :href="`https://telos-test.bloks.io/transaction/${transactionId}`"
        target="_blank"
      ) Trx explorer
</template>
