<script>
export default {
  name: 'ballot-view-option',
  props: {
    option: { type: Object, required: true },
    ballot: { type: Object, required: true },
    isBallotOpened: { type: Boolean, required: true },
    displayWinner: { type: Function, required: true },
    votes: { type: Array, required: true }
  },
  data () {
    return {
    }
  },
  setup () {
    return {
      progress: 0.4
    }
  }
}
</script>

<template lang="pug">
  q-item.ballot-view-option(
      :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'text-green' : 'text-red' : ''"
      :key="option.key"
    ).no-padding.capitalize.column
      div.row
        q-item-section(side)
          q-checkbox(
            v-model="votes"
            :disable="ballot.status !== 'cancelled' && !isBallotOpened"
            keep-color
            :color="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'green' : 'red' : ''"
            :val="option.key"
          )
        q-item-section {{ option.key }}
      div.q-pa-md
        q-linear-progress(rounded size="6px" :value="progress" color="blue")
</template>

<style lang="sass">
  .ballot-view-option
    border: 2px solid #F2F3F4
    border-radius: 8px
</style>
