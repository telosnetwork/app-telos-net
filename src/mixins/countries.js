const CountriesNPM = require('i18n-iso-countries')
CountriesNPM.registerLocale(require('i18n-iso-countries/langs/en.json'))
CountriesNPM.registerLocale(require('i18n-iso-countries/langs/es.json'))

export const countriesLang = {
  data () {
    return {
      countriesLang: [],
      langs: ['es', 'en-us']
    }
  },
  beforeMount () {
    this.countriesLang = CountriesNPM.getNames(this.language)
  },
  // watch: {
  //   language () {
  //     console.log('Language Changed!!')
  //   }
  // },
  computed: {
    language () {
      let ln
      switch (this.$i18n.locale) {
        case 'en-usa':
          ln = 'en'
          break
        case 'es':
          ln = 'es'
          break
        default:
          ln = 'en'
          break
      }
      // console.log('Language', ln)
      return ln
    }
  },
  methods: {
    codeToNameCountry: function (code) {
      return CountriesNPM.getName(code, this.language)
    }
  }
}
