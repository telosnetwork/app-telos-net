<template lang='pug'>
.row.justify-center.items-center
  .col-xs-8.q-gutter-y-md.q-pa-md
    q-form.q-gutter-y-md(@submit="_verify(EMAIL)",v-show="toValidate === EMAIL")
        q-input(filled, v-model='codeEMAIL', :label="$t('pages.verifyProfile.codeEMAIL')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']")
        q-btn(:label="$t('pages.verifyProfile.verifyEMAIL')", type='submit', color='primary')

    q-form.q-gutter-y-md(@submit="_verify(SMS)",v-show="toValidate === SMS")
        q-input(filled, v-model='codeSMS', :label="$t('pages.verifyProfile.codeSMS')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']")
        q-btn(:label="$t('pages.verifyProfile.verifySMS')", type='submit', color='primary')
</template>

<script>
import { mapActions } from 'vuex'
import { CommMethods } from '@smontero/ppp-common'
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
      const { type } = this.$route.params
      if (type) {
        return type
      }
      const profile = this.$store.state.profiles.myProfile
      switch (profile.commPref) {
        case this.EMAIL:
          if (profile.emailInfo.needsToVerify) {
            return this.EMAIL
          } else {
            if (profile.smsInfo.needsToVerify) {
              return this.SMS
            }
          }
          break
        case this.SMS:
          if (profile.smsInfo.needsToVerify) {
            return this.SMS
          } else {
            if (profile.emailInfo.needsToVerify) {
              return this.EMAIL
            }
          }
          break
        default:
          return 'ALL'
      }
      return 'ALL'
    },
    SMS () {
      return CommMethods.SMS.value
    },
    EMAIL () {
      return CommMethods.EMAIL.value
    }
  },
  methods: {
    ...mapActions('profiles', ['verifySMS', 'verifyEmail', 'getProfile']),
    _verify: async function (type) {
      this.showIsLoading(true)
      try {
        type === this.SMS ? await this.verifySMS(this.codeSMS) : await this.verifyEmail(this.codeEMAIL)
        const returnUrl = this.$route.query.returnUrl
        await this.getProfile()
        this.$router.push({ path: returnUrl || '/profiles/myProfile' })
      } catch (e) {
        this.showErrorMsg(e.message)
      } finally {
        this.showIsLoading(false)
      }
    }
  }
}
</script>
