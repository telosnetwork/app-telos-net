<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters('accounts', ['isAutoLoading']),
    layout () {
      return `layout-${this.$route.meta.layout || 'auth'}`
    }
  },
  async mounted () {
    await this.autoLogin()
  },
  methods: {
    ...mapActions('accounts', ['autoLogin'])
  }
}
</script>

<template lang="pug">
  .q-app
    component(:is="layout")
      router-view
    q-inner-loading(:showing="isAutoLoading")
      q-spinner(size="3em")
</template>
