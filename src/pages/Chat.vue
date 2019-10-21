<template lang='pug'>
  main
    q-chip.headerContent
      q-avatar.avatarHeader
        S3Img(:img-key='this.activeChat.profileImage', :identity='this.activeChat.s3Identity' )
      strong {{ this.activeChat.activeChat }}
    .q-pa-md.infiniteScroll(ref='scrollTargetRef')
      q-infinite-scroll(@load='onLoad', reverse='', :offset='250', :scroll-target='$refs.scrollTargetRef', ref='infiniteScroll')
        template(slot='loading')
          .row.justify-center.q-my-md
            q-spinner(color='primary', name='dots', size='40px')
        .caption.q-py-sm(v-for='(message, index) in messagesList.items', :key='index')
          .q-pa-md.row.justify-center
            MessageItem(:message='message')
    q-input.send-input(@keypress='sendMessageToChat($event)', standout='bg-teal text-white', bottom-slots='', v-model='message', label='Message', counter='')
      template(v-slot:append='')
        q-btn(round='', dense='', flat='', icon='send', @click='sendMessageToChat' )
</template>

<script>
import MessageItem from '~/components/Chat/message-item'
import S3Img from '~/components/s3-image'
import { mapActions } from 'vuex'
export default {
  name: 'Chat',
  components: { S3Img, MessageItem },
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}],
      message: null,
      limit: 5
    }
  },
  beforeDestroy: function () {
    this.clearMessagesList()
  },
  computed: {
    messagesList () {
      return this.$store.state.profiles.messagesList
    },
    activeChat () {
      return this.$store.state.profiles.activeChat
    }
  },
  methods: {
    ...mapActions('profiles', ['sendMessage', 'getMessages', 'clearMessagesList']),
    async onLoad (index, done) {
      if ((this.messagesList.items !== undefined && this.messagesList.count === this.limit) || this.messagesList.items.length === 0) {
        await this.getMessages({ eosAccount: this.activeChat.activeChat, limit: this.limit, 'lastEvaluatedKey': this.messagesList.lastEvaluatedKey })
        done()
      } else this.$refs.infiniteScroll.stop()
    },
    sendMessageToChat (v) {
      if (v.type === 'click') {
        this.sendMessage({ eosAccount: this.activeChat.activeChat, message: this.message })
        this.message = null
      } else if (v.key === 'Enter') {
        this.sendMessage({ eosAccount: this.activeChat.activeChat, message: this.message })
        this.message = null
      }
    }
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
