const CountriesNPM = require('i18n-iso-countries')
CountriesNPM.registerLocale(require('i18n-iso-countries/langs/en.json'))
CountriesNPM.registerLocale(require('i18n-iso-countries/langs/es.json'))

export const countriesLang = {
  methods: {
    getCountryName (lang, code) {
      return CountriesNPM.getName(code, lang)
    }
  },
  filters: {
    codeToNameCountry (code) {
      return CountriesNPM.getName(code, 'es')
    }
  }
}
