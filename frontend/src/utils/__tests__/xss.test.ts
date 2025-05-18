import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  escapeAttribute,
  escapeUrl,
  escapeJs,
  sanitizeHtml,
  sanitizeUrl,
  sanitizeJs,
  createSafeHtml,
  createSafeUrl,
  createSafeJs
} from '../xss'

describe('XSS 防护工具', () => {
  describe('escapeHtml', () => {
    it('应该转义 HTML 特殊字符', () => {
      const input = '<script>alert("XSS")</script>'
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      expect(escapeHtml(input)).toBe(expected)
    })

    it('应该处理空字符串', () => {
      expect(escapeHtml('')).toBe('')
    })
  })

  describe('escapeAttribute', () => {
    it('应该转义属性值中的特殊字符', () => {
      const input = '"><script>alert("XSS")</script>'
      const expected = '&quot;&gt;&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      expect(escapeAttribute(input)).toBe(expected)
    })
  })

  describe('escapeUrl', () => {
    it('应该正确编码 URL', () => {
      const input = 'https://example.com/path?param=value&xss=<script>'
      const expected = 'https://example.com/path?param=value&xss=%3Cscript%3E'
      expect(escapeUrl(input)).toBe(expected)
    })

    it('应该处理无效 URL', () => {
      expect(escapeUrl('invalid url')).toBe('')
    })
  })

  describe('escapeJs', () => {
    it('应该转义 JavaScript 字符串中的特殊字符', () => {
      const input = 'alert("XSS");\nconsole.log("test");'
      const expected = 'alert(\\"XSS\\");\\nconsole.log(\\"test\\");'
      expect(escapeJs(input)).toBe(expected)
    })
  })

  describe('sanitizeHtml', () => {
    it('应该清理 HTML 内容', () => {
      const input = '<div>Hello<script>alert("XSS")</script></div>'
      const expected = '&lt;div&gt;Hello&lt;script&gt;alert("XSS")&lt;/script&gt;&lt;/div&gt;'
      expect(sanitizeHtml(input)).toBe(expected)
    })
  })

  describe('sanitizeUrl', () => {
    it('应该只允许 http 和 https 协议', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
      expect(sanitizeUrl('javascript:alert("XSS")')).toBe('')
    })
  })

  describe('sanitizeJs', () => {
    it('应该清理 JavaScript 代码', () => {
      const input = 'eval("alert(1)"); new Function("alert(2)");'
      const expected = '; ;'
      expect(sanitizeJs(input)).toBe(expected)
    })
  })

  describe('createSafeHtml', () => {
    it('应该创建安全的 HTML 内容', () => {
      const template = '<div>{{content}}</div>'
      const data = { content: '<script>alert("XSS")</script>' }
      const expected = '<div>&lt;script&gt;alert("XSS")&lt;/script&gt;</div>'
      expect(createSafeHtml(template, data)).toBe(expected)
    })
  })

  describe('createSafeUrl', () => {
    it('应该创建安全的 URL', () => {
      const template = 'https://example.com'
      const params = { query: '<script>alert("XSS")</script>' }
      const expected = 'https://example.com?query=%3Cscript%3Ealert(%22XSS%22)%3C%2Fscript%3E'
      expect(createSafeUrl(template, params)).toBe(expected)
    })
  })

  describe('createSafeJs', () => {
    it('应该创建安全的 JavaScript 代码', () => {
      const template = 'console.log("{{message}}");'
      const data = { message: 'Hello\nWorld' }
      const expected = 'console.log("Hello\\nWorld");'
      expect(createSafeJs(template, data)).toBe(expected)
    })
  })
})
