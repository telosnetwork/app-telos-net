<template lang="pug">
main
  croppa.radio(
    v-model="croppa",
    :width="200",
    :height="200",
    prevent-white-space,
    :image-border-radius="100",
    :initial-image="url",
    @init="onInit"
  )
  .row.justify-center
        q-btn(:loading='loadingFile', color='orange', text-color='grey-9', @click='$refs.btnUp.click()', icon='cloud_upload', style='width: 100px')
          input(ref='btnUp', label='btnUp', type='file', accept='image/png, image/jpeg', v-on:change='onFileChange', style='display: none;')

        q-btn(:loading='loadingFile', color='orange', text-color='grey-9', @click='upload', icon='start', style='width: 100px')
</template>

<script>
import 'vue-croppa/dist/vue-croppa.css'
import PPP from '@smontero/ppp-client-api'
// import croppa from 'vue-croppa'

export default {
  name: 'edit-image',
  props: {
    imgKey: String,
    identity: String
  },
  data: function () {
    return {
      url: '',
      croppa: {},
      loadingFile: false,
      mImgKey: '',
      mIdentity: ''
    }
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
  methods: {
    myEvent () {
      this.$emit('Change', {
        url: this.url,
        key: this.imgKey,
        identity: this.identity
      })
      // alert('hi')
    },
    async upload () {
      if (!this.croppa.hasImage()) {
        alert('no image to upload')
        return
      }
      this.croppa.generateBlob(async (blob) => {
        console.log(blob)
        const file = blob
        var fd = new FormData()
        fd.append('file', blob, 'filename.jpg')
        console.log(fd)
        console.log(file)
        // console.log('File changed!')
        const profileApi = PPP.profileApi()
        const authApi = PPP.authApi()
        const key = await profileApi.uploadAvatar(file)
        // console.log(key)
        const userInfo = await authApi.userInfo()
        // console.log(userInfo)
        const urlr = await profileApi.getAvatarUrl(key, userInfo.id)
        // console.log(url)
        this.url = urlr
        this.mImgKey = key
        this.mIdentity = userInfo.id
        this.loadingFile = false
        this.$emit('Change', {
          url: this.url,
          key: this.mImgKey,
          identity: this.mIdentity
        })
      })
    },
    async updateUrl () {
      this.url = ''
      if (this.imgKey && this.identity) {
        await PPP.profileApi().getAvatarUrl(this.imgKey, this.identity).then((rUrl) => {
          this.url = rUrl
          // this.$emit('Change', rUrl)
          var image = new Image()
          // Notice: it's necessary to set "crossorigin" attribute before "src" attribute.
          image.setAttribute('crossorigin', 'anonymous')
          image.src = rUrl
          this.url = image
          this.croppa.refresh()
        })
      }
    },
    onInit () {
      console.log(this.croppa)
      this.croppa.addClipPlugin(function (ctx, x, y, w, h) {
        /*
         * ctx: canvas context
         * x: start point (top-left corner) x coordination
         * y: start point (top-left corner) y coordination
         * w: croppa width
         * h: croppa height
        */
        console.log(x, y, w, h)
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    },
    async onFileChange (e) {
      this.loadingFile = true
      const file = e.target.files[0]
      console.log(file)
      // console.log('File changed!')
      const profileApi = PPP.profileApi()
      const authApi = PPP.authApi()
      const key = await profileApi.uploadAvatar(file)
      // console.log(key)
      const userInfo = await authApi.userInfo()
      // console.log(userInfo)
      const urlr = await profileApi.getAvatarUrl(key, userInfo.id)
      // console.log(url)
      this.url = urlr
      this.mImgKey = key
      this.mIdentity = userInfo.id
      this.loadingFile = false
    }
  }
}
</script>

<style lang="sass">
.radio
    border-radius: 200px !important
</style>
