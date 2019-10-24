<template lang='pug'>
 main
  q-input.send-input(@keypress.enter="onSearch", standout='bg-teal text-white', bottom-slots, v-model='search', :label="$t('components.general.search')", counter)
    template(v-slot:append='')
      q-btn(round='', dense='', flat='', icon='search', @click='onSearch')
  .q-pa-md.infiniteScroll(ref='scrollTargetRef')
    q-infinite-scroll(@load='onLoad', :offset='250', :scroll-target='$refs.scrollTargetRef', ref="infiniteScroll")
      template(slot='loading')
        .row.justify-center.q-my-md
          q-spinner(color='primary', name='dots', size='40px')
      template(slot='default')
        .row.justify-center.q-my-md(v-show="chatList.items.length === 0")
          p.text-weight-thin {{ $t('components.general.defaultChatList') }}
      .caption.q-py-sm(v-for='(chat, index) in chatList.items', :key='index')
        ChatItem(:Chat='chat')
</template>

<script>
import ChatItem from '~/pages/chats/list/chat-item'
import { mapActions } from 'vuex'
export default {
  name: 'chat-list',
  components: { ChatItem },
  data () {
    return {
      search: null,
      limit: 1,
      isFirst: true
    }
  },
  computed: {
    chatList () {
      return this.$store.state.messages.chatList
    }
  },
  beforeDestroy: function () {
    this.clearChatList()
  },
  methods: {
    ...mapActions('messages', ['getChats', 'clearChatList']),
    async onLoad (index, done) {
      if ((this.chatList.lastEvaluatedKey !== undefined && this.chatList.count === this.limit) || this.isFirst) {
        await this.getChats({ search: this.search, limit: this.limit, lastEvaluatedKey: this.chatList.lastEvaluatedKey })
        if (this.isFirst) this.isFirst = false
        done()
      } else this.$refs.infiniteScroll.stop()
    },
    async onSearch (v) {
      // await this.getChats({ search: this.search, clean: true })
      this.clearChatList()
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      v.preventDefault()
    }
  }
}
</script>

<style scoped lang='sass'>
.infiniteScroll
  width: 100%;
  height: calc(100vh - 200px);
  max-width: 100%;
  /* background-color: burlywood; */
  overflow: scroll;

.content-message
  width: 100%;

.avatarHeader
  width: 70px;
  height: 70px;

.headerContent
  margin-top: 20px;
  margin-left: 10px;
  height: 40px;

.send-input
  margin: 10px;

@media screen and (min-width: 700px)
  .content-message
    width: 80%;

@media screen and (min-width: 1200px)
  .content-message
    width: 50%;
    margin-left: 100px;
    margin-right: 100px;
</style>
