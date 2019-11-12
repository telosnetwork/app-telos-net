<template lang="pug">
    main
        p Loading...
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'profile-login',
  async mounted () {
    this.showIsLoading(true)
    const isLogged = await this.loginToBackend()
    if (isLogged) {
      const returnUrl = this.$route.query.returnUrl
      console.log(returnUrl)
      this.$router.push({ path: returnUrl || '/profiles/myProfile' })
    }
    this.showIsLoading(false)
  },
  methods: {
    ...mapActions('accounts', ['loginToBackend'])
  }
}
</script>
