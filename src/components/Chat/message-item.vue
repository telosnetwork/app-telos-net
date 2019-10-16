<template lang="pug">
.content-message
    q-chat-message(name='me', avatar='https://cdn.quasar.dev/img/avatar1.jpg', :text="[message.message]", stamp='7 minutes ago', sent, bg-color='amber-7')
    q-chat-message(name='Jane', avatar='https://cdn.quasar.dev/img/avatar5.jpg', :text="['doing fine, how r you?']", stamp='4 minutes ago', text-color='white', bg-color='primary')
</template>

<script>
export default {
  name: 'chat-item',
  props: {
    message: Object
  }
}
</script>
