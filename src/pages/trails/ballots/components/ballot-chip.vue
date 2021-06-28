<script>
export default {
  name: 'ballot-chip',
  props: ['type'],
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
    div.poll-icon
    span.type-text {{ ucFirst(type) }}
</template>

<style lang="sass">
  .ballot-type.poll-chip .poll-icon
    background: #FFB010;
  .ballot-type.referendum-chip .poll-icon
    background: #F5898A;
  .ballot-type.proposal-chip .poll-icon
    background: #FA7238;
  .ballot-type.election-chip .poll-icon
    background: #71DA76;
  .ballot-type.leaderboard-chip .poll-icon
    background: #8A8EF5;
  .q-card .q-chip.ballot-type
    border-radius: 0px 0px 12px 0px;
    background: #fff;
  .poll-ended .q-chip.ballot-type
    background: #F7F7F7
  .ballot-type .poll-icon
    width: 6px;
    height: 6px;
    margin-right: 6px;
    border-radius: 10px;
  .ballot-type .type-text
    color: #000919
    font-size: 12px
  .ballot-type
    top: 6px
</style>
