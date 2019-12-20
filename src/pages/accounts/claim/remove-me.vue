<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'claim-form',
  mixins: [validation],
  methods: {
    ...mapActions('accounts', ['claimAccount', 'isAccountClaimed']),
    async setClaimed () {
      this.isClaimed = await this.isAccountClaimed(this.account) === 'claimed'
    },
    async doClaim () {
      await this.claimAccount(this.account)
      await this.setClaimed()
    }
  },
  async mounted () {
    await this.setClaimed()
  },
  data () {
    return {
      form: {
        account_name: null
      },
      submitting: false,
      isClaimed: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated'])
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg.row.flex.justify-center.items-center.col-md-8
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
        v-if="isAuthenticated && isClaimed"
      )
        .text-h6 {{ account }} has been claimed
      q-card-section(
        v-if="isAuthenticated && !isClaimed"
      )
        q-card-actions
          q-btn(
            color="primary"
            label='Claim'
            :loading="submitting"
            @click="doClaim"
          )
</template>
