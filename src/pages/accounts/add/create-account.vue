<script>
import { mapActions } from 'vuex'

import { validation } from '~/mixins/validation'
import VueRecaptcha from 'vue-recaptcha'

import { generateKeys } from '~/utils/eosio'

export default {
  name: 'page-create-account',
  mixins: [validation],
  data () {
    return {
      form: {
        account: null,
        recaptchaResponse: null,
        publicKey: null,
        privateKey: null
      },
      recaptcha: false,
      generating: false,
      error: null,
      submitting: false,
      copy: false
    }
  },
  async created () {
    this.generating = true
    const keyPairs = await generateKeys()
    this.form.privateKey = keyPairs.privateKey
    this.form.publicKey = keyPairs.publicKey
    this.generating = false
  },
  mounted () {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
    document.head.appendChild(recaptchaScript)
  },
  methods: {
    ...mapActions('accounts', ['createAccount']),
    async onCreateAccount () {
      this.resetValidation(this.form)
      this.error = null
      if (!(await this.validate(this.form))) return

      if (this.recaptcha) {
        this.submitting = true
        const { success, error } = await this.createAccount(this.form)
        if (success) {
          this.$router.push({ path: '/accounts/add/congratulations' })
        } else {
          this.error = error
        }
        this.submitting = false
      } else {
        this.error = 'Please complete reCaptcha'
      }
      this.submitting = false
    },
    async onVerify (response) {
      if (response) {
        this.recaptcha = true
        this.form.recaptchaResponse = response
        this.error = null
      }
    },
    onExpire: function () {
      this.recaptcha = false
      this.recaptchaResponse = null
    }
  },
  components: {
    'vue-recaptcha': VueRecaptcha
  }
}
</script>

<template lang="pug">
  .flex.column.send-otp
    .col-9
      q-card.q-mb-lg(
        flat
        v-show="!generating"
      )
        q-card-section
          h2 {{ $t('pages.accounts.add.createAccountTitle') }}
          q-input.q-mb-lg(
            ref="account"
            v-model="form.account"
            color="accent"
            :label="$t('pages.accounts.add.forms.account')"
            :hint="$t('pages.accounts.add.forms.accountHint')"
            outlined
            maxlength="12"
            :rules="[rules.required, rules.accountFormatBasic, rules.accountLength, rules.isAccountAvailable]"
            lazy-rules
            :debounce="200"
            @blur="form.account = (form.account || '').toLowerCase()"
          )
        q-card-section
          .text-red {{ $t('pages.accounts.add.saveKeys') }}
          div
            q-input(
              ref="publicKey"
              v-model="form.publicKey"
              label="Public Key"
              :rules="[() => copy || $t('forms.errors.copyKey')]"
              lazy-rules
              @click="$refs['publicKey'].select()"
            )
              template(v-slot:after)
                q-btn(
                round
                color="primary"
                icon="fas fa-clipboard"
                size="sm"
                @click="() => { copyToClipboard(form.publicKey); setSuccessMsg($t('pages.accounts.add.keyCopyClipboard'))}"
              )
            q-input(
              ref="privateKey"
              v-model="form.privateKey"
              label="Private Key"
              :rules="[() => copy || $t('forms.errors.copyKey')]"
              lazy-rules
              @click="$refs['privateKey'].select()"
            )
              template(v-slot:after)
                q-btn(
                  round
                  color="primary"
                  icon="fas fa-clipboard"
                  size="sm"
                  @click="() => { copyToClipboard(form.privateKey); setSuccessMsg($t('pages.accounts.add.keyCopyClipboard'))}"
                )
            q-checkbox(
              v-model="copy"
              label="I have copied my keys somewhere safe"
            )
          vue-recaptcha(
            ref='recaptcha'
            :sitekey="'6Ld-_eIZAAAAAF6JsrFudo_uQjRL4eqPAZE40I3o'"
            @verify="onVerify"
            @expired="onExpire"
          )
          .text-red(v-if="error && !generating") {{ error }}
          .col-3
            .hint {{ $t('pages.accounts.add.verifyAccountHint') }}
            q-btn.full-width(
              color="primary"
              :label="$t('pages.accounts.add.buttons.continue')"
              size="lg"
              unelevated
              :loading="submitting"
              @click="onCreateAccount"
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
  .test
    width: 960px
    position: relative
    margin: 0 auto
    line-height: 1.4em
  .warning
    color: red
    font-size: 12px
    text-align: center
    font-weight: 0
    border: 1px solid lightgrey
    margin: 0 0 20px 0
  .q-btn-item
    /deep/div
      font-size: 12px
  .hint
    color: #707070
    font-size: 12px
    margin: 30px 0 10px 0
  .phone-input
    /deep/.q-select
      .q-field__inner
        .q-field__control
          border-radius: 4px 0 0 4px
          &:before
            border-right: none
    /deep/.q-input
      .q-field__inner
        .q-field__control
          border-radius: 0 4px 4px 0
          &:before
            border-left: none
</style>
