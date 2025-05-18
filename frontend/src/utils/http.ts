import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { generateCsrfToken, validateCsrfToken, filterSensitiveInfo } from './security'
import { AppError, ErrorType, handleError, logError } from './error'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 CSRF Token
    const csrfToken = generateCsrfToken()
    config.headers['X-CSRF-Token'] = csrfToken
    // 存储 token 用于验证
    localStorage.setItem('csrfToken', csrfToken)
    return config
  },
  (error) => {
    return Promise.reject(new AppError('请求配置错误', ErrorType.NETWORK))
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 验证 CSRF Token
    const storedToken = localStorage.getItem('csrfToken')
    const responseToken = response.headers['x-csrf-token']
    if (responseToken && storedToken && !validateCsrfToken(responseToken, storedToken)) {
      throw new AppError('CSRF Token 验证失败', ErrorType.AUTH)
    }

    // 过滤敏感信息
    if (response.data) {
      response.data = filterSensitiveInfo(response.data)
    }

    return response
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || '请求失败'

      switch (status) {
        case 401:
          throw new AppError('认证失败，请重新登录', ErrorType.AUTH)
        case 403:
          throw new AppError('没有权限访问该资源', ErrorType.AUTH)
        case 404:
          throw new AppError('请求的资源不存在', ErrorType.BUSINESS)
        case 422:
          throw new AppError(message, ErrorType.VALIDATION)
        case 500:
          throw new AppError('服务器内部错误', ErrorType.BUSINESS)
        default:
          throw new AppError(message, ErrorType.BUSINESS)
      }
    } else if (error.request) {
      throw new AppError('网络错误，请检查网络连接', ErrorType.NETWORK)
    } else {
      throw new AppError('请求配置错误', ErrorType.NETWORK)
    }
  }
)

// 封装请求方法
export const request = {
  async get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    try {
      const response = await http.get<T>(url, config)
      return response.data
    } catch (error) {
      logError(error, { url, method: 'GET' })
      throw handleError(error)
    }
  },

  async post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    try {
      const response = await http.post<T>(url, data, config)
      return response.data
    } catch (error) {
      logError(error, { url, method: 'POST', data })
      throw handleError(error)
    }
  },

  async put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    try {
      const response = await http.put<T>(url, data, config)
      return response.data
    } catch (error) {
      logError(error, { url, method: 'PUT', data })
      throw handleError(error)
    }
  },

  async delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    try {
      const response = await http.delete<T>(url, config)
      return response.data
    } catch (error) {
      logError(error, { url, method: 'DELETE' })
      throw handleError(error)
    }
  }
}

export default http
