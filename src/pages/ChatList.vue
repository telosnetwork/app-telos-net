<template lang='pug'>
 main
  q-input.send-input(@keypress="onSearch($event)", standout='bg-teal text-white', bottom-slots, v-model='search', label='Search', counter)
    template(v-slot:append='')
      q-btn(round='', dense='', flat='', icon='search', @click='onSearch')
  .q-pa-md.infiniteScroll(ref='scrollTargetRef')
    q-infinite-scroll(@load='onLoad', :offset='250', :scroll-target='$refs.scrollTargetRef', ref="infiniteScroll")
      template(slot='loading')
        .row.justify-center.q-my-md
          q-spinner(color='primary', name='dots', size='40px')
      .caption.q-py-sm(v-for='(chat, index) in chatList.items', :key='index')
        ChatItem(:Chat='chat')
</template>

<script>
import ChatItem from '~/components/Chat/chat-item'
import { mapActions } from 'vuex'
export default {
  name: 'ChatList',
  components: { ChatItem },
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}],
      search: null,
      limit: 1
    }
  },
  beforeDestroy: function () {
    this.clearChatList()
  },
  computed: {
    chatList () {
      return this.$store.state.profiles.chatList
    }
  },
  methods: {
    ...mapActions('profiles', ['getChats', 'clearChatList']),
    async onLoad (index, done) {
      if ((this.chatList.lastEvaluatedKey !== undefined && this.chatList.count === this.limit) || this.chatList.items.length === 0) {
        await this.getChats({ search: this.search, limit: this.limit, lastEvaluatedKey: this.chatList.lastEvaluatedKey })
        done()
      } else this.$refs.infiniteScroll.stop()
    },
    async onSearch (v) {
      if (v.type === 'click') {
        await this.getChats({ search: this.search, clean: true })
        this.clearChatList()
        this.$refs.infiniteScroll.reset()
        this.$refs.infiniteScroll.resume()
        v.preventDefault()
      } else {
        if (v.key === 'Enter') {
          await this.getChats({ search: this.search, clean: true, lastEvaluatedKey: this.profileList.lastEvaluatedKey })
          this.clearChatList()
          this.$refs.infiniteScroll.reset()
          this.$refs.infiniteScroll.resume()
          v.preventDefault()
        }
      }
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
