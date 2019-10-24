<template lang="pug">
  q-page.flex.flex-center
    <router-link class="routers" to="/chat">{{ $t('components.index.router.chat') }}</router-link>
    <router-link class="routers" to="/signUp">{{ $t('components.index.router.signUp') }}</router-link>
    <router-link class="routers" to="/chatList">{{ $t('components.index.router.chatList') }}</router-link>
    <router-link class="routers" to="/contactList">{{ $t('components.index.router.contactList') }}</router-link>
    <router-link class="routers" to="/registerApp">{{ $t('components.index.router.registerApp') }}</router-link>
    <router-link class="routers" to="/appList">{{ $t('components.index.router.appList') }}</router-link>
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
