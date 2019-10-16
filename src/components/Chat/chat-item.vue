<template lang="pug">
    q-item(clickable, v-ripple)
        q-item-section(side)
            q-avatar(rounded, size='48px')
                img(src='https://cdn.quasar.dev/img/avatar.png')
                q-badge(floating, color='teal') new
        q-item-section
            q-item-label {{ Chat.counterPartyAccount }}
            q-item-label(caption) {{ Chat.subject }}
        q-item-section(side) 4 min ago
</template>

<script>
export default {
  name: 'message-item',
  props: {
    Chat: Object
  }
}
</script>
