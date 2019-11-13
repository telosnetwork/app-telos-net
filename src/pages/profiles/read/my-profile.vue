<template lang="pug">
    profile-detail(owner=true)
</template>

<script>
import ProfileDetail from '~/pages/profiles/read/profile-detail'
import { mapActions } from 'vuex'
export default {
  name: 'my-profile',
  components: { ProfileDetail },
  methods: {
    ...mapActions('profiles', ['getProfile'])
  }
}
</script>
