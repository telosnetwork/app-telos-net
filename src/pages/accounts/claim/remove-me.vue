<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'claim-form',
  mixins: [validation],
  methods: {
    ...mapActions('accounts', ['claimAccount', 'isAccountClaimed'])
  },
  data () {
    return {
      form: {
        account_name: null
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    isClaimed () {
      return this.isAccountClaimed(this.account) === 'claimed'
    }
  }
}
</script>

<template lang="pug">
q-card(
    flat
    bordered
    style="width: 400px; max-width: 80vw;"
)
    q-card-section.bg-primary.text-white
        .text-h6 Claim account
    q-card-section(
      v-if="!isAuthenticated"
    ) You must login to claim your account
    q-card-section(
      v-if="isAuthenticated && !isClaimed"
    ) {{ account }} has already been claimed
    q-card-section(
      v-if="isAuthenticated && isClaimed"
    )
      q-btn(
        color="primary"
        :label="'Claim'"
        :loading="submitting"
        @click="claimAccount(account)"
      )
</template>
