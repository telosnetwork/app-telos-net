<template>
  <div class='row justify-center items-center'>
    <div class='col-xs-8 q-gutter-md q-pa-md'>
      <div class='row justify-center'>
      <s3-image :img-key='imgKey' :identity='identity' class="S3Img"/>
      </div>
      <q-form @submit='onSubmit' @reset='onReset' class='q-gutter-md'>
        <div class='row justify-center'>
              <q-btn
                :loading="loadingFile"
                color="orange"
                text-color="grey-9"
                @click="$refs.btnUp.click()"
                icon="cloud_upload"
                style="width: 100px"
              />
        <input
          ref='btnUp'
          label='btnUp'
          type="file"
          accept="image/png, image/jpeg"
          v-on:change='onFileChange'
          style="display: none;" />
        </div>
        <q-input
          filled
          v-model='presentation'
          :label="$t('components.signUp.form.presentation')"
          hint='Presentation'
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          autogrow
        />

        <q-input
          filled
          v-model='firstName'
          label='First Name'
          hint='First Name'
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          filled
          v-model='lastName'
          label='Last Name'
          hint='Last Name'
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <div class='row justify-center'>
          <q-option-group
            class='items-center'
            :options='optionsMethodComm'
            label='Prefer method of communication'
            type='radio'
            v-model='methodComm'
            inline
          />
        </div>

        <q-input
          filled
          v-model='smsNumber'
          label='SMS Number'
          hint='SMS Number'
          mask='(###) ### - ####'
          unmasked-value
          lazy-rules
          :rules="[validationSMS]"
        />

        <q-input
          filled
          v-model='email'
          label='Email'
          hint='Email'
          type='email'
          lazy-rules
          :rules="[validationEMAIL]"
        />

        <q-select
          filled
          v-model='country'
          use-input
          input-debounce='0'
          label='Country'
          :options='optionsCountriesFiltered'
          @filter='filterCountries'
          behavior='dialog'
          :rules="[ val => val && val.length > 0 || 'Please select your countrie']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class='text-grey'>No results</q-item-section>
            </q-item>
          </template>
        </q-select>
        <!-- [ val => val && val.length > 0 || 'Please type something']
       <q-input
        filled
        type='number'
        v-model='age'
        label='Your age *'
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 100 || 'Please type a real age'
        ]"
        />-->

        <q-select
          label='Hobbies'
          filled
          v-model='hobbies'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add-unique'
        />
        <div>
          <q-btn label='Submit' type='submit' color='primary' />
          <q-btn label='Reset' type='reset' color='primary' flat class='q-ml-sm' />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
// import { amplify-s3-image } from 'aws-amplify-vue'
import PPP from '@smontero/ppp-client-api'
import { mapActions } from 'vuex'
import S3Image from '../s3-image'

export default {
  name: 'sign-up-form',
  components: {
    S3Image
  },
  data () {
    return {
      imgKey: 'sebastianm21-1570986260187.jpeg',
      identity: 'us-east-1:05ba21e0-18ed-4b21-b5f8-9794fd7ce41d',
      firstName: 'Jose',
      lastName: 'Gaysso Ortega',
      smsNumber: '5540713427',
      email: 'josemgo.9.11@gmail.com',
      methodComm: 'email',
      optionsMethodComm: [
        { label: 'SMS', value: 'sms', color: 'cyan' },
        { label: 'EMAIL', value: 'email', color: 'cyan' }
      ],
      paymentsOptions: [],
      optionsPayments: [
        {
          label: 'Cash',
          value: 'cash',
          color: 'cyan'
        },
        {
          label: 'PayPal',
          value: 'paypal',
          color: 'cyan'
        },
        {
          label: 'Bank',
          value: 'bank',
          color: 'cyan'
        }
      ],
      country: 'Mexico',
      optionsCountries: [
        'Mexico',
        'Estados Unidos',
        'Reino Unido',
        'Canada',
        'India'
      ],
      optionsCountriesFiltered: [],
      hobbies: ['Nadar'],
      presentation: 'Salten Salten',
      accept: false,
      presentationStr: '/components/signUp/form/presentation',
      loadingFile: false
    }
  },
  methods: {
    ...mapActions('profiles', ['signUp', 'searchProfiles']),
    async onFileChange (e) {
      this.loadingFile = true
      const file = e.target.files[0]
      console.log('File changed!')
      const profileApi = PPP.profileApi()
      const authApi = PPP.authApi()
      const key = await profileApi.uploadAvatar(file)
      console.log(key)
      const userInfo = await authApi.userInfo()
      console.log(userInfo)
      const url = await profileApi.getAvatarUrl(key, userInfo.id)
      console.log(url)
      this.imgKey = key
      this.identity = userInfo.id
      this.loadingFile = false
    },
    onSubmit () {
      if (this.methodComm === null) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must choose one prefer method communication'
        })
      } else if (this.hobbies.length === 0) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must write at least one hobby'
        })
      } else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
        this.doSignup()
      }
    },
    async doSignup () {
      const mData = {
        emailAddress: this.email,
        smsNumber: this.smsNumber,
        commPref: 'EMAIL',
        publicData: {
          firstName: this.firstName,
          lastName: this.lastName,
          countryCode: this.country,
          profileImage: this.imgKey,
          identity: this.identity,
          hobbies: this.hobbies,
          bio: this.identity
        }
      }
      await this.signUp(mData)
      await this.searchProfiles()
    },
    onReset () {
      this.firstName = null
      this.lastName = null
      this.name = null
      this.age = null
      this.smsNumber = null
      this.email = null
      this.methodComm = null
      this.accept = false
    },

    filterCountries (val, update) {
      if (val === '') {
        update(() => {
          this.optionsCountriesFiltered = this.optionsCountries
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.optionsCountriesFiltered = this.optionsCountries.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        )
      })
    },

    validationSMS () {
      if (this.methodComm === 'sms') {
        return (
          (this.smsNumber && this.smsNumber.length > 0) ||
          'Please type something'
        )
      }
    },

    validationEMAIL () {
      if (this.methodComm === 'email') {
        return (
          (this.email && this.email.length > 0) || 'Please type something'
        )
      }
    }
  }
}
</script>

<style scoped>
.S3Img {
  height: 150px;
  max-width: 150px;
  border-radius: 100px;
}
</style>
