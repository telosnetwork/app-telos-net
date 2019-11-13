<template lang="pug">
 main
  q-input.send-input(@keypress.enter="onSearch", standout='bg-teal text-white', bottom-slots, v-model='search', :label="$t('pages.general.search')", counter)
    template(v-slot:append)
      q-btn(round, dense, flat, icon='search', @click='onSearch')
  .q-pa-md.infiniteScroll(ref='scrollTargetRef')
    q-infinite-scroll(@load='onLoad', :offset='250', :scroll-target='$refs.scrollTargetRef', ref='infiniteScroll')
      template(slot='loading')
        .row.justify-center.q-my-md
          q-spinner(color='primary', name='dots', size='40px')
      template(slot='default')
        .row.justify-center.q-my-md(v-show="profileList.items.length === 0 && !isLoading")
          p.text-weight-thin {{ $t('pages.general.defaultContactList') }}
      .caption.q-py-sm(v-for='(profile, index) in profileList.items', :key='index')
        .row.justify-center
          .col-xs-10.col-sm-8.col-md-6
            q-list(bordered)
              ContactItem(:contact="profile")
</template>

<script>
import ContactItem from '~/pages/profiles/list/contact-item.vue'
import { mapActions } from 'vuex'
export default {
  name: 'contact-list',
  components: { ContactItem },
  data () {
    return {
      search: '',
      limit: 10,
      isLoading: true,
      isFirst: true
    }
  },
  computed: {
    profileList () {
      return this.$store.state.profiles.profilesList
    }
  },
  watch: {
    search () {
      this.isFirst = true
    }
  },
  beforeDestroy: function () {
    this.clearProfilesList()
  },
  methods: {
    ...mapActions('profiles', ['searchProfiles', 'clearProfilesList']),
    async onLoad (index, done) {
      if (this.isFirst || (this.profileList.lastEvaluatedKey !== undefined && this.profileList.count === this.limit)) {
        this.isFirst = false
        this.isLoading = true
        await this.searchProfiles({ search: this.search, limit: this.limit, lastEvaluatedKey: this.profileList.lastEvaluatedKey })
        this.isLoading = false
        done()
      } else {
        this.$refs.infiniteScroll.stop()
      }
    },
    async onSearch (v) {
      // await this.searchProfiles({ search: this.search, clean: true, lastEvaluatedKey: this.profileList.lastEvaluatedKey })
      this.clearProfilesList()
      this.isFirst = true
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      this.$refs.infiniteScroll.poll()
      // v.preventDefault()
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
