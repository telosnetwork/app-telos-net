<template lang="pug">
main
  confirm-dialog(
    :show.sync="showConfirm",
    @Confirmed="revokeAccessToApp",
  )
    template(v-slot:body)
      .text-h6 {{ $t('pages.registerApp.form.confirmDeleteApp') }}
  q-card
    q-item.q-pa-md(v-ripple, clickable)
        q-item-section(avatar)
            q-avatar(size="80px")
              q-img(:src='App.icon', :ratio='1')
        q-item-section(clickable,  @click='goToAppDetail')
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.registerApp.form.name')}} {{': '}}
           span.text-grey-8 {{App.name}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.registerApp.form.appType')}} {{': '}}
           span.text-grey-8 {{App.type}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.registerApp.form.appId')}} {{': '}}
           span.text-grey-8 {{App.appId}}
          q-item-label(lines='1')
           span.text-grey-8 {{ isPrivateComputed }}
        q-item-section(side)
          q-btn(color="red", :label="$t('pages.registerApp.form.revokeAccess')" @click="showConfirm = true")
    q-expansion-item(
        caption="Scopes"
        v-for='(scope, index) in Scopes', :key='index'
    )
      q-item-section.q-px-md
        //- span.text-weight-medium {{$t('pages.registerApp.form.appId')}} {{': '}}
        span.text-grey-8 - {{scope}}
</template>

<script>
// oauthAppStatus
import ConfirmDialog from '~/components/confirm-dialog'
import { OauthAppStatus } from '@smontero/ppp-common'
import { mapActions } from 'vuex'
export default {
  name: 'authorized-app-item',
  props: {
    AuthorizedApp: { type: Object, required: true }
  },
  components: { ConfirmDialog },
  mounted () {
    this.oauthAppStatus_.value = this.App.oauthAppStatus
    this.calculateOauthAppStatus()
  },
  data () {
    return {
      showConfirm: false,
      oauthAppStatus_: {
        value: '',
        dislpay: ''
      }
    }
  },
  computed: {
    isPrivateComputed () {
      return (this.App.isPrivate) ? this.$t('pages.general.private') : this.$t('pages.general.public')
    },
    App () {
      return this.AuthorizedApp.app
    },
    Scopes () {
      return this.AuthorizedApp.scopes
    }
  },
  watch: {
    'oauthAppStatus_.dislpay' (newValue) {
      this.oauthAppStatus_.value = (newValue) ? OauthAppStatus.ENABLED : OauthAppStatus.DISABLED_BY_APP
    }
  },
  methods: {
    ...mapActions('apps', ['deleteApp']),
    goToAppDetail () {
      // this.$store.commit('apps/setSelectedApp', this.App)
      // this.$router.push({ name: 'registerApp' })
    },
    async revokeAccessToApp () {
      this.showIsLoading(true)
      try {
        await this.deleteApp({ appId: this.App.appId })
        this.showSuccessMsg('Revoked')
        this.showIsLoading(false)
        this.$emit('Revoked', true)
      } catch (e) {
        this.showIsLoading(false)
        this.showErrorMsg(e.message)
      }
    },
    cancelDelete () {
      alert('Canceled')
    },
    calculateOauthAppStatus () {
      switch (this.oauthAppStatus_.value) {
        case OauthAppStatus.ENABLED:
          this.oauthAppStatus_.dislpay = true
          break
        case OauthAppStatus.DISABLED_BY_APP:
          this.oauthAppStatus_.dislpay = false
          break
        case OauthAppStatus.DISABLED_BY_SERVER:
          this.oauthAppStatus_.dislpay = false
          break
        default:
          this.oauthAppStatus_.dislpay = false
          break
      }
    }
  }
}
</script>

<style scoped lang='sass'>
.container
    width: 100%;
</style>
