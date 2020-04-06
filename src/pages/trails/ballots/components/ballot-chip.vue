<script>
export default {
  name: 'ballot-chip',
  props: ['type', 'color'],
  data () {
    return {}
  }
}
</script>

<template lang="pug">
  q-chip(square text-color="white" :class="`${type.toLowerCase()}-chip`").capitalize.no-margin.text-weight-bold.ballot-type
    q-avatar
      img(:src="`statics/app-icons/${type.toLowerCase()}-icon.svg`").poll-icon
    span {{ type }}
</template>

<style lang="sass">
  .ballot-type.poll-chip
    background-color: #9793fa;
  .ballot-type.referendum-chip
    background-color: #94d5fa;
  .ballot-type.proposal-chip
    background-color: #e293fa;
  .ballot-type.election-chip
    background-color: #93b8fa;
  .ballot-type.leaderboard-chip
    background-color: #fa93a2;
  .q-card .q-chip.ballot-type
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  .ballot-type .q-avatar img.poll-icon
    width: 32px;
    padding-left: 10px;
    margin-right: 4px;
</style>
