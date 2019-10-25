<template lang="pug">
  q-card
    q-item.q-pa-md(v-ripple, clickable,  @click='goToAppDetail')
        q-item-section(avatar)
            q-avatar(size="80px")
                img(:src='App.icon')
        q-item-section
          q-item-label(lines='1')
           span.text-weight-medium {{$t('components.registerApp.form.name')}} {{': '}}
           span.text-grey-8 {{App.name}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('components.registerApp.form.ownerAccount')}} {{': '}}
           span.text-grey-8 {{App.ownerAccount}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('components.general.domain')}} {{': '}}
           span.text-grey-8 {{App.domain}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('components.registerApp.form.appId')}} {{': '}}
           span.text-grey-8 {{App.appId}}
          q-item-label(lines='1')
           span.text-weight-medium {{$t('components.registerApp.form.shortName')}} {{': '}}
           span.text-grey-8 {{App.shortname}}
</template>

<script>
export default {
  name: 'app-item',
  props: {
    App: Object
  },
  methods: {
    goToAppDetail () {
      this.$store.commit('apps/setSelectedApp', this.App)
      this.$router.push({ name: 'registerApp' })
    }
  }
}
</script>

<style scoped lang='sass'>
.container
    width: 100%;
</style>
