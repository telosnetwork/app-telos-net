import { mapActions } from 'vuex'

export const validation = {
  data () {
    return {
      rules: {
        accountFormatBasic: val => /^([a-z]|[1-5]){12}$/.test(val) || this.$t('forms.errors.accountFormatBasic'),
        accountFormat: val => /^([a-z]|[1-5]|.){1,12}$/.test(val) || this.$t('forms.errors.accountFormat'),
        accountLength: val => val.length <= 12 || this.$t('forms.errors.accountLength'),
        isAccountAvailable: async account => (await this.isAccountFree(account)) || this.$t('forms.errors.accountNotAvailable', { account }),
        accountExists: async account => !(await this.isAccountFree(account)) || this.$t('forms.errors.accountNotExists', { account }),
        required: val => !!val || this.$t('forms.errors.required'),
        isInteger: val => Number.isInteger(val) || this.$t('forms.errors.integer'),
        positiveInteger: val => val > 0 || this.$t('forms.errors.positiveInteger'),
        greaterOrEqualThan: value => val => val >= value || this.$t('forms.errors.greaterOrEqualThan', { value }),
        dateFuture: date => val => new Date(val).getTime() >= new Date(date).getTime() || this.$t('forms.errors.dateFuture')
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
