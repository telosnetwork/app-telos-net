<template lang="pug">
main.column.items-center.back(v-if="this.Profile")
    q-card.my-card
      q-card-section
        .column.items-center
          gravatar(size='200px' :avatar='this.Profile.avatar' :account='this.Profile.account_name')
      q-card-section
        .row.justify-center.q-gutter-x-md
          p.text-h4 {{ ` ${this.Profile.account_name}` }}
        .row.justify-center.q-gutter-x-md
          p.text-h6 {{ ` ${this.Profile.status}` }}
      q-card-section.q-mx-md
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
              //- q-item-label(caption) {{ this.Profile.bio }}
              q-item-label(caption, v-html='this.Profile.bio')
          q-select(
            v-if="!$i18n.locale",
            filled,
            v-model='$i18n.locale',
            label="Language",
            :options='langs',
          )

      .row.justify-end(v-if='owner')
        .col-2.fab-edit
          q-btn(fab icon='edit' color='primary' to="/profiles/myProfile/add")
</template>

<script>
// import { CommMethods } from '@smontero/ppp-common'
// import S3Img from '~/components/s3-image.vue'
// import { countriesLang } from '~/mixins/countries'
import { mapActions } from 'vuex'
import gravatar from '../gravatar'
export default {
  name: 'profile-detail',
  props: { owner: Boolean },
  components: {
    gravatar
  },
  computed: {
    Profile () {
      if (this.owner) {
        return this.$store.state.profiles.myProfile
      } else return this.$store.state.profiles.selectedProfile
    },
    missingProfile () {
      return this.owner && !this.$store.state.profiles.myProfile
    },
    fullName () {
      return this.Profile.display_name
    }
    /*
    verifySMSUrl () {
      return `/profiles/myProfile/verify/${CommMethods.SMS.value}`
    },
    verifyEmailUrl () {
      return `/profiles/myProfile/verify/${CommMethods.EMAIL.value}`
    },
    */
    /*
    tags () {
      if (this.Profile.publicData.tags) {
        return this.Profile.publicData.tags.join(', ')
      } else return ''
    }
    */
  },
  async beforeMount () {
    try {
      this.showIsLoading(true)
      await this.getProfile()
    } catch (e) {
      console.log(e)
    }
    this.showIsLoading(false)
    if (this.missingProfile) {
      this.$router.push({ name: 'userRegister' })
    }
    /*
    if (!this.$store.getters['profiles/isRegistered']) {
      this.$router.push({ name: 'userRegister' })
    }
    */
  },
  beforeDestroy: function () {
    this.$store.commit('profiles/setSelectedProfile', [])
  },
  methods: {
    ...mapActions('profiles', ['getProfile'])
    /*
    goToChat () {
      this.$store.commit('messages/setActiveChat', { activeChat: this.Profile.eosAccount, avatarImage: this.Profile.publicData.avatarImage, s3Identity: this.Profile.publicData.s3Identity })
      this.$router.push({ name: 'chat' })
    }
    */
  }
}
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 100%
  min-height: 100vh

.back
  background: rgba(255,255,255,.4)
  height: auto

.fab-edit
  margin-right: 25px
  margin-bottom: 10px

@media screen and (min-width: 500px)
  .my-card
    width: 100%
    max-width: 70%
    min-height: 90vh
    margin-top: 20px
    margin-bottom: 20px

  .fab-edit
    margin-right: 2px
</style>
