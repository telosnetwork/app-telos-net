<script>
import { mapGetters, mapMutations } from 'vuex'
import { utils } from './mixins/utils'

export default {
  name: 'App',
  mixins: [utils],
  computed: {
    ...mapGetters('accounts', ['isAutoLoading']),
    ...mapGetters('profiles', ['isPPPLoading']),
    ...mapGetters('general', ['isLoading', 'errorMsg', 'successMsg']),
    layout () {
      return `layout-${this.$route.meta.layout || 'auth'}`
    }
  },
  watch: {
    errorMsg (msg) {
      if (msg) {
        this.showNotification(msg, 'error')
        this.setErrorMsg(null)
      }
    },
    successMsg (msg) {
      if (msg) {
        this.showNotification(msg, 'success')
        this.setSuccessMsg(null)
      }
    }
  },
  methods: {
    ...mapMutations('general', ['setErrorMsg', 'setSuccessMsg'])
  }
}
</script>

<template lang="pug">
  .q-app
    component(:is="layout")
      router-view
    q-inner-loading(:showing="isLoading || isAutoLoading || isPPPLoading")
      q-spinner(size="3em")
</template>
