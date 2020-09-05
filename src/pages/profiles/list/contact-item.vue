<template lang="pug">
  q-card(:class="{ own: isOwn }")
    q-item.q-pa-md(v-ripple, clickable)
        q-item-section(avatar, clickable,  @click='goToProfileDetail')
            gravatar(size="80px" :avatar='contact.avatar' :account='contact.account_name')
        q-item-section(clickable,  @click='goToProfileDetail')
            q-item-label {{contact.account_name}}
            q-item-label(caption='', lines='1') {{contact.display_name}}
            q-item-label(caption='', lines='1' v-html='`Bio: ${contact.bio}`') Bio: {{contact.bio}}
            q-item-label(caption='', lines='1') Status: {{contact.status}}
</template>

<script>
// import S3Img from '~/components/s3-image'
import gravatar from '../gravatar'
import md5 from 'md5'
export default {
  name: 'contact-item',
  components: {
    gravatar
  },
  props: {
    contact: Object
  },
  computed: {
    isOwn () {
      if (this.$store.state.profiles.myProfile && (this.$store.state.profiles.myProfile.account_name === this.contact.account_name)) {
        return true
      } else return false
    },
    accountHash () {
      return md5(this.contact.account_name)
    }
  },
  methods: {
    goToChat () {
      this.$store.commit('messages/setActiveChat', { activeChat: this.contact.eosAccount, avatarImage: this.contact.publicData.avatarImage, s3Identity: this.contact.publicData.s3Identity })
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
