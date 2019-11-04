<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'request-account',
  computed: {
    ...mapGetters('accounts', ['requestAccount', 'availableAccounts', 'availableAccountsLoaded'])
  },
  methods: {
    ...mapMutations('accounts', ['setRequestAccount']),
    async onContinue (account) {
      console.log(account)
      this.setRequestAccount(false)
      this.$emit('accountEntered', account)
    }
  }
}
</script>

<template lang="pug">
  q-dialog(
    v-model="requestAccount"
    persistent
  )
    q-card
      q-card-section.row.items-center.q-mb-md.bg-primary.text-white
        div.text-h6.q-mr-md {{ $t('pages.login.selectAccount') }}
        q-space
        q-btn(
          flat
          round
          dense
          @click="setRequestAccount(false)"
          icon="fas fa-times"
        )

      q-card-section.row.justify-start.q-gutter-sm
        q-btn.col-auto(
          v-for="account in availableAccounts"
          color="primary"
          :key="account"
          no-caps
          :label="account"
          @click="onContinue(account)"
        )

</template>
