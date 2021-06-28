<script>

export default {
  name: 'countdown',
  props: ['endtime'],
  data () {
    return {
      timer: '',
      wordString: {
        day: 'Day',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
        expired: 'Event has been expired.',
        running: 'Till the end of event.',
        upcoming: 'Till start of event.',
        status: {
          expired: 'Expired',
          running: 'Running',
          upcoming: 'Future'
        }
      },
      start: '',
      end: '',
      interval: '',
      days: '',
      minutes: '',
      hours: '',
      seconds: '',
      message: '',
      statusType: '',
      statusText: ''
    }
  },
  mounted () {
    // Accepted Formats:
    // starttime="Feb 19, 2020 15:37:25"
    // endtime="March 8, 2020 16:37:25"
    this.start = new Date().getTime()
    this.end = new Date(this.endtime).getTime()

    // Update the count down every 1 second
    this.timerCount(this.start, this.end)
    this.interval = setInterval(() => {
      this.timerCount(this.start, this.end)
    }, 1000)
  },
  methods: {
    timerCount (start, end) {
      // Get todays date and time
      const now = new Date().getTime()
      // Find the distance between now and the count down date
      let distance = start - now
      let passTime = end - now

      if (distance < 0 && passTime < 0) {
        this.message = this.wordString.expired
        this.statusType = 'expired'
        this.statusText = this.wordString.status.expired
        clearInterval(this.interval)
      } else if (distance < 0 && passTime > 0) {
        this.calcTime(passTime)
        this.message = this.wordString.running
        this.statusType = 'running'
        this.statusText = this.wordString.status.running
      } else if (distance > 0 && passTime > 0) {
        this.calcTime(distance)
        this.message = this.wordString.upcoming
        this.statusType = 'upcoming'
        this.statusText = this.wordString.status.upcoming
      }
    },
    pad (n) {
      return (n < 10) ? ('0' + n) : n
    },
    calcTime (dist) {
      // Time calculations for days, hours, minutes and seconds
      this.days = this.pad(Math.floor(dist / (1000 * 60 * 60 * 24)))
      this.hours = this.pad(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
      this.minutes = this.pad(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)))
      this.seconds = this.pad(Math.floor((dist % (1000 * 60)) / 1000))
    }
  }
}
</script>

<template lang="pug">
  div
    div(v-show="statusType !== 'expired'").row
      span {{ days }}
      span &nbspdays
      span.opacity04 &nbsp:&nbsp
      span {{ hours }}
      span h
      span.opacity04 &nbsp:&nbsp
      span {{ minutes }}
      span m
</template>
<style lang="sass" scoped>
</style>
