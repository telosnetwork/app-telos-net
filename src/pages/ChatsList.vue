<template lang='pug'>
 main
  q-input.send-input(standout='bg-teal text-white', bottom-slots='', v-model='search', label='Search', counter='', debounce='1500')
    template(v-slot:append='')
      q-btn(round='', dense='', flat='', icon='search', @click='onSearch')
  .q-pa-md.infiniteScroll(ref='scrollTargetRef')
    q-infinite-scroll(@load='onLoad', reverse='', :offset='250', :scroll-target='$refs.scrollTargetRef')
      template(slot='loading')
        .row.justify-center.q-my-md
          q-spinner(color='primary', name='dots', size='40px')
      .caption.q-py-sm(v-for='(item, index) in items', :key='index')
        q-item(clickable='', v-ripple='')
          q-item-section(side='')
            q-avatar(rounded='', size='48px')
              img(src='https://cdn.quasar.dev/img/avatar.png')
              q-badge(floating='', color='teal') new
          q-item-section
            q-item-label Mary
            q-item-label(caption='') 2 new messages
          q-item-section(side='') 3 min ago
</template>

<script>
export default {
  name: 'ChatsList',
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}],
      search: null
    }
  },
  methods: {
    onLoad (index, done) {
      setTimeout(() => {
        if (this.items) {
          this.items.splice(0, 0, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})
          done()
        }
      }, 2000)
    },
    onSearch (v) {
      console.log(this.search)
      this.search = null
    }
  }
}
</script>

<style scoped>
.infiniteScroll {
  width: 100%;
  height: calc(100vh - 200px);
  max-width: 100%;
  /* background-color: burlywood; */
  overflow: scroll;
}
.content-message {
  width: 100%;
}

.avatarHeader {
  width: 70px;
  height: 70px;
}

.headerContent {
  margin-top: 20px;
  margin-left: 10px;
  height: 40px;
}

.send-input {
  margin: 10px;
}

@media screen and (min-width: 700px) {
  .content-message {
    width: 80%;
  }
}

@media screen and (min-width: 1200px) {
  .content-message {
    width: 50%;
    margin-left: 100px;
    margin-right: 100px;
  }
}
</style>
