<template>
  <div class='row justify-center items-center'>
    <div class='col-xs-8'>
      <!-- <amplify-s3-image
        class='S3Im'
        identity='us-east-1:b9adaf73-cdd3-4d42-8847-6d60508f4923'
        imagePath='jmgayosso155-1569433731908.jpeg'
      ></amplify-s3-image> -->
      <q-form @submit='onSubmit' @reset='onReset' class='q-gutter-md'>
        <q-input
          filled
          v-model='presentation'
          label='Presentation'
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
        <div class='row justify-center'>
          <q-option-group
            v-model='paymentsOptions'
            :options='optionsPayments'
            color='green'
            type='checkbox'
            inline
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          ></q-option-group>
        </div>

        <!-- <q-select filled v-model='model2' :options='options3' label='Filled'  :rules="[ val => val && val.length > 0 || 'Please type something']"/> -->

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

        <q-toggle v-model='accept' label='I accept the license and terms' />

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

export default {
  name: 'SignUpForm',
  data () {
    return {
      firstName: null,
      lastName: null,
      smsNumber: null,
      email: null,
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
      country: null,
      optionsCountries: [
        'Mexico',
        'Estados Unidos',
        'Reino Unido',
        'Canada',
        'India'
      ],
      optionsCountriesFiltered: [],
      hobbies: null,
      presentation: null,
      accept: false
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
          (this.email && this.smsNumber.email > 0) || 'Please type something'
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
