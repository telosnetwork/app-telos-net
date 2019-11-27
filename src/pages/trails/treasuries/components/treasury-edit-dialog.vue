<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'treasury-edit-dialog',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true },
    treasury: { type: Object, required: true }
  },
  data () {
    return {
      form: {
        title: this.treasury.title,
        description: this.treasury.description
      },
      submitting: false
    }
  },
  methods: {
    ...mapActions('trails', ['editTreasury']),
    async onEditTreasury () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.editTreasury({
        ...this.form,
        treasury: this.treasury
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
      .text-h6 Edit treasury
    q-card-section
      q-input(
        ref="title"
        v-model="form.title"
        label="Title"
        maxlength="50"
        :rules="[rules.required]"
        lazy-rules
      )
      q-input(
        ref="description"
        v-model="form.description"
        label="Description"
        type="textarea"
        maxlength="250"
        :rules="[rules.required]"
        lazy-rules
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
        :label="$t('common.buttons.save')"
        @click="onEditTreasury"
        :loading="submitting"
      )
</template>

<style lang="sass" scoped>

</style>
