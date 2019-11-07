<template lang="pug">
  q-card(:class="{ own: isOwn }")
    q-item.q-pa-md(v-ripple, clickable,  @click='goToProfileDetail')
        q-item-section(avatar)
            q-avatar(size="80px")
              S3Img(v-if="contact.publicData.profileImage !== null", :img-key='contact.publicData.profileImage', :identity='contact.publicData.s3Identity')
        q-item-section
            q-item-label {{contact.eosAccount}}
            q-item-label(caption='', lines='1') {{contact.publicData.firstName}} {{contact.publicData.lastName}}
            q-item-label(caption='', lines='1') {{contact.email}}
            q-item-label(caption, lines='2') {{contact.publicData.countryCode}}
        q-item-section(side, v-if="!isOwn && contact.publicData.isVerified && contact.publicData.isVerified !== 0")
            q-btn.side-btn(icon='chat',size="1.1rem", round, color='green' @click='goToChat')
        q-item-section(side, v-if="isOwn && contact.publicData.isVerified && contact.publicData.isVerified !== 0")
            q-btn.side-btn(icon='edit',size="1.1rem", round, color='green' @click='goToEditOwnProfile')
        q-item-section(side, v-if="!contact.publicData.isVerified || contact.publicData.isVerified === 0")
            q-item-label(caption='', lines='1') Is not verified
</template>

<script>
import S3Img from '~/components/s3-image'
export default {
  name: 'contact-item',
  props: {
    contact: Object
  },
  components: { S3Img },
  computed: {
    isOwn () {
      if (this.$store.state.profiles.myProfile.eosAccount === this.contact.eosAccount) {
        return true
      } else return false
    }
  },
  methods: {
    goToChat () {
      this.$store.commit('messages/setActiveChat', { activeChat: this.contact.eosAccount, profileImage: this.contact.publicData.profileImage, s3Identity: this.contact.publicData.s3Identity })
      this.$router.push({ name: 'chat' })
    },
    goToProfileDetail () {
      this.$store.commit('profiles/setSelectedProfile', this.contact)
      if (this.isOwn) {
        this.$router.push({ name: 'myProfile' })
      } else this.$router.push({ name: 'profileDetail' })
    },
    goToEditOwnProfile () {
      this.$router.push({ path: '/profiles/myProfile/add' })
    }
  }
}
</script>

<style scoped lang='sass'>
.container
    width: 100%;
.own
  border: solid 2px green

.side-btn
  z-index: 100
</style>
