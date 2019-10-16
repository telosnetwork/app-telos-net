<template lang="pug">
 main
  q-input.send-input(@keypress="onSearch($event)", standout='bg-teal text-white', bottom-slots, v-model='search', label='Search', counter)
    template(v-slot:append)
      q-btn(round, dense, flat, icon='search', @click='onSearch')
  .q-pa-md.infiniteScroll(ref='scrollTargetRef')
    q-infinite-scroll(@load='onLoad', :offset='250', :scroll-target='$refs.scrollTargetRef', ref='infiniteScroll')
      template(slot='loading')
        .row.justify-center.q-my-md
          q-spinner(color='primary', name='dots', size='40px')
      .caption.q-py-sm(v-for='(profile, index) in profileList.items', :key='index')
        .row.justify-center
          .col-xs-10.col-sm-8.col-md-6
            q-list(bordered)
              ContactItem(:contact="profile")
</template>

<script>
import ContactItem from '../components/Contact/contact-item.vue'
import { mapActions } from 'vuex'
export default {
  name: 'ContactList',
  components: { ContactItem },
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}],
      search: null,
      isMore: false
    }
  },
  beforeDestroy: function () {
    this.clearProfilesList()
  },
  computed: {
    profileList () {
      return this.$store.state.profiles.profilesList
    }
  },
  methods: {
    ...mapActions('profiles', ['searchProfiles', 'clearProfilesList']),
    async onLoad (index, done) {
      if ((this.profileList.lastEvaluatedKey !== undefined && this.profileList.count === 1) || this.profileList.items.length === 0) {
        await this.searchProfiles({ search: this.search, lastEvaluatedKey: this.profileList.lastEvaluatedKey })
        done()
      } else this.$refs.infiniteScroll.stop()
    },
    async onSearch (v) {
      if (v.type === 'click') {
        // await this.searchProfiles({ search: this.search, clean: true })
        this.clearProfilesList()
        this.$refs.infiniteScroll.reset()
        this.$refs.infiniteScroll.resume()
        v.preventDefault()
      } else {
        if (v.key === 'Enter') {
          // await this.searchProfiles({ search: this.search, clean: true, lastEvaluatedKey: this.profileList.lastEvaluatedKey })
          this.clearProfilesList()
          this.$refs.infiniteScroll.reset()
          this.$refs.infiniteScroll.resume()
          v.preventDefault()
        }
      }
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
