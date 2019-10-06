<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'right-menu-authenticated',
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  methods: {
    ...mapActions('accounts', ['logout'])
  }
}
</script>

<template lang="pug">
q-btn(
  :label="account"
  flat
  no-caps
)
  q-menu
    q-list(dense)
      q-item(
        @click="logout"
        clickable
        v-close-popup
      )
        q-item-section {{ $t('components.layout.logout.button') }}
</template>
