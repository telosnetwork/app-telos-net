<template lang='pug'>
.row.justify-center.items-center.q-col-gutter-y-md.q-pa-md
  .col-xs-8
    .column
      q-img.appIcon.self-center(:src='icon')
    q-form.q-col-gutter-y-md.q-mt-xs(@submit='onSubmit')
      q-input(filled, v-model='url', :label="$t('pages.registerApp.form.urlBase')", :hint="$t('pages.registerApp.form.urlBase')" :rules='[ validationURL ]')
      q-input(filled, v-model='name', readonly, :label="$t('pages.registerApp.form.name')")
      q-input(filled, v-model='appId', readonly, :label="$t('pages.registerApp.form.appId')")
      q-input(filled, v-model='shortName', readonly, :label="$t('pages.registerApp.form.shortName')")
      q-input(filled, v-model='ownerAccount', readonly, :label="$t('pages.registerApp.form.ownerAccount')")
      div
        q-btn(label='Submit', type='submit', color='primary')
</template>

<script>
import { CustomRegex } from '~/const'
import { mapActions } from 'vuex'
import { utils } from '~/mixins/utils'
export default {
  name: 'register-app-form',
  mixins: [utils],
  data () {
    return {
      url: '',
      shortName: '',
      ownerAccount: '',
      appId: '',
      icon: '',
      name: ''
    }
  },
  computed: {
    selectedApp () {
      return this.$store.state.apps.selectedApp
    }
  },
  beforeMount () {
    if (this.selectedApp !== undefined) {
      this.shortName = this.selectedApp.shortname
      this.name = this.selectedApp.name
      this.ownerAccount = this.selectedApp.ownerAccount
      this.appId = this.selectedApp.appId
      this.icon = this.selectedApp.icon
    }
  },
  beforeDestroy () {
    this.$store.commit('apps/setSelectedApp', undefined)
  },
  methods: {
    ...mapActions('apps', ['registerApp']),
    onSubmit () {
      this.$store.commit('profiles/setPPPLoading', true)
      this.registerApp({
        baseUrl: this.url,
        appId: this.appId
      }).then(response => {
        console.log('form', response)
        this.shortName = response.shortname
        this.name = response.name
        this.ownerAccount = response.ownerAccount
        this.appId = response.appId
        this.icon = response.icon

        this.$store.commit('profiles/setPPPLoading', false)

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }).catch(e => {
        console.log('ErrorForm', e)
        this.showNotification(e.message, 'error')
        this.$store.commit('profiles/setPPPLoading', false)
      })
    },
    validationURL () {
      var regex = new RegExp(CustomRegex.URL)

      if (this.url.match(regex)) {
        return true
      } else {
        return 'URL not valid'
      }
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
</style>
