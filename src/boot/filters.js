const numeral = require('numeral')

export default async ({ Vue }) => {
  Vue.filter('formatNumber', value => {
    if (value > 1000) {
      return numeral(value).format('0.000a')
    } else {
      return numeral(value).format('0,0')
    }
  })

  Vue.filter('formatNumberDec', value => {
    return numeral(value).format('0,0.0')
  })
}
