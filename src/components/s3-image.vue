<template lang="pug">
  q-img(
    :src="url"
  )
</template>

<script>
// import { amplify-s3-image } from 'aws-amplify-vue'
import PPP from '@smontero/ppp-client-api'
export default {
  name: 's3-image',
  props: {
    imgKey: String,
    identity: String
  },
  watch: {
    imgKey: async function (val) {
      this.updateUrl()
    }
  },
  async created () {
    this.updateUrl()
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    async updateUrl () {
      if (this.imgKey && this.identity) {
        this.url = await PPP.profileApi().getAvatarUrl(this.imgKey, this.identity)
      }
    }
  }
}
</script>
