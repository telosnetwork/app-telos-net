<template lang="pug">
  q-img(
    :src="url"
    ratio="1"
  )
</template>

<script>
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
    },
    identity: async function (val) {
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
      this.url = ''
      if (this.imgKey && this.identity) {
        await PPP.profileApi().getAvatarUrl(this.imgKey, this.identity).then((rUrl) => {
          this.url = rUrl
        })
      }
    }
  }
}
</script>
