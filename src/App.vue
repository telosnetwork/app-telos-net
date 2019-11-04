<script>
import { mapGetters, mapMutations } from 'vuex'
import { utils } from './mixins/utils'

export default {
  name: 'App',
  mixins: [utils],
  computed: {
    ...mapGetters('accounts', ['isAutoLoading']),
    ...mapGetters('profiles', ['isPPPLoading']),
    ...mapGetters('general', ['error']),
    layout () {
      return `layout-${this.$route.meta.layout || 'auth'}`
    }
  },
  watch: {
    error (e) {
      if (e) {
        this.showNotification(e, 'error')
        this.setError(null)
      }
    }
  },
  methods: {
    ...mapMutations('general', ['setError'])
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
