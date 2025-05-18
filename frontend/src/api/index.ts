import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log('Request:', config.method?.toUpperCase(), config.url, config.params)
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data)
    return response
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default api 