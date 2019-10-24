<template lang="pug">
main.column.items-center.q-pa-md.back
    q-card.my-card
      q-card-section
        .column.items-center
          q-avatar.col(size='200px')
              S3Img(:img-key='this.selectedProfile.publicData.profileImage', :identity='this.selectedProfile.publicData.s3Identity' )
          p.text-h4 {{ ` ${this.selectedProfile.eosAccount}` }}
      //- q-separator(spaced, inset)
      q-card-section
        q-list(padding, separator)
          q-item
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='account_circle')
            q-item-section
              q-item-label {{ $t('components.general.name') }}
              q-item-label(caption) {{ fullName }}
          q-item
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='account_circle')
            q-item-section
              q-item-label {{ $t('components.signUp.form.presentation') }}
              q-item-label(caption) {{ this.selectedProfile.publicData.bio }}
          q-item
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='account_circle')
            q-item-section
              q-item-label {{ $t('components.signUp.form.country') }}
              q-item-label(caption) {{ this.selectedProfile.publicData.countryCode }}
          q-item
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='account_circle')
            q-item-section
              q-item-label {{ $t('components.signUp.form.hobbies') }}
              q-item-label(caption) {{ this.selectedProfile.publicData.hobbies.join() }}
</template>

<script>
import S3Img from '~/components/s3-image'
export default {
  name: 'profile-detail',
  components: { S3Img },
  beforeDestroy: function () {
    this.$store.commit('profiles/setSelectedProfile', [])
  },
  computed: {
    selectedProfile () {
      return this.$store.state.profiles.selectedProfile
    },
    fullName () {
      return `${this.selectedProfile.publicData.firstName} ${this.selectedProfile.publicData.lastName}`
    }
  }
}
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 70%
  height: 90vh

.back
  background: rgba(204,255,229,.4)

</style>
