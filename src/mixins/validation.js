import { mapActions } from 'vuex'

export const validation = {
  data () {
    return {
      rules: {
        accountFormat: val => !/[^a-z1-5]/.test(val) || this.$t('forms.errors.accountFormat'),
        accountLength: val => val.length === 12 || this.$t('forms.errors.accountLength'),
        isAccountAvailable: async account => (await this.isAccountFree(account)) || this.$t('forms.errors.accountNotAvailable', { account }),
        accountExists: async account => !(await this.isAccountFree(account)) || this.$t('forms.errors.accountNotExists', { account }),
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
