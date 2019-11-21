<template lang="pug">
 main
  .q-pa-md.infiniteScroll(ref='scrollTargetRef')
    q-infinite-scroll(@load='onLoad', :offset='250', :scroll-target='$refs.scrollTargetRef', ref='infiniteScroll')
      template(slot='loading')
        .row.justify-center.q-my-md
          q-spinner(color='primary', name='dots', size='40px')
      template(slot='default')
        .row.justify-center.q-my-md(v-show="!isLoading && myAppList.length === 0")
          p.text-weight-thin {{ $t('pages.general.defaultAppList') }}
      .caption.q-py-sm(v-for='(app, index) in myAppList', :key='index')
        .row.justify-center
          .col-xs-10.col-sm-8.col-md-6
            q-list(bordered)
              AppItem(:App="app", @Deleted="onAppDeleted")
</template>

<script>
import AppItem from '~/pages/apps/list/app-item.vue'
import { mapActions } from 'vuex'
export default {
  name: 'app-list',
  components: { AppItem },
  data () {
    return {
      search: null,
      limit: 10,
      isLoading: true
    }
  },
  computed: {
    myAppList () {
      return this.$store.state.apps.appList
    }
  },
  beforeDestroy: function () {
    this.clearMyAppList()
  },
  methods: {
    ...mapActions('apps', ['getMyApps', 'clearMyAppList']),
    async onLoad (index, done) {
      this.isLoading = true
      await this.getMyApps()
      this.isLoading = false
      this.$refs.infiniteScroll.stop()
    },
    async onSearch (v) {
      // await this.searchProfiles({ search: this.search, clean: true, lastEvaluatedKey: this.profileList.lastEvaluatedKey })
      this.clearProfilesList()
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      v.preventDefault()
    },
    onAppDeleted () {
      this.clearMyAppList()
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
    }
  }
}
</script>

<style scoped lang='sass'>
.infiniteScroll
  width: 100%
  height: calc(100vh - 200px)
  max-width: 100%

  /* background-color: burlywood;
  overflow: scroll

.content-message
  width: 100%

.avatarHeader
  width: 70px
  height: 70px

.headerContent
  margin-top: 20px
  margin-left: 10px
  height: 40px

.send-input
  margin: 10px

@media screen and (min-width: 700px)
  .content-message
    width: 80%

@media screen and (min-width: 1200px)
  .content-message
    width: 50%
    margin-left: 100px
    margin-right: 100px
</style>
