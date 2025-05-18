/**
 * XSS 防护工具
 */

/**
 * HTML 特殊字符转义映射
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

/**
 * 转义 HTML 特殊字符
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=\/]/g, (char) => HTML_ESCAPE_MAP[char] || char)
}

/**
 * 转义 HTML 属性值
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeAttribute(str: string): string {
  return str.replace(/[&<>"'`=\/]/g, (char) => HTML_ESCAPE_MAP[char] || char)
}

/**
 * 转义 URL
 * @param url 需要转义的 URL
 * @returns 转义后的 URL
 */
export function escapeUrl(url: string): string {
  try {
    return encodeURI(url)
  } catch {
    return ''
  }
}

/**
 * 转义 JavaScript 字符串
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeJs(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/**
 * 清理 HTML 内容
 * @param html 需要清理的 HTML
 * @returns 清理后的 HTML
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * 清理 URL
 * @param url 需要清理的 URL
 * @returns 清理后的 URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // 只允许 http 和 https 协议
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * 清理 JavaScript 代码
 * @param code 需要清理的代码
 * @returns 清理后的代码
 */
export function sanitizeJs(code: string): string {
  // 移除注释
  code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
  // 移除空白字符
  code = code.replace(/\s+/g, ' ')
  // 移除危险函数调用
  code = code.replace(/eval|Function|setTimeout|setInterval|new Function/g, '')
  return code.trim()
}

/**
 * 创建安全的 HTML 内容
 * @param template 模板字符串
 * @param data 数据对象
 * @returns 安全的 HTML 内容
 */
export function createSafeHtml(
  template: string,
  data: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(placeholder, escapeHtml(value))
  }
  return result
}

/**
 * 创建安全的 URL
 * @param template 模板字符串
 * @param params 参数对象
 * @returns 安全的 URL
 */
export function createSafeUrl(
  template: string,
  params: Record<string, string>
): string {
  const url = new URL(template)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, escapeUrl(value))
  }
  return url.toString()
}

/**
 * 创建安全的 JavaScript 代码
 * @param template 模板字符串
 * @param data 数据对象
 * @returns 安全的 JavaScript 代码
 */
export function createSafeJs(
  template: string,
  data: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(placeholder, escapeJs(value))
  }
  return result
}
