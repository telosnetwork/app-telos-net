<template lang="pug">
    q-avatar(:size='size')
        img(v-if='avatar' :src='avatar')
        v-gravatar(v-if='!avatar' :hash='accountHash' default-img='retro')
</template>

<script>
import md5 from 'md5'
export default {
  name: 'gravatar',
  props: {
    size: String,
    avatar: String,
    account: String
  },
  computed: {
    accountHash () {
      return md5(this.account || '')
    }
  }
}
</script>
