<script>
import Countdown from '../components/countdown'

export default {
  name: 'ballot-view',
  components: { Countdown },
  props: {
    ballot: { type: Object, required: true },
    isBallotOpened: { type: Boolean, required: true },
    votingHasBegun: { type: Boolean, required: true },
    getStartTime: { type: Number, required: true },
    getEndTime: { type: Number, required: true }
  }
}
</script>

<template lang="pug">
div(:class="ballot.status === 'closed' || ballot.status === 'cancelled' ? 'text-grey-7' : 'link'").left-tag.left-tag-left.cursor-default
  template(v-if="ballot.status === 'voting' && isBallotOpened")
    cite Time Remaining
    countdown(:endtime="getEndTime")

  template(v-else-if="ballot.status === 'voting' && !votingHasBegun")
    cite Voting Begins in
    countdown(:endtime="getStartTime")

  template(v-else)
    cite Status
    span(v-if="ballot.status === 'setup'") SETUP
    span(v-else) ENDED
</template>
