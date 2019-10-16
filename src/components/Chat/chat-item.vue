<template lang="pug">
    q-item(clickable, v-ripple)
        q-item-section(side)
            q-avatar(rounded, size='48px')
                //- img(src='https://cdn.quasar.dev/img/avatar.png')
                S3Img(:img-key='Chat.counterParty.profileImage', :identity='Chat.counterParty.s3Identity' )
                q-badge(floating, color='teal') new
        q-item-section
            q-item-label {{ Chat.counterPartyAccount }}
            q-item-label(caption) {{ Chat.subject }}
        q-item-section(side) 4 min ago
</template>

<script>
import S3Img from '~/components/s3-image'
export default {
  name: 'message-item',
  props: {
    Chat: Object
  },
  components: { S3Img }
}
</script>
