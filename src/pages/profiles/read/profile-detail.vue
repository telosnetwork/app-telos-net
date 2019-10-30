<template lang="pug">
main.column.items-center.back(v-if="this.Profile")
    q-card.my-card
      q-card-section
        .column.items-center
          q-avatar.col(size='200px')
              S3Img(:img-key='this.Profile.publicData.profileImage', :identity='this.Profile.publicData.s3Identity' )
          p.text-h4 {{ ` ${this.Profile.eosAccount}` }}
      //- q-separator(spaced, inset)
      q-card-section.q-ma-md
        q-list(padding, separator)
          q-item.q-mx-md
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='account_circle')
            q-item-section
              q-item-label {{ $t('pages.general.name') }}
              q-item-label(caption) {{ fullName }}
          q-item.q-mx-md
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='short_text')
            q-item-section
              q-item-label {{ $t('pages.signUp.form.presentation') }}
              q-item-label(caption) {{ this.Profile.publicData.bio }}
          q-item.q-mx-md
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='flag')
            q-item-section
              q-item-label {{ $t('pages.signUp.form.country') }}
              q-item-label(caption) {{ this.Profile.publicData.countryCode }}
          q-item.q-mx-md
            q-item-section(top, thumbnail)
              q-icon(color='primary', name='games')
            q-item-section
              q-item-label {{ $t('pages.signUp.form.hobbies') }}
              q-item-label(caption) {{ this.Profile.publicData.hobbies.join(', ') }}
          q-item.q-mx-md(v-if='owner && this.Profile.emailInfo.exists')
              q-item-section(top, thumbnail)
                q-icon(color='primary', name='email')
              q-item-section
                q-item-label {{ $t('pages.signUp.form.email') }}
                q-item-label(caption) {{ this.Profile.emailInfo.mask }}
              q-item-section.col.col-xs-5.gt-xs(v-if='this.Profile.emailInfo.needsToVerify',side)
                q-btn(color="orange" icon-right="fas fa-user-check" label="Verify email" to='/profiles/myProfile/verify')
          q-item.row.q-mx-md(v-if='owner && this.Profile.smsInfo.exists')
              q-item-section(top, thumbnail)
                q-icon(color='primary', name='sms')
              q-item-section
                q-item-label {{ $t('pages.signUp.form.sms') }}
                q-item-label(caption) {{ this.Profile.smsInfo.mask }}
              q-item-section.col.col-xs-5.gt-xs(v-if='this.Profile.smsInfo.needsToVerify',side)
                q-btn(color="orange" icon-right="fas fa-user-check" label="Verify sms" to='/profiles/myProfile/verify')
          q-item.row.q-mx-md.lt-sm(v-if='owner && this.Profile.emailInfo.needsToVerify')
            q-item-section.col.col-xs-12.lt-sm(v-if='this.Profile.emailInfo.needsToVerify',side)
                q-btn.full-width(color="orange" icon-right="fas fa-user-check" label="Verify email" to='/profiles/myProfile/verify')
          q-item.row.q-mx-md.lt-sm(v-if='owner && this.Profile.smsInfo.needsToVerify')
            q-item-section.col.col-xs-12(v-if='this.Profile.smsInfo.needsToVerify',side)
                q-btn.full-width(color="orange" icon-right="fas fa-user-check" label="Verify sms" to='/profiles/myProfile/verify')
      .row.justify-end(v-if='owner')
        .col-2.fab-edit
          q-btn(fab icon='edit' color='primary' to="/profiles/myProfile/add")
</template>

<script>
import S3Img from '~/components/s3-image.vue'
export default {
  name: 'profile-detail',
  components: { S3Img },
  props: { owner: Boolean },
  computed: {
    Profile () {
      if (this.owner) {
        return this.$store.state.profiles.myProfile
      } else return this.$store.state.profiles.selectedProfile
    },
    fullName () {
      return `${this.Profile.publicData.firstName} ${this.Profile.publicData.lastName}`
    }
  },
  beforeCreate () {
    if (!this.$store.getters['profiles/isRegistered']) {
      this.$router.push({ name: 'userRegister' })
    }
  },
  beforeDestroy: function () {
    this.$store.commit('profiles/setSelectedProfile', [])
  }
}
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 100%
  height: 100vh

.back
  background: rgba(204,255,229,.4)
  height: 100vh

.fab-edit
  margin-right: 25px

@media screen and (min-width: 500px)
  .my-card
    width: 100%
    max-width: 70%
    height: 90vh
    margin-top: 20px

  .fab-edit
    margin-right: 2px
</style>
