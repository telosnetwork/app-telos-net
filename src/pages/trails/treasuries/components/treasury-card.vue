<script>
export default {
  name: 'treasury-card',
  props: {
    treasury: { type: Object, required: true }
  }
}
</script>

<template lang="pug">
q-card
  q-card-section.bg-primary.text-white
    .text-h6 {{ treasury.title || "Default treasury" }}
    .text-right.text-italic {{ treasury.manager }}
  q-card-section.q-mt-lg
    p {{ treasury.description || "No desc" }}
  q-card-section
    strong {{ $t('pages.trails.treasuries.card.supply') }}: {{ treasury.supply }}
    br
    strong {{ $t('pages.trails.treasuries.card.maxSupply') }}: {{ treasury.max_supply }}
  q-card-section.flex.justify-end
    div
      q-chip(
        icon="fas fa-user-check"
        color="white"
        text-color="primary"
        dense
        size="xs"
      )
        | {{ treasury.voters }}
        q-tooltip {{ $t('pages.trails.treasuries.card.voters') }}
      q-chip(
        icon="fas fa-person-booth"
        color="white"
        text-color="primary"
        dense
        size="xs"
      )
        | &nbsp; {{ treasury.open_ballots }}
        q-tooltip {{ $t('pages.trails.treasuries.card.openBallots') }}
</template>
