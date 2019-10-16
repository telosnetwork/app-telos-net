<template lang='pug'>
  main
    RegisterAppForm
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import RegisterAppForm from '~/components/RegisterApp/register-app-form'
export default {
  name: 'RegisterApp',
  components: { RegisterAppForm },
  computed: {
    title () {
      return 'Hola'
    }
  }
}
</script>
