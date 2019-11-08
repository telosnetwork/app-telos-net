import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.WEBSERVICES_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${process.env.WEBSERVICES_API_KEY}`
  }
})

http.interceptors.response.use(
  response => response.data || {},
  error => throw new Error(error.response.data.message || null)
)

export default ({ Vue, store }) => {
  Vue.prototype.$axios = http
  store['$axios'] = http
}
