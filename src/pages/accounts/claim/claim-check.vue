<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'claim-form',
  mixins: [validation],
  data () {
    return {
      form: {
        account_name: null
      },
      submitting: false,
      state: null
    }
  },
  methods: {
    ...mapActions('accounts', ['isAccountClaimed']),
    async onClaimCheck () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.state = await this.isAccountClaimed(this.form.account_name)
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
    div(
      v-if="state == null"
    )
      q-card-section.bg-primary.text-white
          .text-h6 Check account
      q-card-section
          q-input(
            ref="account_name"
            v-model="form.account_name"
            label="Account name"
            :rules="[rules.required, rules.accountExists]"
            lazy-rules
          )
      q-card-section
            q-btn(
              color="primary"
              :label="$t('pages.claim.claimCheck.checkButton')"
              :loading="submitting"
              @click="onClaimCheck()"
          )
    div(
      v-if="state =='claimed'"
    )
      q-card-section.bg-green.text-white
        .text-h6 Account claimed
      q-card-section.text-h6 Thank you for claiming your account on the Telos network!
      q-card-section
        q-btn(
          color="primary"
          :label="'Check another'"
          @click="state = null"
        )
    div(
      v-if="state =='unstake'"
    )
      q-card-section.bg-yellow.text-white
        .text-h6 Account not claimed
      q-card-section.text-h6 This account is not claimed and is in the list of accounts to be unstaked
      q-card-section
        q-btn(
          color="primary"
          :label="'Claim'"
          :to="'/claim/claimAccount'"
        )
    div(
      v-if="state =='recover'"
    )
      q-card-section.bg-red.text-white
        .text-h6 Account not claimed
      q-card-section.text-h6 This account is not claimed, it has been unstaked and TLOS will be reclaimed once unstaking completes
      q-card-section
        q-btn(
          color="primary"
          :label="'Claim'"
          :to="'/claim/claimAccount'"
        )
</template>
