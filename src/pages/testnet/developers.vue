<script>
import { mapActions } from 'vuex'

export default {
  name: 'page-developers',
  data () {
    return {
      form: {
        send_to: null,
        account_name: null,
        owner_key: null,
        active_key: null
      },
      transactionId: null,
      submitting: false
    }
  },
  methods: {
    ...mapActions('testnet', ['faucet', 'account']),
    async onFaucet () {
      this.submitting = true
      const result = await this.faucet(this.form.send_to)
      if (result) {
        this.transactionId = result.transactionId
        console.log(result)
      }
      this.submitting = false
    },
    async onAccount () {
      this.submitting = true
      const result = await this.account(this.form)
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
        ref="account_name"
        v-model="form.account_name"
        color="accent"
        label="Account name"
        outlined
        maxlength="12"
      )
      q-input.q-mb-lg(
        ref="owner_key"
        v-model="form.owner_key"
        color="accent"
        label="Owner key"
        outlined
      )
      q-input.q-mb-lg(
        ref="active_key"
        v-model="form.active_key"
        color="accent"
        label="Active key"
        outlined
      )
      q-btn.full-width(
        color="primary"
        label="Create testnet account"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onAccount"
      )

    q-card-section
      q-input.q-mb-lg(
        ref="send_to"
        v-model="form.send_to"
        color="accent"
        label="Send to"
        outlined
        maxlength="12"
      )
      q-btn.full-width(
        color="primary"
        label="Send testnet TLOS"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onFaucet"
      )

    q-card-section(v-if="transactionId")
      a(
        :href="`https://telos-test.bloks.io/transaction/${transactionId}`"
        target="_blank"
      ) Trx explorer
</template>
