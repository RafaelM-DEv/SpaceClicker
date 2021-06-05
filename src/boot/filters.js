const numeral = require('numeral')

export default async ({ Vue }) => {
  Vue.filter('formatNumber', value => {
    return numeral(value).format('0,0')
  })

  Vue.filter('formatNumberDec', value => {
    return numeral(value).format('0,0.0')
  })
}
