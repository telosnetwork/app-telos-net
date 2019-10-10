<template lang="pug">
  q-page.flex.flex-center
    | Telos Home
    <router-link class="routers" to="/chat">Chat</router-link>
    <router-link class="routers" to="/signUp">Sign Up</router-link>
    <router-link class="routers" to="/chatsList">ChatList</router-link>
    <router-link class="routers" to="/contactList">ContactList</router-link>
    <router-link class="routers" to="/registerApp">Register App</router-link>
</template>

<script>
export default {
  name: 'page-index'
}
</script>

<style>
.routers{
  margin: 5px;
  font-weight: 800;
  text-decoration: none;
  color: white;
  background-color: cadetblue;
  border-radius: 10px;
  padding: 5px;
  text-shadow: 2px;
}

.routers:hover{
    background-color: darkcyan;
    box-shadow: 4;
}
</style>
