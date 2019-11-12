<script>
import AddVoterDialog from './add-voter-dialog'

export default {
  name: 'treasury-card',
  components: { AddVoterDialog },
  props: {
    treasury: { type: Object, required: true }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<template lang="pug">
div
  add-voter-dialog(
    :show.sync="show"
    :supply="treasury.max_supply"
  )
  q-card
    q-card-section.bg-primary.text-white
      .text-h6
        | {{ treasury.title || "Group" }}
        q-icon.q-ml-sm(
          :name="`fas ${treasury.access === 'private' ? 'fa-lock' : 'fa-lock-open'}`"
          size="12px"
        )
          q-tooltip {{ treasury.access }}
      .text-right.text-italic {{ treasury.manager }}
    q-card-section.q-mt-lg
      p {{ treasury.description || "No desc" }}
    q-card-section
      strong {{ $t('pages.trails.treasuries.card.supply') }}: {{ treasury.supply }}
      br
      strong {{ $t('pages.trails.treasuries.card.maxSupply') }}: {{ treasury.max_supply }}
    q-card-section.flex.justify-end
      div
        q-btn(
          icon="fas fa-user-plus"
          color="white"
          text-color="primary"
          dense
          flat
          size="xs"
          :label="treasury.voters"
          :disabled="treasury.access === 'private'"
          @click="show = true"
        )
          q-tooltip {{ $t('pages.trails.treasuries.card.registerVoter') }}
        q-chip(
          icon="fas fa-person-booth"
          color="white"
          text-color="primary"
          dense
          size="sm"
        )
          | &nbsp; {{ treasury.open_ballots }}
          q-tooltip {{ $t('pages.trails.treasuries.card.openedBallots') }}
</template>
