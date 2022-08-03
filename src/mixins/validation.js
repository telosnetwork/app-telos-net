import { mapActions } from 'vuex'
const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'

export const validation = {
  data () {
    return {
      rules: {
        accountExists: async account => !(await this.isAccountFree(account.toLowerCase())) || this.$t('forms.errors.accountNotExists', { account }),
        accountFormat: val => /^([a-z]|[1-5]|.){1,12}$/.test(val.toLowerCase()) || this.$t('forms.errors.accountFormat'),
        accountFormatBasic: val => /^([a-z]|[1-5]){12}$/.test(val.toLowerCase()) || this.$t('forms.errors.accountFormatBasic'),
        accountLength: val => val.length <= 12 || this.$t('forms.errors.accountLength'),
        dateFuture: date => val => new Date(val).getTime() >= new Date(date).getTime() || this.$t('forms.errors.dateFuture'),
        greaterOrEqualThan: value => val => val >= value || this.$t('forms.errors.greaterOrEqualThan', { value }),
        minimumOptions: val => val.length >= 2 || this.$t('forms.errors.greaterOrEqualThan', { val }),
        isAccountAvailable: async account => (await this.isAccountFree(account.toLowerCase())) || this.$t('forms.errors.accountNotAvailable', { account }),
        isInteger: val => Number.isInteger(parseInt(val)) || this.$t('forms.errors.integer'),
        isToken: val => (val.length >= 2 && val.length <= 6) || this.$t('forms.errors.token'),
        isTokenDecimals: val => (parseInt(val) >= 0 && parseInt(val) <= 9) || this.$t('forms.errors.tokenDecimals'),
        positiveInteger: val => parseInt(val) > 0 || this.$t('forms.errors.positiveInteger'),
        isValidIPFShash: val => val.match(regex) || 'Invalid IPFS HASH format',
        required: val => !!val || this.$t('forms.errors.required')
      }
    }
  },
  methods: {
    ...mapActions('accounts', ['isAccountFree']),
    async validate (form) {
      if (!form) return true
      for await (const key of Object.keys(form)) {
        if (this.$refs[key]) {
          await this.$refs[key].validate()
        }
      }
      return Object.keys(form).reduce((valid, key) => valid && (!this.$refs[key] || !this.$refs[key].hasError), true)
    },
    resetValidation (form) {
      if (!form) return
      Object.keys(form).forEach((key) => this.$refs[key] && this.$refs[key].resetValidation())
    }
  }
}
