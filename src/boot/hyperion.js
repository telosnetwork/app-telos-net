import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.HYPERION_URL
})

export default ({ Vue, store }) => {
  Vue.prototype.$hyperion = http
  store['$hyperion'] = http
}
