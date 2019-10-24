<template lang="pug">
  q-card
    q-item.q-pa-md(v-ripple, clickable,  @click='goToProfileDetail')
        q-item-section(avatar)
            q-avatar(size="80px")
                S3Img(v-if="contact.publicData.profileImage !== null", :img-key='contact.publicData.profileImage', :identity='contact.publicData.s3Identity')
        q-item-section
            q-item-label {{contact.eosAccount}}
            q-item-label(caption='', lines='1') {{contact.publicData.firstName}} {{contact.publicData.lastName}}
            q-item-label(caption='', lines='1') {{contact.email}}
            q-item-label(caption, lines='2') {{contact.publicData.countryCode}}
        q-item-section(side)
            //- q-icon(name='fiber_manual_record', color='green')
            q-btn(icon='chat', round, color='green' @click='goToChat')
</template>

<script>
import S3Img from '~/components/s3-image'
export default {
  name: 'contact-item',
  props: {
    contact: Object
  },
  components: { S3Img },
  methods: {
    goToChat () {
      this.$store.commit('messages/setActiveChat', { activeChat: this.contact.eosAccount, profileImage: this.contact.publicData.profileImage, s3Identity: this.contact.publicData.s3Identity })
      this.$router.push({ name: 'chat' })
    },
    goToProfileDetail () {
      this.$store.commit('profiles/setSelectedProfile', this.contact)
      this.$router.push({ name: 'profileDetail' })
    }
  }
}
</script>

<style scoped lang='sass'>
.container
    width: 100%;
</style>
