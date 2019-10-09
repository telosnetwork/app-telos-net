<template lang='pug'>
  <main>
    <h1> {{title}} </h1>
    <SignUpForm></SignUpForm>
    <p>Despues del formulario</p>
  </main>
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import SignUpForm from '../components/SignUp/SignUpForm'
export default {
  name: 'SignUp',
  components: { SignUpForm },
  computed: {
    title () {
      return this.$store.state.general.title
    }
  }
}
</script>
