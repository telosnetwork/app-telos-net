<template lang='pug'>
.row.justify-center.items-center
  .col-xs-11.col-md-8.q-gutter-y-md.q-pa-md
    .row.justify-center
      //- s3-image.S3Img(:img-key='imgKey', :identity='identity')
      edit-image(:img-key='imgKey', :identity='identity', ref="mEditImage")
    q-form.q-gutter-y-md(@submit='onSubmit', @reset='onReset')
      //- q-input(filled, v-model='presentationSanitized', :label="$t('pages.signUp.form.presentation')", lazy-rules, :rules="[ val => val && val.length > 0 || $t('forms.errors.required')]", autogrow)
      q-input(filled, v-model='name', :label="$t('pages.signUp.form.name')", lazy-rules, :rules="[ val => val && val.length > 0 || $t('forms.errors.required')]")
      .small-margin
        p.text-weight-thin.small-margin {{$t('pages.signUp.form.presentation')}}
        q-editor(v-model="presentation" min-height="5rem")
      //- q-input(filled, v-model='lastName', :label="$t('pages.signUp.form.lastName')", lazy-rules, :rules="[ val => val && val.length > 0 || $t('forms.errors.required')]")
      .row.justify-center.q-mt-sm
        p.text-weight-thin {{$t('pages.signUp.form.preferMethodComm')}}
      .row.justify-center.q-mb-md
        q-option-group.items-center(:options='commMeth', :label="$t('pages.signUp.form.preferMethodComm')", type='radio', v-model='methodComm', inline)
      .row.q-col-gutter-x-xs.q-col-gutter-y-lg
        .col-xs-12.col-md-3
          q-select(
              filled
              v-if="phoneOptions.length > 0",
              v-model="countryCodeTel"
              :options="phoneOptions"
              option-value="dialCode"
              :option-label="(option) => `${option.name} (${option.dialCode})`"
              :label="$t('pages.accounts.add.forms.phoneCode')"
              :rules='[validationCodeSMS]'
              emit-value
              map-options
            )
        .col
          q-input(filled, v-model='smsNumber', :label="$t('pages.signUp.form.sms')", :hint='smsHint', mask='(###) ### - ####', unmasked-value, lazy-rules, :rules='[validationSMS]')
      q-input(filled, v-model='email', :label="$t('pages.signUp.form.email')", :hint='emailHint', type='email', lazy-rules, :rules='[validationEMAIL]')
      q-select(
        v-if="timeZoneOptions.length > 0",
        filled,
        v-model='country',
        use-input, input-debounce='0',
        :label="$t('pages.signUp.form.timeZone')",
        :options='optionsCountriesFiltered',
        @filter='filterCountries',
        behavior='dialog',
        option-value="value",
        option-label="text",
        emit-value,
        map-options
      )
        template(v-slot:no-option)
          q-item
            q-item-section.text-grey {{ $t('lists.empty.countries') }}
      q-select(
        :label="$t('pages.signUp.form.tags')",
        :hint="$t('forms.hints.pressToAddHobbie')",
        filled,
        v-model='tags',
        use-input,
        use-chips,
        multiple,
        hide-dropdown-icon,
        input-debounce='0',
        new-value-mode='add-unique',
      )
      div(v-for='(cField, index) in customFields', :key='index')
        q-input(filled, v-model='customFields[index].value', :label="customFields[index].label", lazy-rules, :rules="[ val => val && val.length > 0 || $t('forms.errors.required')]")
          template(v-slot:append)
            q-btn(round, dense, flat, icon='edit', color='green', @click='openEditCustomField(index)')
            q-btn(round, dense, flat, icon='delete', color='red', @click='deleteCustomField(index)')
      .row
        q-btn(:label="$t('pages.signUp.form.addCustomField')", type='button', color='green', size='14px', flat, rounded, @click="openCustomFieldModal")
      q-btn(:label="$t('pages.signUp.form.btnSave')", type='submit', color='primary')
      q-dialog(v-model='addingNewField', persistent, @hide='editingCustomField = false')
        q-card(v-if="!editingCustomField")
          q-card-section
            .text-h6
              | {{ $t('pages.signUp.form.newCustomFieldName') }}
          q-card-section
            q-input(dense, v-model="newFieldName", autofocus)
          q-card-section
            q-btn(flat, :label="$t('common.buttons.cancel')", v-close-popup)
            q-btn(flat, :label="$t('pages.signUp.form.addCustomField')", v-close-popup, @click='addCustomField')
        q-card(v-if="editingCustomField")
          q-card-section
            .text-h6
              | {{ $t('pages.signUp.form.editCustomFieldName') }}
          q-card-section
            q-input(dense, v-model="newFieldName", autofocus)
          q-card-section
            q-btn(flat, :label="$t('common.buttons.cancel')", v-close-popup)
            q-btn(flat, :label="$t('common.buttons.save')", v-close-popup, @click='editCustomFieldName')

      //- q-btn.q-ml-sm(label='Reset', type='reset', color='primary', flat)
</template>

<script>
import { PublicFields, RootFields } from '@smontero/ppp-common'
import CommMethods from '@smontero/ppp-common/dist/const/CommMethods'
import { mapActions } from 'vuex'
import S3Image from '~/components/s3-image'
import EditImage from '~/pages/profiles/add/edit-image'
import PPP from '@smontero/ppp-client-api'
import { countriesPhoneCode } from '~/mixins/countries-phone-code'
import { timeZones } from '~/mixins/time-zones'

export default {
  name: 'sign-up-form',
  components: {
    S3Image,
    EditImage
  },
  mixins: [countriesPhoneCode, timeZones],
  data () {
    return {
      imgKey: '',
      identity: '',
      name: '',
      smsNumber: '',
      email: '',
      methodComm: 'EMAIL',
      paymentsOptions: [],
      country: '',
      optionsCountriesFiltered: [],
      tags: [],
      presentation: '',
      customFields: [],
      addingNewField: false,
      editingCustomField: false,
      newFieldName: '',
      indexEditField: 0,
      url: '',
      countryCodeTel: null,
      phoneOptions: []
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
    },
    countries () {
      const countries = []
      return countries
    },
    presentationSanitized () {
      let sanitized = this.presentation
      sanitized = sanitized.replace(/script/gi, '')
      sanitized = sanitized.replace(/<a/gi, '')
      sanitized = sanitized.replace(/href/gi, '')
      return sanitized
    }
  },
  watch: {
    smsNumber (newValue, oldValue) {
      // console.log(newValue, oldValue)
    }
  },
  beforeMount: async function () {
    this.showIsLoading(true)
    const response = await this.getProfile()
    if (response !== undefined) {
      this.name = response.publicData.name
      this.presentation = response.publicData.bio
      this.country = response.publicData.timeZone
      this.tags = response.publicData.tags
      this.imgKey = response.publicData.avatarImage
      this.identity = response.publicData.s3Identity
      this.methodComm = response.commPref
      this.customFields = response.publicData.customFields ? response.publicData.customFields : []
    }
    this.showIsLoading(false)
  },
  mounted () {
    this.optionsCountriesFiltered = this.timeZoneOptions
    this.phoneOptions = this.countriesPhoneCode
  },
  methods: {
    ...mapActions('profiles', ['signUp', 'searchProfiles', 'getProfile']),
    onSubmit () {
      if (this.methodComm === null) {
        this.showErrorMsg('You must choose one prefer method communication')
      } else {
        this.doSignup()
      }
    },
    async getImg (blob) {
      const profileApi = PPP.profileApi()
      const authApi = PPP.authApi()
      const key = await profileApi.uploadImage(blob)
      const userInfo = await authApi.userInfo()
      const urlr = await profileApi.getImageUrl(key, userInfo.id)
      this.url = urlr
      this.imgKey = key
      this.identity = userInfo.id
      this.loadingFile = false
    },
    async doSignup () {
      this.showIsLoading(true)
      await this.$refs.mEditImage.getBlob()
        .then((v) => this.getImg(v))
        .catch(e => console.log(e))

      // console.log('New number', `${this.countryCodeTel}${this.smsNumber}`)

      const mData = {
        [RootFields.EMAIL]: this.email,
        [RootFields.SMS_NUMBER]: this.smsNumber === '' ? this.smsNumber : `${this.countryCodeTel}${this.smsNumber}`,
        [RootFields.COMM_PREF]: this.methodComm,
        publicData: {
          [PublicFields.NAME]: this.name,
          [PublicFields.TIME_ZONE]: this.country,
          [PublicFields.AVATAR_IMAGE]: this.imgKey,
          [PublicFields.S3_IDENTITY]: this.identity,
          [PublicFields.TAGS]: this.tags,
          [PublicFields.BIO]: this.presentationSanitized,
          [PublicFields.CUSTOM_FIELDS]: this.customFields
        }
      }
      try {
        this.showIsLoading(true)
        await this.signUp(mData)
        this.showSuccessMsg('Submited')
        await this.getProfile()
        this.showIsLoading(false)
        this.$router.push({ name: 'myProfile' })
      } catch (e) {
        this.showIsLoading(false)
        this.showErrorMsg(e.message)
      }
    },
    onReset () {
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
          this.optionsCountriesFiltered = this.timeZoneOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.optionsCountriesFiltered = this.timeZoneOptions.filter(
          v => v.text.toLowerCase().indexOf(needle) > -1
          // v => console.log('Value', v)
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

    validationCodeSMS () {
      if (this.smsNumber !== '' && this.countryCodeTel === null) {
        return this.$t('forms.errors.required')
      } else return true
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
    },

    openEditCustomField (index) {
      this.addingNewField = true
      this.editingCustomField = true
      this.indexEditField = index
      this.newFieldName = this.customFields[this.indexEditField].label
    },

    editCustomFieldName () {
      this.customFields[this.indexEditField].label = this.newFieldName
      this.indexEditField = 0
      this.newFieldName = ''
    },

    deleteCustomField (index) {
      this.customFields.splice(index, 1)
    }
  }
}
</Script>

<style scoped lang='sass'>
.S3Img
  height: 150px;
  max-width: 150px;
  border-radius: 100px;
.r
 border-radius: 100px;
.small-margin
  margin: 0px;
</style>
