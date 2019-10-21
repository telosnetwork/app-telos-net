<template lang="pug">
    main.column.items-center.q-pa-md
        q-avatar.col(size='200px')
            S3Img(:img-key='this.selectedProfile.publicData.profileImage', :identity='this.selectedProfile.publicData.s3Identity' )
        h2.col {{ `Perfil: ${this.selectedProfile.eosAccount}` }}
        #detail
            .row
                strong {{`Bio: `}}
                span {{ this.selectedProfile.publicData.bio }}
            .row
                strong {{`countryCode: `}}
                span {{ this.selectedProfile.publicData.countryCode }}
            .row
                strong {{`hobbies: `}}
                span {{ this.selectedProfile.publicData.hobbies.join() }}
</template>

<script>
import S3Img from '~/components/s3-image'
export default {
  name: 'ProfileDetail',
  components: { S3Img },
  beforeDestroy: function () {
    this.$store.commit('profiles/setSelectedProfile', [])
  },
  computed: {
    selectedProfile () {
      return this.$store.state.profiles.selectedProfile
    }
  }
}
</script>
