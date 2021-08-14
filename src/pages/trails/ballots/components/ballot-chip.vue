<script>
export default {
  name: 'ballot-chip',
  props: ['type', 'isBallotOpened'],
  data () {
    return {}
  },
  methods: {
    ucFirst (str) {
      if (!str) return str

      return str[0].toUpperCase() + str.slice(1)
    }
  }
}
</script>

<template lang="pug">
  q-chip(square text-color="white" :class="`${type}-chip`").capitalize.no-margin.text-weight-bold.ballot-type
    q-avatar
      template(v-if="isBallotOpened")
        img(:src="`statics/app-icons/${type.toLowerCase()}-icon.svg`").poll-icon
      template(v-else)
        img(:src="`statics/app-icons/${type.toLowerCase()}-icon-black.svg`").poll-icon
    span.type-text {{ ucFirst(type) }}
</template>

<style lang="sass">
  .ballot-type.poll-chip
    background: #FFB010;
  .ballot-type.referendum-chip
    background: #F5898A;
  .ballot-type.proposal-chip
    background: #FA7238;
  .ballot-type.election-chip
    background: #71DA76;
  .ballot-type.leaderboard-chip
    background: #8A8EF5;
  .q-card .q-chip.ballot-type
    border-radius: 6px 6px 12px 6px;
    margin-left: 6px !important
  .poll-ended .q-chip.ballot-type
    background: #F7F7F7
  .view-poll-ended .q-chip.ballot-type
    background: #fff
  .ballot-type .poll-icon
    width: 18px !important
    height: 18px !important
  .ballot-type .type-text
    color: white
    font-size: 12px
  .poll-ended .ballot-type .type-text,
  .view-poll-ended .ballot-type .type-text
    color: #000919
  .ballot-type
    top: 6px
</style>
