/**
 * 转义 HTML 特殊字符
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char])
}

/**
 * 过滤敏感信息
 * @param obj 需要过滤的对象
 * @param sensitiveKeys 敏感字段列表
 * @returns 过滤后的对象
 */
export function filterSensitiveInfo<T extends Record<string, any>>(
  obj: T,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'key']
): T {
  const result = { ...obj }
  for (const key in result) {
    if (sensitiveKeys.includes(key)) {
      result[key] = '******' as T[typeof key]
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = filterSensitiveInfo(result[key], sensitiveKeys)
    }
  }
  return result
}

/**
 * 验证 URL 是否安全
 * @param url 需要验证的 URL
 * @param allowedDomains 允许的域名列表
 * @returns 是否安全
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
  try {
    const urlObj = new URL(url)
    return allowedDomains.length === 0 || allowedDomains.includes(urlObj.hostname)
  } catch {
    return false
  }
}

/**
 * 生成 CSRF Token
 * @returns CSRF Token
 */
export function generateCsrfToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * 验证 CSRF Token
 * @param token 需要验证的 token
 * @param storedToken 存储的 token
 * @returns 是否有效
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  return token === storedToken
}

/**
 * 清理用户输入
 * @param input 用户输入
 * @returns 清理后的输入
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // 移除 HTML 标签
    .replace(/javascript:/gi, '') // 移除 JavaScript 协议
    .replace(/data:/gi, '') // 移除 Data URL
    .replace(/on\w+=/gi, '') // 移除事件处理器
}
