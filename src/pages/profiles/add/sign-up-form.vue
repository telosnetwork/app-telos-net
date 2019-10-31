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
      div(v-for='(cField, index) in customFields', :key='index')
        q-input(filled, v-model='customFields[index].value', :label="cField.label", lazy-rules,)
      .row
        q-btn(label="Add custom field", type='button', color='green', size='14px', flat, rounded, @click="openCustomFieldModal")
      q-btn(:label="$t('pages.signUp.form.btnSave')", type='submit', color='primary')
      q-dialog(v-model='addingNewField' persistent)
        q-card
          q-card-section
            .text-h6
              | Write the name of new custom field
          q-card-section
            q-input(dense, v-model="newFieldName", autofocus)
          q-card-section
            q-btn(flat, label='Cancel', v-close-popup)
            q-btn(flat, label='Add custom field', v-close-popup, @click='addCustomField')

      //- q-btn.q-ml-sm(label='Reset', type='reset', color='primary', flat)
</template>

<script>
import PPP from '@smontero/ppp-client-api'
import { PublicFields, RootFields } from '@smontero/ppp-common'
import CommMethods from '@smontero/ppp-common/dist/const/CommMethods'
import { mapActions } from 'vuex'
import S3Image from '~/components/s3-image'
import { utils } from '~/mixins/utils'

export default {
  name: 'sign-up-form',
  mixins: [utils],
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
      loadingFile: false,
      customFields: [],
      addingNewField: false,
      newFieldName: ''
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
    // customFieldsC () {
    //   const customFields = []
    //   const color = 'green'
    //   for (const cField in this.customField) {
    //     customFields.push({ label: this.customField[cField].display, value: this.customField[cField].value, color: color })
    //   }
    //   return customFields
    // },
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
    this.$store.commit('profiles/setPPPLoading', true)
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
      this.customFields = this.myProfile.publicData.customFields
    }
    this.$store.commit('profiles/setPPPLoading', false)
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
        this.showNotification('You must choose one prefer method communication', 'error')
      } else if (this.hobbies.length === 0) {
        this.showNotification('You must write at least one hobby', 'error')
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
          [PublicFields.BIO]: this.presentation,
          'customFields': this.customFields
        }
      }
      this.$store.commit('profiles/setPPPLoading', true)
      await this.signUp(mData)
      this.showNotification('Submited')
      await this.getProfile()
      this.$store.commit('profiles/setPPPLoading', false)
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
        if (!this.$store.getters['profiles/isRegistered'] || !this.myProfile.smsInfo || !this.myProfile.smsInfo.exists) {
          return (
            (this.smsNumber && this.smsNumber.length > 0) ||
          'Please type something'
          )
        }
      }
    },

    validationEMAIL () {
      if (this.methodComm === CommMethods.EMAIL.value) {
        if (!this.$store.getters['profiles/isRegistered'] || !this.myProfile.emailInfo || !this.myProfile.emailInfo.exists) {
          return (
            (this.email && this.email.length > 0) || 'Please type something'
          )
        }
      }
    },

    addCustomField () {
      this.customFields.push({ label: this.newFieldName, value: '' })
      this.newFieldName = ''
    },

    openCustomFieldModal () {
      this.addingNewField = true
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
