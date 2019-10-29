<script>
import { validation } from '~/mixins/validation'

import { mapActions } from 'vuex'

export default {
  name: 'treasury-form',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      form: {
        manager: null,
        maxSupply: null,
        access: null
      }
    }
  },
  methods: {
    ...mapActions('trails', ['addTreasury'])
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  persistent
)
  q-card(
    flat
    bordered
  )
    q-card-section
      q-input(
        v-model="form.manager"
        :rules="[rules.required, rules.accountFormat, rules.accountLength]"
      )
      q-input(
        v-model="form.maxSupply"
        :rules="[rules.required]"
      )
      q-input(
        v-model="form.access"
        :rules="[rules.required, rules.accountFormat, rules.accountLength]"
      )
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('update:show', false)"
      )
      q-btn(
        flat
        :label="$t('common.buttons.create')"
      )
</template>
