<template lang="pug">
.content-message
    q-chat-message(v-if="account === message.senderAccount", :text="[message.message]", :stamp='timeSent', sent, bg-color='amber-7')
    q-chat-message(v-if="account !== message.senderAccount", :text="[message.message]", :stamp='timeSent', text-color='white', bg-color='primary')
    //- q-chat-message(name='Jane', avatar='https://cdn.quasar.dev/img/avatar5.jpg', :text="['doing fine, how r you?']", stamp='4 minutes ago', text-color='white', bg-color='primary')
</template>

<script>
import S3Img from '~/components/s3-image'
import TimeUtil from '~/utils/TimeUtil'
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
    },
    timeSent () {
      return TimeUtil.formDateToChat(this.message.sentAt)
    }
  }
}
</script>
