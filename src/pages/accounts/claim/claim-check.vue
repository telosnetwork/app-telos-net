<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'claim-form',
  mixins: [validation],
  data () {
    return {
      form: {
        accountName: null
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
      this.state = await this.isAccountClaimed(this.form.accountName)
    },
    reset () {
      this.state = null
      this.form.accountName = null
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
  q-card-section.bg-primary.text-white.text-h6(
    v-if="!state"
  ) Check account
  q-card-section(
    v-if="!state"
  )
    q-input(
      v-if="!state"
      ref="accountName"
      v-model="form.accountName"
      label="Account name"
      :rules="[rules.required, rules.accountExists]"
      lazy-rules
    )
  q-card-actions(
    v-if="!state"
  )
    q-btn(
      color="primary"
      :label="$t('pages.claim.claimCheck.checkButton')"
      :loading="submitting"
      @click="onClaimCheck"
    )
  q-card-section.bg-green.text-white.text-h6(
    v-if="state === 'claimed'"
  ) Account claimed
  q-card-section.text-h6(
    v-if="state === 'claimed'"
  ) Thank you for claiming your account on the Telos network!
  q-card-actions(
    v-if="state === 'claimed'"
  )
    q-btn(
      color="primary"
      :label="'Check another'"
      @click="reset"
    )
  q-card-section.bg-yellow.text-white.text-h6(
    v-if="state =='unstake'"
  ) Account not claimed
  q-card-section.text-h6(
    v-if="state =='unstake'"
  ) This account is not claimed and is in the list of accounts to be unstaked
  q-card-actions(
    v-if="state =='unstake'"
  )
    q-btn(
      color="primary"
      label='Claim'
      to='/claim/claimAccount'
    )
  q-card-section.bg-red.text-white.text-h6(
    v-if="state =='recover'"
  ) Account not claimed
  q-card-section.text-h6(
    v-if="state =='recover'"
  ) This account is not claimed, it has been unstaked and TLOS will be reclaimed once unstaking completes
  q-card-actions(
    v-if="state =='recover'"
  )
    q-btn(
      color="primary"
      :label="'Claim'"
      :to="'/claim/claimAccount'"
    )
</template>
