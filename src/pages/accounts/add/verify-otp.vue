<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'
import { utils } from '~/mixins/utils'
import { generateKeys } from '~/utils/eosio'

export default {
  name: 'page-verify-otp',
  mixins: [validation, utils],
  data () {
    return {
      form: {
        password: null,
        publicKey: null,
        privateKey: null
      },
      copy: {
        publicKey: false,
        privateKey: false
      },
      generating: false,
      submitting: false
    }
  },
  methods: {
    ...mapActions('accounts', ['verifyOTP']),
    async onVerifyOTP () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const result = await this.verifyOTP(this.form)
      if (result) {
        this.$router.push({ path: '/accounts/add/congratulations' })
      }
      this.submitting = false
    }
  },
  async mounted () {
    this.generating = true
    const keyPairs = await generateKeys()
    this.form.privateKey = keyPairs.privateKey
    this.form.publicKey = keyPairs.publicKey
    this.generating = false
  }
}
</script>

<template lang="pug">
  .flex.column.verify-otp
    .col-9
      q-card.q-mb-lg(flat)
        q-card-section
          h2 {{ $t('pages.accounts.add.verifyOTPTitle') }}
        q-card-section
          div(v-if="generating")
            | {{ $t('pages.accounts.add.verifyAccountGeneratingKey') }}
          div(v-else)
            q-input(
              ref="publicKey"
              v-model="form.publicKey"
              label="Public Key"
              :rules="[() => copy.publicKey || $t('forms.errors.copyKey')]"
              lazy-rules
            )
              template(v-slot:after)
                q-btn(
                  round
                  color="primary"
                  icon="fas fa-clipboard"
                  size="sm"
                  @click="() => {copyToClipboard(form.publicKey); copy.publicKey = true;}"
                )
            q-input(
              ref="privateKey"
              v-model="form.privateKey"
              label="Private Key"
              :rules="[() => copy.privateKey || $t('forms.errors.copyKey')]"
              lazy-rules
            )
              template(v-slot:after)
                q-btn(
                  round
                  color="primary"
                  icon="fas fa-clipboard"
                  size="sm"
                  @click="() => {copyToClipboard(form.privateKey); copy.privateKey = true;}"
                )
        q-card-section
          q-input(
            ref="password"
            v-model="form.password"
            color="accent"
            :label="$t('pages.accounts.add.forms.verificationCode')"
            outlined
            :rules="[rules.required]"
            lazy-rules
          )
    .col-3
      .hint {{ $t('pages.accounts.add.verifyAccountHint') }}
      q-btn.full-width(
        color="primary"
        :label="$t('pages.accounts.add.buttons.continue')"
        size="lg"
        unelevated
        :loading="submitting"
        @click="onVerifyOTP"
      )
</template>

<style lang="sass" scoped>
.verify-otp
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
    margin: 10px 0 10px 0
</style>
