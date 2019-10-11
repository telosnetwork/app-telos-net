<template lang="pug">
    q-item(clickable, v-ripple)
        q-item-section(avatar)
            q-avatar(size="80px")
                img(src='https://cdn.quasar.dev/img/avatar.png')
        q-item-section
            q-item-label josemgo
            q-item-label(caption='', lines='1') Jose Maria Gayosso
            q-item-label(caption='', lines='1') jmgayosso@mightywizards.com
            q-item-label(caption, lines='2') Mexico
        q-item-section(side='')
            q-icon(name='fiber_manual_record', color='green')
</template>

<script>
export default {
  name: 'contact-item'
}
</script>

<style scoped>
.container {
    width: 100%;
}
</style>
