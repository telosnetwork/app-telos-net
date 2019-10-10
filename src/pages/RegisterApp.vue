<template lang='pug'>
  <main>
    <RegisterAppForm></RegisterAppForm>
  </main>
</template>

<script>
// import { SignUpForm } from '../components/SignUp'
import RegisterAppForm from '../components/RegisterApp/RegisterAppForm'
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
