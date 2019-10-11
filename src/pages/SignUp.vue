<template lang='pug'>
  main
    SignUpForm
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import SignUpForm from '../components/SignUp/sign-up-form'
export default {
  name: 'SignUp',
  components: { SignUpForm },
  computed: {
    title () {
      return 'Hola'
    }
  }
}
</script>
