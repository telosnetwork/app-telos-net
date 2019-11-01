<template lang="pug">
    profile-detail(owner=true)
</template>

<script>
import ProfileDetail from '~/pages/profiles/read/profile-detail'
import { mapActions } from 'vuex'
export default {
  name: 'my-profile',
  components: { ProfileDetail },
  async beforeMount () {
    await this.getProfile()
  },
  methods: {
    ...mapActions('profiles', ['getProfile'])
  }
}
</script>
