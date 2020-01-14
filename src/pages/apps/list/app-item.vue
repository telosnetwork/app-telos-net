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
           span.text-weight-medium {{$t('pages.registerApp.form.appType')}} {{': '}}
           span.text-grey-8 {{App.type}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('pages.registerApp.form.appId')}} {{': '}}
           span.text-grey-8 {{App.appId}}
          q-item-label(lines='1')
           span.text-grey-8 {{ isPrivateComputed }}
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
  computed: {
    isPrivateComputed () {
      return (this.App.isPrivate) ? this.$t('pages.general.private') : this.$t('pages.general.public')
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
