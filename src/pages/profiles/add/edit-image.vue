<template lang="pug">
main
  croppa.radio(
    v-model="croppa",
    :width="200",
    :height="200",
    prevent-white-space,
    :image-border-radius="100",
    :initial-image="url",
    @init="onInit",
    ref="myCroppa"
  )
  .row.justify-center
    q-btn(:loading='loadingFile', color='orange', text-color='grey-9', @click='choseImage', icon='edit', style='width: 100px')
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
      mIdentity: '',
      editingImage: false
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
    choseImage () {
      this.$refs.myCroppa.chooseFile()
    },
    getBlob () {
      const self = this
      return new Promise(function (resolve, reject) {
        try {
          console.log(self.croppa)
          self.croppa.generateBlob((blob) => {
            console.log('getBlob refs static')
            resolve(blob)
          })
        } catch (e) {
          reject(Error(e.message))
        }
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
        // console.log(x, y, w, h)
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    }
  }
}
</script>

<style lang="sass">
.radio
    border-radius: 200px !important
</style>
