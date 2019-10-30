<template lang='pug'>
.row.justify-center.items-center
  .col-xs-8.q-gutter-y-md.q-pa-md
    .row.justify-center
      s3-image.S3Img(:img-key='imgKey', :identity='identity')
    q-form.q-gutter-y-md(@submit='onSubmit', @reset='onReset')
      .row.justify-center
        q-btn(:loading='loadingFile', color='orange', text-color='grey-9', @click='$refs.btnUp.click()', icon='cloud_upload', style='width: 100px')
          input(ref='btnUp', label='btnUp', type='file', accept='image/png, image/jpeg', v-on:change='onFileChange', style='display: none;')
      q-input(filled, v-model='presentation', :label="$t('pages.signUp.form.presentation')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']", autogrow)
      q-input(filled, v-model='firstName', :label="$t('pages.signUp.form.firstName')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']")
      q-input(filled, v-model='lastName', :label="$t('pages.signUp.form.lastName')", lazy-rules, :rules="[ val => val && val.length > 0 || 'Please type something']")
      .row.justify-center
        q-option-group.items-center(:options='commMeth', :label="$t('pages.signUp.form.preferMethodComm')", type='radio', v-model='methodComm', inline)
      q-input(filled, v-model='smsNumber', :label="$t('pages.signUp.form.sms')", :hint='smsHint', mask='+## (###) ### - ####', unmasked-value, lazy-rules, :rules='[validationSMS]')
      q-input(filled, v-model='email', :label="$t('pages.signUp.form.email')", :hint='emailHint', type='email', lazy-rules, :rules='[validationEMAIL]')
      q-select(filled, v-model='country', use-input, input-debounce='0', :label="$t('pages.signUp.form.country')", :options='optionsCountriesFiltered', @filter='filterCountries', behavior='dialog', :rules="[ val => val && val.length > 0 || 'Please select your countrie']")
        template(v-slot:no-option)
          q-item
            q-item-section.text-grey No results
      q-select(:label="$t('pages.signUp.form.hobbies')", filled, v-model='hobbies', use-input, use-chips, multiple, hide-dropdown-icon, input-debounce='0', new-value-mode='add-unique')
      q-btn(:label="$t('pages.signUp.form.btnSave')", type='submit', color='primary')
      //- q-btn.q-ml-sm(label='Reset', type='reset', color='primary', flat)
</template>

<script>
import PPP from '@smontero/ppp-client-api'
import { PublicFields, RootFields } from '@smontero/ppp-common'
import CommMethods from '@smontero/ppp-common/dist/const/CommMethods'
import { mapActions } from 'vuex'
import S3Image from '~/components/s3-image'

export default {
  name: 'sign-up-form',
  components: {
    S3Image
  },
  data () {
    return {
      imgKey: '',
      identity: '',
      firstName: '',
      lastName: '',
      smsNumber: '',
      email: '',
      methodComm: 'EMAIL',
      paymentsOptions: [],
      country: '',
      optionsCountries: [
        'Mexico',
        'Estados Unidos',
        'Reino Unido',
        'Canada',
        'India'
      ],
      optionsCountriesFiltered: [],
      hobbies: [],
      presentation: '',
      presentationStr: '/components/signUp/form/presentation',
      loadingFile: false
    }
  },
  computed: {
    commMeth () {
      const commMeth = []
      const color = 'cyan'
      for (const comm in CommMethods) {
        commMeth.push({ label: CommMethods[comm].display, value: CommMethods[comm].value, color: color })
      }
      return commMeth
    },
    myProfile () {
      return this.$store.state.profiles.myProfile
    },
    smsHint () {
      if (this.myProfile !== undefined) {
        if (this.myProfile.smsInfo.exists === true) {
          return `${this.$t('pages.signUp.form.currentSms')} : ${this.myProfile.smsInfo.mask}`
        } else return 'SMS'
      } else return this.$t('pages.signUp.form.currentSms')
    },
    emailHint () {
      if (this.myProfile !== undefined) {
        if (this.myProfile.emailInfo.exists === true) {
          return `${this.$t('pages.signUp.form.currentEmail')} : ${this.myProfile.emailInfo.mask}`
        } else return this.$t('pages.signUp.form.currentEmail')
      } else return this.$t('pages.signUp.form.currentEmail')
    }
  },
  beforeMount: async function () {
    await this.getProfile()
    if (this.myProfile !== undefined) {
      this.firstName = this.myProfile.publicData.firstName
      this.lastName = this.myProfile.publicData.lastName
      this.presentation = this.myProfile.publicData.bio
      this.country = this.myProfile.publicData.countryCode
      this.hobbies = this.myProfile.publicData.hobbies
      this.imgKey = this.myProfile.publicData.profileImage
      this.identity = this.myProfile.publicData.s3Identity
      this.methodComm = this.myProfile.commPref
    }
  },
  methods: {
    ...mapActions('profiles', ['signUp', 'searchProfiles', 'getProfile']),
    async onFileChange (e) {
      this.loadingFile = true
      const file = e.target.files[0]
      // console.log('File changed!')
      const profileApi = PPP.profileApi()
      const authApi = PPP.authApi()
      const key = await profileApi.uploadAvatar(file)
      // console.log(key)
      const userInfo = await authApi.userInfo()
      // console.log(userInfo)
      // const url = await profileApi.getAvatarUrl(key, userInfo.id)
      // console.log(url)
      this.imgKey = key
      this.identity = userInfo.id
      this.loadingFile = false
    },
    onSubmit () {
      if (this.methodComm === null) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must choose one prefer method communication'
        })
      } else if (this.hobbies.length === 0) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must write at least one hobby'
        })
      } else {
        this.doSignup()
      }
    },
    async doSignup () {
      const mData = {
        [RootFields.EMAIL]: this.email,
        [RootFields.SMS_NUMBER]: this.smsNumber === '' ? this.smsNumber : `+${this.smsNumber}`,
        [RootFields.COMM_PREF]: this.methodComm,
        publicData: {
          [PublicFields.FIRST_NAME]: this.firstName,
          [PublicFields.LAST_NAME]: this.lastName,
          [PublicFields.COUNTRY_CODE]: this.country,
          [PublicFields.PROFILE_IMAGE]: this.imgKey,
          [PublicFields.S3_IDENTITY]: this.identity,
          [PublicFields.HOBBIES]: this.hobbies,
          [PublicFields.BIO]: this.presentation
        }
      }
      await this.signUp(mData)
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
      })
      await this.getProfile()
      this.$router.push({ name: 'myProfile' })
    },
    onReset () {
      this.firstName = null
      this.lastName = null
      this.name = null
      this.age = null
      this.smsNumber = null
      this.email = null
      this.methodComm = null
      this.accept = false
    },

    filterCountries (val, update) {
      if (val === '') {
        update(() => {
          this.optionsCountriesFiltered = this.optionsCountries
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.optionsCountriesFiltered = this.optionsCountries.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        )
      })
    },

    validationSMS () {
      if (this.methodComm === CommMethods.SMS.value) {
        if (!this.$store.getters['profiles/isRegistered'] || !this.myProfile.smsInfo.exists) {
          return (
            (this.smsNumber && this.smsNumber.length > 0) ||
          'Please type something'
          )
        }
      }
    },

    validationEMAIL () {
      if (this.methodComm === CommMethods.EMAIL.value) {
        if (!this.$store.getters['profiles/isRegistered'] || !this.myProfile.emailInfo.exists) {
          return (
            (this.email && this.email.length > 0) || 'Please type something'
          )
        }
      }
    }
  }
}
</script>

<style scoped lang='sass'>
.S3Img
  height: 150px;
  max-width: 150px;
  border-radius: 100px;
</style>
