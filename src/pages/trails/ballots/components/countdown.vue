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
    div(v-show="statusType !== 'expired'")
      div.day
        span.number {{ days }}
        div.format DD
      div.hour
        span.number {{ hours }}
        div.format HH
      div.min
        span.number {{ minutes }}
        div.format MM
      div.sec
        span.number {{ seconds }}
        div.format SS
    //- div.message {{ message }}
    //- div(:class="statusType").status-tag {{ statusText }}
</template>
<style lang="sass" scoped>
.timer
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-top: 50px;

.day:not(:first-child), .hour:not(:first-child), .min:not(:first-child), .sec:not(:first-child)
  margin-left: 4px;

.day, .hour, .min, .sec
  font-size: 14px;
  display: inline-block;
  font-weight: 400;
  text-align: center;

  .format
    font-weight: 400;
    font-size: 8px;
    opacity: 0.8;
    width: 30px;

  .number
    background: rgba(233, 228, 228, 0.53);
    // padding: 0 5px;
    border-radius: 5px;
    display: inline-block;
    width: 30px;
    text-align: center;
</style>
