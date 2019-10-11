<template lang="pug">
    q-item(clickable, v-ripple)
        q-item-section(side)
            q-avatar(rounded, size='48px')
                img(src='https://cdn.quasar.dev/img/avatar.png')
                q-badge(floating, color='teal') new
        q-item-section
            q-item-label Mary
            q-item-label(caption) 3 new messages
        q-item-section(side) 4 min ago
</template>

<script>
export default {
  name: 'message-item'
}
</script>
