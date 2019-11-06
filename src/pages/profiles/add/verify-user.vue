<template lang='pug'>
.row.justify-center.items-center
  .col-xs-8.q-gutter-y-md.q-pa-md
    q-form.q-gutter-y-md(@submit='_verifyEmail',v-show="toValidate === 'EMAIL'")
        q-input(filled, v-model='codeEMAIL', :label="$t('pages.verifyProfile.codeEMAIL')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']")
        q-btn(:label="$t('pages.verifyProfile.verifyEMAIL')", type='submit', color='primary')

    q-form.q-gutter-y-md(@submit='_verifySMS',v-show="toValidate === 'SMS'")
        q-input(filled, v-model='codeSMS', :label="$t('pages.verifyProfile.codeSMS')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']")
        q-btn(:label="$t('pages.verifyProfile.verifySMS')", type='submit', color='primary')
</template>

<script>
import { mapActions } from 'vuex'
import { utils } from '~/mixins/utils'
export default {
  name: 'verify-user',
  mixins: [utils],
  data () {
    return {
      codeEMAIL: '',
      codeSMS: ''
    }
  },
  computed: {
    needVerifyEmail () {
      const profile = this.$store.state.profiles.myProfile
      if (profile.emailInfo.exist && profile.emailInfo.needsToVerify) {
        return true
      } else return false
    },
    toValidate () {
      const profile = this.$store.state.profiles.myProfile
      switch (profile.commPref) {
        case 'EMAIL':
          if (profile.emailInfo.needsToVerify) {
            return 'EMAIL'
          } else {
            if (profile.smsInfo.needsToVerify) {
              return 'SMS'
            }
          }
          break
        case 'SMS':
          if (profile.smsInfo.needsToVerify) {
            return 'SMS'
          } else {
            if (profile.emailInfo.needsToVerify) {
              return 'EMAIL'
            }
          }
          break
        default:
          return 'ALL'
      }
      return 'ALL'
    }
  },
  methods: {
    ...mapActions('profiles', ['verifySMS', 'verifyEmail', 'getProfile']),
    _verifySMS: async function () {
      this.showIsLoading(true)
      try {
        await this.verifySMS(this.codeSMS)
        const returnUrl = this.$route.query.returnUrl
        await this.getProfile()
        this.$router.push({ path: returnUrl || '/profiles/myProfile' })
        this.showIsLoading(true)
      } catch (e) {
        console.log(e)
        this.showErrorMsg(e.message)
        this.showIsLoading(false)
      }
    },
    _verifyEmail: async function () {
      this.showIsLoading(true)
      try {
        await this.verifyEmail(this.codeEMAIL)
        const returnUrl = this.$route.query.returnUrl
        await this.getProfile()
        this.$router.push({ path: returnUrl || '/profiles/myProfile' })
        this.showIsLoading(true)
      } catch (e) {
        console.log(e)
        this.showErrorMsg(e.message)
        this.showIsLoading(false)
      }
    }
  }
}
</script>
