<template lang='pug'>
  main
    q-chip.headerContent
      q-avatar.avatarHeader
        S3Img(:img-key='this.activeChat.avatarImage', :identity='this.activeChat.s3Identity' )
      strong {{ this.activeChat.activeChat }}
    .q-pa-md.infiniteScroll(ref='scrollTargetRef')
      q-infinite-scroll(@load='onLoad', reverse='', :offset='250', :scroll-target='$refs.scrollTargetRef', ref='infiniteScroll', id='infiniteScroll')
        template(slot='loading')
          .row.justify-center.q-my-md
            q-spinner(color='primary', name='dots', size='40px')
        template(slot='default')
          .row.justify-center.q-my-md(v-if="messagesList.items.length === 0 && !isFirst")
            p.text-weight-thin {{ $t('pages.general.defaultMessageList') }}
        .caption.q-py-sm(v-for='(message, index) in messagesList.items', :key='index')
          .q-pa-md.row.justify-center
            MessageItem(:message='message')
    q-input.send-input(@keypress.enter='sendMessageToChat', standout='bg-teal text-white', :disable='sendingMessage', bottom-slots, v-model='message', label='Message', counter, ref='messageInput')
      template(v-slot:append)
        q-btn(v-show='!sendingMessage', round, dense, flat, icon='send', @click='sendMessageToChat' )
        q-spinner-comment(v-show='sendingMessage' , color='amber', size='2em')
</template>

<script>
import MessageItem from '~/pages/chats/list/message-item'
import S3Img from '~/components/s3-image'
import { mapActions } from 'vuex'
import { utils } from '~/mixins/utils'
export default {
  name: 'chat',
  components: { S3Img, MessageItem },
  mixins: [utils],
  data () {
    return {
      message: '',
      limit: 10,
      sendingMessage: false,
      isFirst: true
    }
  },
  computed: {
    messagesList () {
      return this.$store.state.messages.messagesList
    },
    activeChat () {
      return this.$store.state.messages.activeChat
    },
    eosAccount () {
      return this.$store.state.accounts.account
    }
  },
  mounted () {
    const messageInput = this.$refs.messageInput.$el
    messageInput.focus()
    messageInput.addEventListener('blur', function () {
      messageInput.focus()
    }, true)
  },
  beforeDestroy: function () {
    this.clearMessagesList()
  },
  methods: {
    ...mapActions('messages', ['sendMessage', 'getMessages', 'clearMessagesList']),
    async onLoad (index, done) {
      if ((this.messagesList.items !== undefined && this.messagesList.count === this.limit) || this.isFirst) {
        await this.getMessages({ eosAccount: this.activeChat.activeChat, limit: this.limit, 'lastEvaluatedKey': this.messagesList.lastEvaluatedKey })
        if (this.isFirst) this.isFirst = false
        done()
      } else this.$refs.infiniteScroll.stop()
    },
    async sendMessageToChat (v) {
      var container = this.$refs.infiniteScroll.$el
      const messageInput = this.$refs.messageInput.$el
      if (this.message === '') return
      if (!this.sendingMessage) {
        this.sendingMessage = true
        container.parentNode.scrollTop = container.clientHeight
        await this.sendMessage({ eosAccount: this.activeChat.activeChat, message: this.message, senderAccount: this.eosAccount }).then((v) => {
          container.parentNode.scrollTop = container.clientHeight
          this.sendingMessage = false
          messageInput.focus()
        }).catch(error => {
          this.sendingMessage = false
          this.showErrorMsg(error.message)
          messageInput.focus()
        })
        this.message = ''
        messageInput.focus()
        // this.message = null
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
