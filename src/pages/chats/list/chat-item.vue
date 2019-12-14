<template lang="pug">
    q-item(clickable, v-ripple, @click='goToChat')
        q-item-section(side)
            q-avatar(rounded, size='48px')
                //- img(src='https://cdn.quasar.dev/img/avatar.png')
                S3Img(:img-key='Chat.counterParty.avatarImage', :identity='Chat.counterParty.s3Identity' )
                //- q-badge(floating, color='teal') new
        q-item-section
            q-item-label {{ Chat.counterPartyAccount }}
            q-item-label(caption) {{ Chat.subject }}
        q-item-section(side) {{ timeSent }}
</template>

<script>
import S3Img from '~/components/s3-image'
import TimeUtil from '~/utils/TimeUtil'
export default {
  name: 'message-item',
  props: {
    Chat: Object
  },
  components: { S3Img },
  computed: {
    timeSent () {
      return TimeUtil.formDateToChat(this.Chat.sentAt)
    }
  },
  methods: {
    goToChat () {
      this.$store.commit('messages/setActiveChat', { activeChat: this.Chat.counterPartyAccount, avatarImage: this.Chat.counterParty.avatarImage, s3Identity: this.Chat.counterParty.s3Identity })
      this.$router.push({ name: 'chat' })
    }
  }
}
</script>
