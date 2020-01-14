<template lang='pug'>
.row.justify-center.items-center.q-col-gutter-y-md.q-pa-md
  .col-xs-8
    .column
      q-avatar.self-center(size="120px")
        q-img(:src='icon', :ratio='1', spinner-color="primary", @load="successLoadIcon", @error="errorLoadIcon")
          template(v-slot:error)
            div.absolute-full.flex.flex-center.bg-negative
              .text-white.text-caption.text-center Cannot load image
    .row.justify-center
      q-radio(v-model='appType', :disable="editing", :val='appTypes.WEB_APP', :label='appTypes.WEB_APP')
      q-radio(v-model='appType', :disable="editing", :val='appTypes.NON_WEB_APP', :label='appTypes.NON_WEB_APP')
    q-form.q-col-gutter-y-md.q-mt-xs(@submit='onSubmit',v-if="appType==appTypes.WEB_APP")
      q-input(filled, v-model='url', :label="$t('pages.registerApp.form.urlBase')", :hint="$t('pages.registerApp.form.urlBase')" :rules='[ validationURL ]')
      q-input(filled, v-model='name', readonly, :label="$t('pages.registerApp.form.name')")
      q-input(filled, v-model='appId', readonly, :label="$t('pages.registerApp.form.appId')")
      q-input(filled, v-model='shortName', readonly, :label="$t('pages.registerApp.form.shortName')")
      q-select(
        :label="$t('pages.registerApp.form.urlRedirection')",
        :hint="$t('forms.hints.pressToAddURL')",
        filled,
        v-model='redirectionURL',
        use-input,
        use-chips,
        multiple,
        hide-dropdown-icon,
        input-debounce='0',
        new-value-mode='add-unique',
        @new-value="validateRedirectionURL"
      )
      .row.justify-center
        p.text-caption.errorURL(v-if="!redirectionValid") Please write a valid url
      q-input(v-model="keySecretComputed", readonly, filled :type="isHide ? 'text' : 'text'" hint="Password with toggle")
        template(v-slot:append)
          q-icon(
              :name="isHide ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isHide = !isHide")
      .row
        q-toggle(
          :label='isPrivateApp'
          v-model="isPrivate"
          checked-icon="lock"
          color="primary"
          unchecked-icon="public")
      div
        q-btn(label='Submit', type='submit', color='primary')
    q-form.q-col-gutter-y-xs.q-mt-xs(@submit='onSubmit',v-if="appType==appTypes.NON_WEB_APP")
      q-input.q-mt-md(filled, ref="inputImage" , v-model='icon', :label="$t('pages.registerApp.form.urlImage')", :hint="$t('pages.registerApp.form.urlImage')", :rules="[ value => iconLoaded !== false || 'Cannot load image', rules.required ]")
      q-input.q-mt-md(filled, v-model='name', :label="$t('pages.registerApp.form.name')", :rules='[ rules.required ]')
      q-input(filled, v-model='shortName', :label="$t('pages.registerApp.form.shortName')", :rules='[ rules.required ]')
      q-input(filled, v-model='appId', readonly, :label="$t('pages.registerApp.form.appId')")
      q-select(
        :label="$t('pages.registerApp.form.urlRedirection')",
        :hint="$t('forms.hints.pressToAddURL')",
        filled,
        v-model='redirectionURL',
        use-input,
        use-chips,
        multiple,
        hide-dropdown-icon,
        input-debounce='0',
        new-value-mode='add-unique',
        @new-value="validateRedirectionURL"
      )
      .row.justify-center
        p.text-caption.errorURL(v-if="!redirectionValid") Please write a valid url
      q-input(v-model="keySecretComputed", readonly, filled :type="isHide ? 'text' : 'text'" hint="Password with toggle")
        template(v-slot:append)
          q-icon(
              :name="isHide ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isHide = !isHide")
      .row
        q-toggle(
          :label='isPrivateApp'
          v-model="isPrivate"
          checked-icon="lock"
          color="primary"
          unchecked-icon="public")
      div.q-mt-md
        q-btn(label='Submit', type='submit', color='primary')
</template>

<script>
import { CustomRegex } from '~/const'
import { mapActions } from 'vuex'
import { utils } from '~/mixins/utils'
import { validation } from '~/mixins/validation'
import { AppTypes } from '@smontero/ppp-common'
export default {
  name: 'register-app-form',
  mixins: [utils, validation],
  data () {
    return {
      url: '',
      shortName: '',
      ownerAccount: '',
      appId: '',
      icon: '',
      name: '',
      appType: '',
      editing: false,
      iconLoaded: false,
      redirectionURL: [],
      redirectionValid: true,
      isHide: true,
      keySecret: 'HJG54ASF5648S564YT',
      isPrivate: false
    }
  },
  watch: {
    appType: function (newType, oldType) {
      if (oldType !== '') {
        this.shortName = ''
        this.name = ''
        this.icon = ''
        this.appId = ''
      }
    },
    url: function () {
      this.url = this.url.replace(' ', '')
    },
    icon: function () {
      this.icon = this.icon.replace(' ', '')
    }
  },
  computed: {
    selectedApp () {
      return this.$store.state.apps.selectedApp
    },
    appTypes () {
      return AppTypes
    },
    keySecretComputed () {
      let value = this.keySecret
      if (this.isHide) {
        const valueArray = Array.from(value)
        const originValue = value
        value = ''
        for (var i = 1; i <= valueArray.length - 8; i++) {
          value += '*'
        }
        value += originValue.substr(valueArray.length - 8, 8)
      }
      return value
    },
    isPrivateApp () {
      return this.isPrivate ? 'My App is Private' : 'My App is Public'
    }
  },
  mounted () {
    if (this.selectedApp !== undefined) {
      this.editing = true
      this.appType = this.selectedApp.type
      if (this.selectedApp.type === this.appTypes.WEB_APP) {
        this.shortName = this.selectedApp.shortname
        this.name = this.selectedApp.name
        this.ownerAccount = this.selectedApp.ownerAccount
        this.appId = this.selectedApp.appId
        this.icon = this.selectedApp.icon
      } else if (this.selectedApp.type === this.appTypes.NON_WEB_APP) {
        this.shortName = this.selectedApp.shortname
        this.name = this.selectedApp.name
        this.ownerAccount = this.selectedApp.ownerAccount
        this.appId = this.selectedApp.appId
        this.icon = this.selectedApp.icon
      }
    } else {
      this.appType = this.appTypes.WEB_APP
    }
  },
  beforeDestroy () {
    this.$store.commit('apps/setSelectedApp', undefined)
  },
  methods: {
    ...mapActions('apps', ['registerApp']),
    successLoadIcon () {
      this.iconLoaded = true
      this.$refs.inputImage.resetValidation()
    },
    errorLoadIcon () {
      this.iconLoaded = false
      this.$refs.inputImage.resetValidation()
    },
    async onSubmit () {
      this.showIsLoading(true)
      let response
      try {
        if (this.appType === this.appTypes.WEB_APP) {
          response = await this.registerApp({
            baseUrl: this.url,
            appId: this.appId,
            type: this.appType,
            oauthRedirectUrls: this.redirectionURL,
            isPrivate: this.isPrivate
          })
        } else if (this.appType === this.appTypes.NON_WEB_APP) {
          console.log('NON WEB APP TYPE', this.shortName)
          response = await this.registerApp({
            shortname: this.shortName,
            name: this.name,
            icon: this.icon,
            type: this.appType,
            appId: this.appId,
            oauthRedirectUrls: this.redirectionURL,
            isPrivate: this.isPrivate
          })
          console.log('AFTER REGISTER APP', this.shortName)
        }

        console.log('form', response)
        const { shortname, name, ownerAccount, appId, icon } = response

        this.shortName = shortname
        this.name = name
        this.ownerAccount = ownerAccount
        this.appId = appId
        this.icon = icon

        this.showIsLoading(false)

        this.showSuccessMsg('Submitted')
        this.$router.push({ path: '/profiles/appList' })
      } catch (e) {
        console.log('ErrorForm', e)
        this.showErrorMsg(e.message)
        this.showIsLoading(false)
      }
    },
    validationURL () {
      var regex = new RegExp(CustomRegex.URL)

      if (this.url.match(regex)) {
        return true
      } else {
        return 'URL not valid'
      }
    },
    validateRedirectionURL (val, done) {
      // specific logic to eventually call done(...) -- or not
      console.log('Validando redirecciones', val)
      var regex = new RegExp(CustomRegex.URL)

      if (val.match(regex) || val === '') {
        this.redirectionValid = true
        done(val)
      } else {
        this.redirectionValid = false
      }

      // done callback has two optional parameters:
      //  - the value to be added
      //  - the behavior (same values of new-value-mode prop,
      //    and when it is specified it overrides that prop –
      //    if it is used); default behavior (if not using
      //    new-value-mode) is to add the value even if it would
      //    be a duplicate
    }
    // validationEMAIL () {
    //   var regex = new RegExp(CustomRegex.EMAIL)
    //   if (this.email.match(regex)) {
    //     return true
    //   } else {
    //     return 'Email address not valid'
    //   }
    // },
    // validationSMS () {
    //   if (this.methodComm === 'sms') {
    //     return (
    //       (this.smsNumber && this.smsNumber.length > 0) ||
    //       'Please type something'
    //     )
    //   }
    // }
  }
}
</script>

<style lang="sass">
.appIcon
  width: 100%
  max-width: 100px
  border: solid 0.01px
  border-color: black
.errorURL
  color: red
</style>
