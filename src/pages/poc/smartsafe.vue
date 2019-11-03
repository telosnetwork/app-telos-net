<script>
import { mapActions } from 'vuex'

export default {
  name: 'smartsafe',
  data () {
    return {
      transactionId: null,
      submitting: false
    }
  },
  methods: {
    ...mapActions('poc', ['lock', 'unlock']),
    async onLock () {
      this.submitting = true
      const result = await this.lock()
      if (result) {
        this.transactionId = result.transactionId
        console.log(result)
      }
      this.submitting = false
    },
    async onUnlock () {
      this.submitting = true
      const result = await this.unlock()
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
      q-btn.full-width(
        color="primary"
        label="Lock"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onLock"
      )
      q-btn.full-width(
        color="primary"
        label="Unlock"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onUnlock"
      )
    q-card-section(v-if="transactionId")
      a(
        :href="`https://telos-test.bloks.io/transaction/${transactionId}`"
        target="_blank"
      ) Trx explorer
</template>
