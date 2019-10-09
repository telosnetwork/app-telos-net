<template lang="pug">
  q-page.flex.flex-center
    | Telos Home
    <router-link to="/chat">Chat</router-link>
    <router-link to="/signUp">Sign Up</router-link>
    <router-link to="/chatsList">ChatList</router-link>
</template>

<script>
export default {
  name: 'page-index'
}
</script>
