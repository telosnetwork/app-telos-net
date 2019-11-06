<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'safe-card',
  props: {
    safe: { type: Object, required: true }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    ...mapActions('poc', ['lock', 'unlock'])
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  }
}
</script>

<template lang='pug'>
div
  q-card
    q-card-section.bg-primary.text-white
      .text-h6
        | {{ safe.safe_name || 'Smart Safe' }}
        q-icon.q-ml-sm(
          :name='`fas ${safe.locked === 1 ? "fa-lock" : "fa-lock-open"}`'
          size='12px'
        )
    q-card-section(
      :hidden='safe.locked === 0'
    )
      br
      strong {{ $t('pages.poc.smartsafe.locked_by') }}: {{ safe.locked_by }}
      br
      strong {{ $t('pages.poc.smartsafe.lock_time') }}: {{ safe.last_lock_time }}
    q-card-section
      br
      strong {{ $t('pages.poc.smartsafe.last_unlocker') }}: {{ safe.last_unlocker }}
      br
      strong {{ $t('pages.poc.smartsafe.last_unlock_time') }}: {{ safe.last_unlock_time }}
    q-card-section.flex.justify-end
      div
        q-btn(
          :icon='`fas ${safe.locked === 0 ? "fa-lock" : "fa-lock-open"}`'
          color='white'
          text-color='primary'
          dense
          flat
          size='md'
          :label='safe.locked === 0 ? $t("pages.poc.smartsafe.lock") : $t("pages.poc.smartsafe.unlock")'
          :disabled='safe.locked === 1 || account == safe.locked_by'
          @click='safe.locked === 0 ? lock(safe.safe_name, account) : unlock(safe.safe_name, account)'
        )
</template>
