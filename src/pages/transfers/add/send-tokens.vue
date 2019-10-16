<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-send-tokens',
  mixins: [validation],
  data () {
    return {
      form: {
        account: null,
        amount: null
      },
      submitting: false
    }
  },
  methods: {
    ...mapActions('transfers', ['sendTokens']),
    async onSendTokens () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      await this.sendTokens(this.form)
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
        ref="account"
        v-model="form.account"
        color="accent"
        :label="$t('pages.accounts.add.forms.account')"
        outlined
        maxlength="12"
        :rules="[rules.required, rules.accountFormat, rules.accountLength, rules.accountExists]"
        lazy-rules
      )
      q-input.q-mb-lg(
        ref="amount"
        v-model="form.amount"
        color="accent"
        label="Amount"
        outlined
        :rules="[rules.required]"
        lazy-rules
      )
      q-btn.full-width(
        color="primary"
        label="Send"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onSendTokens"
      )
</template>
