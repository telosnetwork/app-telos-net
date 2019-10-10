<template lang="pug">
q-card.my-card
  img(src='https://cdn.quasar.dev/img/mountains.jpg')
  q-card-section
    .text-h6 Our Changing Planet
    .text-subtitle2 by John Doe
  q-card-section
    | {{ lorem }}

</template>

<script>
export default {
  name: 'ContactItem'
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
