<template lang='pug'>
  main
    RegisterAppForm
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import RegisterAppForm from '~/components/register-app/register-app-form'
export default {
  name: 'register-app',
  components: { RegisterAppForm },
  computed: {
    title () {
      return 'Hola'
    }
  }
}
</script>
