<script>
import { validation } from '~/mixins/validation'

export default {
  name: 'request-account',
  mixins: [validation],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: {
        account: null
      }
    }
  },
  methods: {
    async onContinue () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.$emit('update:show', false)
      this.$emit('accountEntered', this.form.account)
    }
  }
}
</script>

<template lang="pug">
  q-dialog(
    v-model="show"
    persistent
  )
    q-card(
      style="min-width: 350px"
    )
      q-card-section
        div.text-h6 {{ $t('pages.login.enterAccount') }}

        q-card-section
          q-input(
            dense
            ref="account"
            v-model="form.account"
            autofocus
            @keyup.enter="onContinue"
            :rules="[rules.required, rules.accountFormat, rules.accountLength]"
          )

        q-card-actions.text-primary(
          align="right"
        )
          q-btn(
            flat
            :label="$t('common.buttons.cancel')"
            @click="$emit('update:show', false)"
          )
          q-btn(
            flat
            :label="$t('common.buttons.continue')"
            @click="onContinue"
          )
</template>
