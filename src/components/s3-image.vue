<template lang="pug">
  q-img(
    :src="url"
    ratio="1"
    :placeholder-src='defaultImage'
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
      url: '',
      defaultImage: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }
  },
  methods: {
    async updateUrl () {
      this.url = ''
      if (this.imgKey && this.identity) {
        await PPP.profileApi().getImageUrl(this.imgKey, this.identity).then((rUrl) => {
          this.url = rUrl
        })
      }
    }
  }
}
</script>
