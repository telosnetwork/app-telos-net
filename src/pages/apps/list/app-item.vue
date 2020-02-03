<template lang="pug">
main
  //- Confirm to delete
  confirm-dialog(
    :show.sync="showConfirm",
    @Confirmed="deleteMyApp",
  )
    template(v-slot:body)
      .text-h6 {{ $t('pages.registerApp.form.confirmDeleteApp') }}
  //- Confirm to update
  confirm-dialog(
    :show.sync="showConfirmUpdate",
    @Confirmed="updateOauthStatus",
    @Canceled="cancelUpdateOauthStatus",
  )
    template(v-slot:body)
      .text-h6(v-if="oauthAppStatus_.display") {{ $t('pages.registerApp.form.confirmEnableApp') }}
      .text-h6(v-if="!oauthAppStatus_.display") {{ $t('pages.registerApp.form.confirmDisableApp') }}
  //- Card of content
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
          q-btn.side-btn(icon='delete',size="1.1rem", round, color='red', @click="showConfirm = true")
          q-toggle(
            label='OAuth'
            v-model="oauthAppStatus_.dislpay"
            checked-icon="lock"
            color="primary"
            unchecked-icon="public")
</template>

<script>
// oauthAppStatus
import ConfirmDialog from '~/components/confirm-dialog'
import { OauthAppStatus } from '@smontero/ppp-common'
import { mapActions } from 'vuex'
export default {
  name: 'app-item',
  props: {
    App: { type: Object, required: true }
  },
  components: { ConfirmDialog },
  mounted () {
    this.oauthAppStatus_.value = this.App.oauthAppStatus
    this.calculateOauthAppStatus()
  },
  data () {
    return {
      showConfirm: false,
      showConfirmUpdate: false,
      oauthAppStatus_: {
        value: '',
        dislpay: ''
      },
      mounted: false
    }
  },
  computed: {
    isPrivateComputed () {
      return (this.App.isPrivate) ? this.$t('pages.general.private') : this.$t('pages.general.public')
    }
  },
  watch: {
    'oauthAppStatus_.dislpay' (newValue) {
      this.oauthAppStatus_.value = (newValue) ? OauthAppStatus.ENABLED : OauthAppStatus.DISABLED_BY_APP
    },
    'oauthAppStatus_.value' (newValue) {
      if (this.mounted && this.oauthAppStatus_.value !== '') this.showConfirmUpdate = true
      if (!this.mounted) this.mounted = true
    }
  },
  methods: {
    ...mapActions('apps', ['updateMyAppOauthStatus', 'deleteApp']),
    goToAppDetail () {
      this.$store.commit('apps/setSelectedApp', this.App)
      this.$router.push({ name: 'registerApp' })
    },
    async deleteMyApp () {
      this.showIsLoading(true)
      try {
        await this.deleteApp({ appId: this.App.appId })
        this.showSuccessMsg('Deleted')
        this.showIsLoading(false)
        this.$emit('Deleted', true)
      } catch (e) {
        this.showIsLoading(false)
        this.showErrorMsg(e.message)
      }
    },
    async updateOauthStatus () {
      this.showIsLoading(true)
      try {
        await this.updateMyAppOauthStatus({ appId: this.App.appId, oauthSatus: this.oauthAppStatus_.dislpay })
        this.showSuccessMsg('Oauth Updated')
        this.showIsLoading(false)
        this.$emit('Deleted', true)
      } catch (e) {
        this.showIsLoading(false)
        this.showErrorMsg(e.message)
      }
    },
    cancelUpdateOauthStatus () {
      this.mounted = false
      this.oauthAppStatus_.dislpay = !this.oauthAppStatus_.value
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
