<script>
export default {
  name: 'ballot-view-option',
  props: {
    option: { type: Object, required: true },
    ballot: { type: Object, required: true },
    isBallotOpened: { type: Boolean, required: true },
    displayWinner: { type: Function, required: true },
    votes: { type: Array, required: true },
    getPercentofTotal: { type: Number, required: true }
  },
  data () {
    return {
      votesArr: this.votes
    }
  },
  methods: {
    getPartOfTotal () {
      return !isNaN(this.getPercentofTotal) ? this.getPercentofTotal / 100 : 0
    }
  }
}
</script>

<template lang="pug">
  q-item.ballot-view-option(
      :key="option.key"
      :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'option-winner' : '' : 'option-clear'"
    ).no-padding.capitalize.column
      div.row.option-item
        q-item-section()
          q-checkbox(
            size="sm"
            v-model="votesArr"
            :disable="ballot.status !== 'cancelled' && !isBallotOpened"
            keep-color
            :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'visible-checkbox' : 'invisible-checkbox' : ''"
            color="$primary"
            :val="option.key"
          )
            div.checkbox-text.row.space-between
              div {{ option.key }}
              div(v-if="getPartOfTotal()") {{ getPartOfTotal() * 100 }}%&nbsp
      div.linear-progress(v-if="displayWinner(ballot)")
        q-linear-progress(rounded size="6px" :value="getPartOfTotal()" color="$primary")
</template>

<style lang="sass">
  .ballot-view-option
    max-width: 220px
    height: 55px
    overflow: hidden
    flex-wrap: nowrap
    border: 2px solid #F2F3F4
    border-radius: 8px
    margin: 8px 0
    &.option-winner
      border: none
      background: #F4F7FF
      & .option-item
        padding: 6px 12px 0 12px
    & .option-item
      width: 100%
      padding: 10px 12px 0 12px
      & > div > div
        width: 100%
        & > .q-checkbox__label
          width: 100%
          & > .checkbox-text
            width: 100%
            justify-content: space-between
    & .linear-progress
      padding: 0 12px 10px 12px
    &:hover
      border: none
      background: #FFFFFF
      box-shadow: 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04)
  .invisible-checkbox .q-checkbox__inner
    display: none
  .invisible-checkbox .checkbox-text
      margin: 0 0 4px 4px
  .checkbox-text
    flex-wrap: nowrap
    max-width: 220px
    font-size: 16px
    font-weight: 600
    line-height: 24px
  .option-clear > .option-item
    padding: 6px 12px 0 12px
  @media (max-width: 620px)
    .ballot-view-option,
    .options-wrapper
      width: 100%
    .ballot-view-option,
    .checkbox-text
      max-width: none
</style>
