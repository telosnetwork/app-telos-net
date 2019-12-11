<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'mint-token-dialog',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true },
    supply: { type: String, required: true }
  },
  data () {
    return {
      form: {
        to: null,
        quantity: null,
        memo: null
      },
      submitting: false
    }
  },
  methods: {
    ...mapActions('trails', ['mint']),
    async onMintTokens () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.mint({
        ...this.form,
        supply: this.supply
      })
      this.submitting = false
      if (success) {
        this.$emit('update:show', false)
      }
    }
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
)
  q-card(style="width: 500px; max-width: 80vw;")
    q-card-section
      .text-h6 Mint tokens
    q-card-section
      q-input(
        ref="to"
        v-model="form.to"
        label="To"
        maxlength="12"
        :rules="[rules.required, rules.accountFormat, rules.accountLength, rules.accountExists]"
        lazy-rules
        :debounce="200"
        @blur="form.to = (form.to || '').toLowerCase()"
      )
      q-input(
        ref="quantity"
        v-model="form.quantity"
        label="Quantity"
        :rules="[rules.required]"
        lazy-rules
      )
      q-input(
        ref="memo"
        v-model="form.memo"
        label="Memo"
      )
    q-card-actions(
      align="right"
    )
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('update:show', false)"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.mint')"
        @click="onMintTokens"
        :loading="submitting"
      )
</template>

<style lang="sass" scoped>

</style>
