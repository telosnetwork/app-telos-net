<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

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
    style="width: 400px; max-width: 80vw;"
  )
    q-card-section.bg-primary.text-white
      .text-h6 Create a treasury
    q-card-section
      q-input(
        v-model="form.manager"
        label="Manager"
        :rules="[rules.required, rules.accountFormat, rules.accountLength]"
      )
      q-input(
        v-model="form.maxSupply"
        label="Max supply"
        :rules="[rules.required]"
      )
      q-select(
        v-model="form.access"
        :options=["public", "private", "invite"]
        :rules="[rules.required]"
      )
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('update:show', false)"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        @click="addTreasury(form)"
      )
</template>
