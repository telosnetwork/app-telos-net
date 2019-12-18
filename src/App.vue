<script>
import { mapGetters } from 'vuex'
import appIcons from '~/utils/app-icons'

export default {
  name: 'App',
  computed: {
    ...mapGetters('accounts', ['isAutoLoading']),
    ...mapGetters('profiles', ['isPPPLoading']),
    ...mapGetters('general', ['isLoading', 'errorMsg', 'successMsg']),
    layout () {
      return `layout-${this.$route.meta.layout || 'main'}`
    }
  },
  watch: {
    errorMsg (msg) {
      console.log('error', msg)
      if (msg) {
        this.showNotification(msg, 'error')
        this.showErrorMsg(null)
      }
    },
    successMsg (msg) {
      if (msg) {
        this.showNotification(msg, 'success')
        this.showSuccessMsg(null)
      }
    },
    isLoading (value) {
      if (value) {
        this.$q.loading.show()
      } else {
        this.$q.loading.hide()
      }
    }
  },
  created () {
    this.$q.iconMapFn = (iconName) => {
      const icon = appIcons[iconName]
      if (icon !== void 0) {
        return { icon }
      }
    }
  }
}
</script>

<template lang="pug">
  .q-app
    component(:is="layout")
      router-view
    q-inner-loading(:showing="isAutoLoading || isPPPLoading")
      q-spinner(size="3em")
</template>
