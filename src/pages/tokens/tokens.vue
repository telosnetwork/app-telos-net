<template>
  <q-page class="column justify-center items-center">
    <token-edit v-if="createToken || editingToken"></token-edit>
    <token-list></token-list>
  </q-page>
</template>

<script>
import TokenList from './components/token-list.vue'
import TokenEdit from './components/token-edit.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'tokens',
  components: {
    TokenList,
    TokenEdit
  },
  computed: {
    ...mapState('tokens', ['createToken', 'editingToken'])
  },
  mounted () {
    this.loadConfig()
    this.loadTokens()
  },
  methods: {
    ...mapActions('tokens', ['loadTokens', 'loadConfig'])
  }
}
</script>

<style lang="sass" scoped>
.logo
  max-width: 400px
</style>
