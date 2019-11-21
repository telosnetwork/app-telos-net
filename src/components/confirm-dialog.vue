<template lang="pug">
q-dialog(
  v-model="show"
)
  q-card
    q-card-section
      slot(name='body')
        .text-h6 {{ $t('pages.general.confirmActions') }}
    q-card-actions(
      align="right"
    )
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="onCancel"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.confirm')"
        @click="onConfirmed"
      )
</template>

<script>
export default {
  name: 'confirm-dialog',
  props: {
    show: { type: Boolean, required: true }
  },
  methods: {
    onCancel () {
      this.$emit('update:show', false)
      this.$emit('Canceled', true)
    },
    onConfirmed () {
      this.$emit('update:show', false)
      this.$emit('Confirmed', true)
    }
  }
}
</script>
