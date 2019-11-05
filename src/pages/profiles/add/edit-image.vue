<template>
<!-- croppa(prevent-white-space, @init="onInit", :width="250", :height="250", initial-image="https://zhanziyang.github.io/vue-croppa/static/500.jpeg") -->
<!-- img(slot='placeholder', :src='url') -->
    <croppa
    v-model="croppa"
    :width="250"
    :height="250"
    prevent-white-space
    :image-border-radius="100"
    :initial-image="url"
    @init="onInit"
    class="radio"
    >
    <img class="radio" slot="placeholder" :src="getUw"/>
  </croppa>
</template>

<script>
import 'vue-croppa/dist/vue-croppa.css'
import PPP from '@smontero/ppp-client-api'
// import croppa from 'vue-croppa'

export default {
  name: 'edit-name',
  props: {
    imgKey: String,
    identity: String
  },
  data: function () {
    return {
      url: '',
      croppa: {}
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
  computed: {
    getUw () {
      return this.url
    }
  },
  methods: {
    async updateUrl () {
      this.url = ''
      if (this.imgKey && this.identity) {
        await PPP.profileApi().getAvatarUrl(this.imgKey, this.identity).then((rUrl) => {
          this.url = rUrl
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
    }
  }
}
</script>

<style lang="sass">
.radio
    border-radius: 200px !important
</style>
