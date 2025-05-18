/**
 * CSRF 防护工具
 */

/**
 * CSRF Token 存储键名
 */
const CSRF_TOKEN_KEY = 'X-CSRF-Token'

/**
 * 生成 CSRF Token
 * @returns CSRF Token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 获取 CSRF Token
 * @returns CSRF Token
 */
export function getCsrfToken(): string {
  let token = localStorage.getItem(CSRF_TOKEN_KEY)
  if (!token) {
    token = generateCsrfToken()
    localStorage.setItem(CSRF_TOKEN_KEY, token)
  }
  return token
}

/**
 * 验证 CSRF Token
 * @param token 要验证的 Token
 * @returns 是否有效
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = localStorage.getItem(CSRF_TOKEN_KEY)
  return token === storedToken
}

/**
 * 刷新 CSRF Token
 * @returns 新的 CSRF Token
 */
export function refreshCsrfToken(): string {
  const token = generateCsrfToken()
  localStorage.setItem(CSRF_TOKEN_KEY, token)
  return token
}

/**
 * 创建 CSRF 请求头
 * @returns CSRF 请求头
 */
export function createCsrfHeader(): Record<string, string> {
  return {
    [CSRF_TOKEN_KEY]: getCsrfToken()
  }
}

/**
 * 创建 CSRF 请求配置
 * @param config 原始请求配置
 * @returns 添加了 CSRF Token 的请求配置
 */
export function createCsrfConfig(config: RequestInit = {}): RequestInit {
  const headers = new Headers(config.headers)
  headers.set(CSRF_TOKEN_KEY, getCsrfToken())
  return {
    ...config,
    headers
  }
}

/**
 * 创建 CSRF 表单数据
 * @param formData 原始表单数据
 * @returns 添加了 CSRF Token 的表单数据
 */
export function createCsrfFormData(formData: FormData): FormData {
  const newFormData = new FormData()
  for (const [key, value] of formData.entries()) {
    newFormData.append(key, value)
  }
  newFormData.append(CSRF_TOKEN_KEY, getCsrfToken())
  return newFormData
}

/**
 * 创建 CSRF URL 参数
 * @param url 原始 URL
 * @returns 添加了 CSRF Token 的 URL
 */
export function createCsrfUrl(url: string): string {
  const urlObj = new URL(url)
  urlObj.searchParams.append(CSRF_TOKEN_KEY, getCsrfToken())
  return urlObj.toString()
}

/**
 * 创建 CSRF 请求拦截器
 * @param fetch 原始 fetch 函数
 * @returns 添加了 CSRF Token 的 fetch 函数
 */
export function createCsrfFetch(fetch: typeof window.fetch): typeof window.fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const config = createCsrfConfig(init)
    return fetch(input, config)
  }
}

/**
 * 创建 CSRF 响应拦截器
 * @param fetch 原始 fetch 函数
 * @returns 添加了 CSRF Token 验证的 fetch 函数
 */
export function createCsrfResponseInterceptor(
  fetch: typeof window.fetch
): typeof window.fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, init)
    const token = response.headers.get(CSRF_TOKEN_KEY)
    if (token && !validateCsrfToken(token)) {
      throw new Error('CSRF Token 验证失败')
    }
    return response
  }
}

/**
 * 创建完整的 CSRF 防护 fetch
 * @returns 添加了 CSRF 防护的 fetch 函数
 */
export function createCsrfProtectedFetch(): typeof window.fetch {
  const fetch = window.fetch
  const withCsrfToken = createCsrfFetch(fetch)
  return createCsrfResponseInterceptor(withCsrfToken)
}
