<script>
import { mapActions } from 'vuex'

export default {
  name: 'add-voter-dialog',
  props: {
    show: { type: Boolean, required: true },
    supply: { type: String, required: true }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions('trails', ['registerVoter']),
    async onRegisterVoter () {
      this.loading = true
      await this.registerVoter(this.supply)
      this.$emit('update:show', false)
      this.loading = false
    }
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
)
  q-card
    q-card-section
      .text-h6 {{ $t('pages.trails.treasuries.registerVoterDialog.title') }}
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
        :label="$t('common.buttons.register')"
        @click="onRegisterVoter"
        :loading="loading"
      )

</template>
