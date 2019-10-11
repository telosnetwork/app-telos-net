<template lang='pug'>
  main
    h1 {{title}}
    SignUpForm
    p Despues del formulario
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import SignUpForm from '../components/SignUp/SignUpForm'
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
