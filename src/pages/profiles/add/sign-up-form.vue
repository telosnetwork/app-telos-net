<template lang='pug'>
.row.justify-center.items-center
  .col-xs-11.col-md-8.q-gutter-y-md.q-pa-md
    q-dialog(v-model='showUpload')
      q-uploader(label="Upload image to Imgur" url="https://api.imgur.com/3/image" accept=".jpg, image/*" field-name="image" :headers="[authHeader]" @uploaded="imageUploaded")
    q-form.q-gutter-y-md(@submit='onSubmit', @reset='onReset')
      div.text-h4.q-pl-md {{ headerText }}
      q-card-section
        .column.items-center.q-gutter-y-md
          gravatar(size='200px' :avatar='avatar' :account='account')
          div.text-h4.q-pl-md {{ account }}
          q-btn(:disable="!isAuthenticated" label="Upload image", color='primary' @click="showUpload = true")
      q-input(:disable="!isAuthenticated" counter maxlength="128" filled, v-model='avatar', :label="$t('pages.signUp.form.avatar')")
      q-input(:disable="!isAuthenticated" counter maxlength="16" filled, v-model='name', :label="$t('pages.signUp.form.name')", lazy-rules, :rules="[ val => val && val.length > 0 || $t('forms.errors.required')]")
      q-input(:disable="!isAuthenticated" counter maxlength="16" filled, v-model='status', :label="$t('pages.signUp.form.status')", lazy-rules, :rules="[ val => val && val.length > 0 || $t('forms.errors.required')]")
      .small-margin
        p.text-weight-thin.small-margin {{$t('pages.signUp.form.presentation')}}
        q-editor(:disable="!isAuthenticated" v-model="bio" min-height="5rem")
      q-btn(:disable="!isAuthenticated" :label="$t('pages.signUp.form.btnSave')", type='submit', color='primary' )
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import gravatar from '../gravatar'

export default {
  name: 'sign-up-form',
  components: {
    gravatar
  },
  data () {
    return {
      identity: '',
      avatar: '',
      name: '',
      status: '',
      bio: '',
      url: '',
      showUpload: false,
      authHeader: { name: 'Authorization', value: `Client-ID ${process.env.IMGUR_CLIENT_ID}` }
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    headerText () {
      if (!this.isAuthenticated) {
        return 'Login to manage your profile'
      }

      return this.myProfile ? 'Edit your profile' : 'Setup your profile'
    },
    myProfile () {
      return this.$store.state.profiles.myProfile
    },
    presentationSanitized () {
      let sanitized = this.bio
      sanitized = sanitized.replace(/script/gi, '')
      sanitized = sanitized.replace(/<a/gi, '')
      sanitized = sanitized.replace(/href/gi, '')
      return sanitized
    }
  },
  beforeMount: async function () {
    this.showIsLoading(true)
    const response = await this.getProfile()
    if (response !== undefined) {
      this.avatar = response.avatar
      this.name = response.display_name
      this.bio = response.bio
      this.status = response.status
    }
    this.showIsLoading(false)
  },
  methods: {
    ...mapActions('profiles', ['signUp', 'searchProfiles', 'getProfile']),
    onSubmit () {
      this.doSignup()
    },
    async doSignup () {
      this.showIsLoading(true)

      const mData = {
        display_name: this.name,
        bio: this.presentationSanitized,
        avatar: this.avatar,
        status: this.status
      }

      try {
        this.showIsLoading(true)
        await this.signUp(mData)
        this.showSuccessMsg('Submited')
        await this.getProfile()
        this.showIsLoading(false)
        this.$router.push({ name: 'myProfile' })
      } catch (e) {
        this.showIsLoading(false)
        this.showErrorMsg(e.message)
      }
    },
    imageUploaded (info) {
      const response = JSON.parse(info.xhr.response)
      this.avatar = response.data.link
      this.showUpload = false
    },
    onReset () {
      this.avatar = null
      this.name = null
      this.age = null
    }
  }
}
</Script>

<style scoped lang='sass'>
</style>
