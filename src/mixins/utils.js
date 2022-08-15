import { mapMutations } from 'vuex'
export const utils = {
  methods: {
    ...mapMutations('general', ['setErrorMsg', 'setSuccessMsg', 'setIsLoading']),
    copyToClipboard (str) {
      const el = document.createElement('textarea')
      el.value = str
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
    },
    showNotification (message, type = 'success') {
      const color = type.toLowerCase() === 'success' ? 'green' : 'red'
      const icon = type.toLowerCase() === 'success' ? 'done' : 'error'
      this.$q.notify({
        color: color,
        textColor: 'white',
        message: message,
        icon: icon,
        timeout: 5000,
        actions: [{ label: 'Close', color: 'white' }]
      })
    },
    showSuccessMsg (message) {
      this.setSuccessMsg(message)
    },
    showErrorMsg (message) {
      this.setErrorMsg(message)
    },
    showIsLoading (state) {
      this.setIsLoading(state)
    },
    onlyNumbers (string) {
      return string.replace(/[^0-9]/gi, '') // 100 TLOS -> 100
    },
    getPercentOfNumber (number, total) {
      return (this.onlyNumbers(number) * 100 / this.onlyNumbers(total)).toFixed(2) + '%' // 35 * 100 / 70 = 50%
    }
  }
}
