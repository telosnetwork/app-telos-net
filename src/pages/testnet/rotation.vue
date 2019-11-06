<script>
import { mapActions } from 'vuex'

export default {
  name: 'page-rotation',
  data () {
    return {
      form: {
        producer: null
      },
      transactionId: null,
      submitting: false
    }
  },
  methods: {
    ...mapActions('testnet', ['produce']),
    async onProduce () {
      this.submitting = true
      const result = await this.produce(this.form.producer)
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
        ref="producer"
        v-model="form.producer"
        color="accent"
        label="Producer"
        outlined
        maxlength="12"
      )
      q-btn.full-width(
        color="primary"
        label="Put into schedule"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onProduce"
      )
    q-card-section(v-if="transactionId")
      a(
        :href="`https://telos-test.bloks.io/transaction/${transactionId}`"
        target="_blank"
      ) Trx explorer
</template>
