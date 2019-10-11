<template lang='pug'>
  main
    q-chip.headerContent
      q-avatar.avatarHeader
        img(src='https://cdn.quasar.dev/img/avatar5.jpg')
      strong Jane Judith
    .q-pa-md.infiniteScroll(ref='scrollTargetRef')
      q-infinite-scroll(@load='onLoad', reverse='', :offset='250', :scroll-target='$refs.scrollTargetRef')
        template(slot='loading')
          .row.justify-center.q-my-md
            q-spinner(color='primary', name='dots', size='40px')
        .caption.q-py-sm(v-for='(item, index) in items', :key='index')
          .q-pa-md.row.justify-center
            ChatItem
    q-input.send-input(standout='bg-teal text-white', bottom-slots='', v-model='message', label='Message', counter='')
      template(v-slot:append='')
        q-btn(round='', dense='', flat='', icon='send', @click='sendMessage')
</template>

<script>
import { ChatItem } from '../components/Chat'
export default {
  name: 'Chat',
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}],
      message: null
    }
  },
  methods: {
    onLoad (index, done) {
      setTimeout(() => {
        if (this.items) {
          this.items.splice(
            0,
            0,
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
          )
          done()
        }
      }, 2000)
    },
    sendMessage (v) {
      console.log(this.message)
      this.message = null
    }
  },
  components: {
    ChatItem
  }
}
</script>

<style scoped>
.infiniteScroll {
  width: 100%;
  height: calc(100vh - 210px);
  max-width: 100%;
  /* background-color: burlywood; */
  overflow: scroll;
}
.pt {
  height: calc(100% - 300px);
  max-width: 100%;
  background-color: brown;
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
