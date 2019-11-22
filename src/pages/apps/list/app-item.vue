<template lang="pug">
main
  confirm-dialog(
    :show.sync="showConfirm",
    @Confirmed="deleteMyApp",
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
           span.text-weight-medium {{$t('pages.registerApp.form.ownerAccount')}} {{': '}}
           span.text-grey-8 {{App.ownerAccount}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.general.domain')}} {{': '}}
           span.text-grey-8 {{App.domain}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.registerApp.form.appId')}} {{': '}}
           span.text-grey-8 {{App.appId}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.registerApp.form.shortName')}} {{': '}}
           span.text-grey-8 {{App.shortname}}
        q-item-section(side)
          q-btn.side-btn(icon='delete',size="1.1rem", round, color='red', @click="showConfirm = true")
</template>

<script>
import ConfirmDialog from '~/components/confirm-dialog'
import { mapActions } from 'vuex'
export default {
  name: 'app-item',
  props: {
    App: { type: Object, required: true }
  },
  components: { ConfirmDialog },
  data () {
    return {
      showConfirm: false
    }
  },
  methods: {
    ...mapActions('apps', ['deleteApp']),
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
    cancelDelete () {
      alert('Canceled')
    }
  }
}
</script>

<style scoped lang='sass'>
.container
    width: 100%;
</style>
