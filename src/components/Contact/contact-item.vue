<template lang="pug">
    q-item(v-ripple)
        q-item-section(avatar)
            q-avatar(size="80px")
                S3Img(v-if="contact.publicData.profileImage !== null", :img-key='contact.publicData.profileImage', :identity='contact.publicData.identity')
                img(src="https://cdn.quasar.dev/img/boy-avatar.png")
        q-item-section
            q-item-label {{contact.eosAccount}}
            q-item-label(caption='', lines='1') {{contact.publicData.firstName}} {{contact.publicData.lastName}}
            q-item-label(caption='', lines='1') {{contact.email}}
            q-item-label(caption, lines='2') {{contact.publicData.countryCode}}
        q-item-section(side)
            //- q-icon(name='fiber_manual_record', color='green')
            q-btn(icon='chat', round, color='green')
</template>

<script>
import S3Img from '~/components/s3-image'
export default {
  name: 'contact-item',
  props: {
    contact: Object
  },
  components: { S3Img }
}
</script>

<style scoped>
.container {
    width: 100%;
}

</style>
