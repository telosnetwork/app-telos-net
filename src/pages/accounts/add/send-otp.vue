<script>
import { mapActions } from 'vuex'
// import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

import { validation } from '~/mixins/validation'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'page-send-otp',
  mixins: [validation, countriesPhoneCode],
  data () {
    return {
      form: {
        account: null,
        smsNumber: null,
        countryCode: null,
        internationalPhone: null
      },
      recaptcha: false,
      phoneOptions: [],
      error: null,
      submitting: false
    }
  },
  mounted () {
    this.phoneOptions = this.countriesPhoneCode
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
    document.head.appendChild(recaptchaScript)
  },
  methods: {
    ...mapActions('accounts', ['sendOTP']),
    async onSendOTP () {
      this.resetValidation(this.form)
      this.error = null
      if (!(await this.validate(this.form))) return
      /* const phoneUtil = PhoneNumberUtil.getInstance()
      const number = phoneUtil.parseAndKeepRawInput(`${this.form.countryCode.dialCode}${this.form.smsNumber}`, this.form.countryCode.code)
      this.form.internationalPhone = phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL)
      this.submitting = true
      const result = await this.sendOTP(this.form) */
      if (this.recaptcha) {
        this.$router.push({ path: '/accounts/add/verifyOTP' })
      } else {
        this.error = 'Please complete reCaptcha'
      }
      this.submitting = false
    },
    onVerify: function (response) {
      if (response) this.recaptcha = true
    }
    /* isPhoneValid (val) {
      try {
        const phoneUtil = PhoneNumberUtil.getInstance()
        const number = phoneUtil.parseAndKeepRawInput(`${this.form.countryCode.dialCode}${this.form.smsNumber}`, this.form.countryCode.code)
        return phoneUtil.isValidNumber(number) || this.$t('forms.errors.phoneFormat')
      } catch (e) {
        return this.$t('forms.errors.phoneFormat')
      }
    } */
  },
  components: {
    'vue-recaptcha': VueRecaptcha
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
            :hint="$t('pages.accounts.add.forms.accountHint')"
            outlined
            maxlength="12"
            :rules="[rules.required, rules.accountFormatBasic, rules.accountLength, rules.isAccountAvailable]"
            lazy-rules
            :debounce="200"
            @blur="form.account = (form.account || '').toLowerCase()"
          )
          vue-recaptcha(
            ref='recaptcha'
            :sitekey="'6Lc6WLUaAAAAACiwPE9qyN-CX5KfLPGm6pY5OeUf'"
            @verify="onVerify"
          )
          .text-red(v-if="error") {{ error }}
    .col-3
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
