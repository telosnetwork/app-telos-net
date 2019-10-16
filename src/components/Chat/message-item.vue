<template lang="pug">
.content-message
    q-chat-message(v-show="account === message.senderAccount", name='me', :text="[message.message]", stamp='7 minutes Ago', sent, bg-color='amber-7')
    q-chat-message(v-show="account !== message.senderAccount", name='Jane', :text="[message.message]", stamp='10 minutes ago', text-color='white', bg-color='primary')
    //- q-chat-message(name='Jane', avatar='https://cdn.quasar.dev/img/avatar5.jpg', :text="['doing fine, how r you?']", stamp='4 minutes ago', text-color='white', bg-color='primary')
</template>

<script>
import S3Img from '../s3-image'
export default {
  name: 'chat-item',
  props: {
    message: Object
  },
  components: {
    S3Img
  },
  computed: {
    account () {
      return this.$store.state.accounts.account
    }
  }
}
</script>
