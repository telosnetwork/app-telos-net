<template>
  <div class='row justify-center items-center q-pa-md'>
    <div class='col-xs-8'>
      <q-form @submit='onSubmit' @reset='onReset' class='q-gutter-md'>
        <q-input
          filled
          v-model='url'
          label='URL'
          hint='URL'
          lazy-rules
          :rules="[ validationURL ]"
        />

        <q-input
          filled
          v-model='email'
          label='EMAIL'
          hint='EMAIL'
          lazy-rules
          :rules="[ validationEMAIL ]"
        />

        <q-input
          filled
          v-model='shortname'
          label='Short Name'
          hint='Short Name'
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
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
import { CustomRegex } from '~/const'
export default {
  name: 'register-app-form',
  data () {
    return {
      shortname: null,
      url: '',
      email: ''
    }
  },
  // components: { amplify-s3-image },
  methods: {
    onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must accept the license and terms first'
        })
      } else if (this.methodComm === null) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must choose one prefer method communication'
        })
      } else if (this.paymentsOptions.length === 0) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You must choose at least one payment options'
        })
      } else {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      }
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
    validationURL () {
      var regex = new RegExp(CustomRegex.URL)

      if (this.url.match(regex)) {
        return true
      } else {
        return 'URL not valid'
      }
    },
    validationEMAIL () {
      var regex = new RegExp(CustomRegex.EMAIL)
      if (this.email.match(regex)) {
        return true
      } else {
        return 'Email address not valid'
      }
    },
    validationSMS () {
      if (this.methodComm === 'sms') {
        return (
          (this.smsNumber && this.smsNumber.length > 0) ||
          'Please type something'
        )
      }
    }
  }
}
</script>

<style scoped>
S3Im {
  width: 100px;
  height: 100px;
}
</style>
