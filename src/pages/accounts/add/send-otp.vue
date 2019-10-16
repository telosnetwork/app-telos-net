<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-send-otp',
  mixins: [validation],
  data () {
    return {
      form: {
        account: null,
        smsNumber: null
      },
      error: null,
      submitting: false
    }
  },
  methods: {
    ...mapActions('accounts', ['sendOTP']),
    async onSendOTP () {
      this.resetValidation(this.form)
      this.error = null
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const result = await this.sendOTP(this.form)
      if (!result.error) {
        this.$router.push({ path: '/accounts/add/verifyOTP' })
      } else {
        this.error = result.error
      }
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
  .flex.column.send-otp
    .col-9
      q-card.q-mb-lg(flat)
        q-card-section
          h2 {{ $t('pages.accounts.add.createAccountTitle') }}
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
          q-input(
            ref="smsNumber"
            v-model="form.smsNumber"
            color="accent"
            :label="$t('pages.accounts.add.forms.smsNumber')"
            outlined
            :rules="[rules.required]"
            lazy-rules
          )
          .text-red(v-if="error") {{ error }}
    .col-3
      .hint {{ $t('pages.accounts.add.createAccountHint') }}
      q-btn.full-width(
        color="primary"
        :label="$t('pages.accounts.add.buttons.verify')"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onSendOTP"
      )
</template>

<style lang="sass" scoped>
.send-otp
  width: 100%
  max-width: 500px
  margin: 0 auto
  h2
    color: $primary
    font-size: 24px
    text-align: center
    font-weight: 600
  .q-btn-item
    /deep/div
      font-size: 12px
  .hint
    color: #707070
    font-size: 12px
    margin: 30px 0 10px 0
</style>
