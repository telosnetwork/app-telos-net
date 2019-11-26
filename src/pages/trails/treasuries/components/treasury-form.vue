<script>
import { mapActions, mapGetters } from 'vuex'
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
        access: null,
        title: null,
        description: null
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters('trails', ['treasuryFees'])
  },
  methods: {
    ...mapActions('trails', ['addTreasury']),
    async onAddTreasury () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.addTreasury(this.form)
      this.submitting = false
      if (success) {
        this.$emit('update:show', false)
        this.resetTreasury()
      }
    },
    resetTreasury () {
      this.form = {
        manager: null,
        maxSupply: null,
        access: null,
        title: null,
        description: null
      }
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
    flat
    bordered
    style="width: 400px; max-width: 80vw;"
  )
    q-card-section.bg-primary.text-white
      .text-h6 Create a treasury
    q-card-section
      q-input(
        ref="manager"
        v-model="form.manager"
        label="Manager"
        :rules="[rules.required, rules.accountFormat, rules.accountLength]"
      )
      q-input(
        ref="maxSupply"
        v-model="form.maxSupply"
        label="Max supply"
        :rules="[rules.required]"
      )
      q-input(
        ref="title"
        v-model="form.title"
        label="Title"
        maxlength="50"
        :rules="[rules.required]"
      )
      q-input(
        ref="description"
        v-model="form.description"
        label="Description"
        maxlength="250"
        :rules="[rules.required]"
      )
      q-select(
        v-model="form.access"
        label="Access"
        :options=["public", "private", "invite"]
        :rules="[rules.required]"
      )
    q-card-section(v-if="treasuryFees")
      strong.text-red.fees There is a deposit fee of {{ treasuryFees.value }}
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('update:show', false)"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="onAddTreasury()"
      )
</template>

<style lang="sass" scoped>
  .fees
    font-size: 12px
</style>
