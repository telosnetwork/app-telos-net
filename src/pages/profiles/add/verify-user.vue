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
    _verifySMS: function () {
      this.verifySMS(this.codeSMS)
        .then(async v => {
          const returnUrl = this.$route.query.returnUrl
          await this.getProfile()
          this.$router.push({ path: returnUrl || '/profiles/myProfile' })
        })
        .catch(e => {
          console.log(e)
          this.showNotification(e.message, 'error')
        })
    },
    _verifyEmail: function () {
      this.verifyEmail(this.codeEMAIL)
        .then(async v => {
          const returnUrl = this.$route.query.returnUrl
          await this.getProfile()
          this.$router.push({ path: returnUrl || '/profiles/myProfile' })
        })
        .catch(e => {
          console.log(e)
          this.showNotification(e.message, 'error')
        })
    }
  }
}
</script>
