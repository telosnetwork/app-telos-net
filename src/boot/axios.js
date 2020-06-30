import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.WEBSERVICES_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${process.env.WEBSERVICES_API_KEY}`
  }
})

function getErrorMessage (error) {
  if (error.response.data.hasOwnProperty('message')) {
    return error.response.data.message
  }

  return error.response.data
}

http.interceptors.response.use(
  response => response.data || {},
  error => throw new Error(getErrorMessage(error))
)

export default ({ Vue, store }) => {
  Vue.prototype.$axios = http
  store['$axios'] = http
}
