import type { Directive } from 'vue'
import { escapeHtml, sanitizeInput } from '../utils/security'

/**
 * XSS 防护指令
 * 用于转义 HTML 内容，防止 XSS 攻击
 */
export const vXss: Directive = {
  mounted(el: HTMLElement) {
    if (el.textContent) {
      el.textContent = escapeHtml(el.textContent)
    }
  },
  updated(el: HTMLElement) {
    if (el.textContent) {
      el.textContent = escapeHtml(el.textContent)
    }
  }
}

/**
 * 输入净化指令
 * 用于清理用户输入，移除潜在的危险内容
 */
export const vSanitize: Directive = {
  mounted(el: HTMLElement) {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement
        target.value = sanitizeInput(target.value)
      })
    }
  }
}

/**
 * 外部链接安全指令
 * 用于处理外部链接，添加安全属性
 */
export const vExternalLink: Directive = {
  mounted(el: HTMLElement) {
    if (el instanceof HTMLAnchorElement) {
      // 添加 rel="noopener noreferrer" 防止钓鱼攻击
      el.setAttribute('rel', 'noopener noreferrer')
      // 添加 target="_blank" 在新窗口打开
      el.setAttribute('target', '_blank')
    }
  }
}

/**
 * 图片安全加载指令
 * 用于处理图片加载失败的情况
 */
export const vSafeImage: Directive = {
  mounted(el: HTMLElement) {
    if (el instanceof HTMLImageElement) {
      // 设置默认图片
      const defaultImage = '/images/placeholder.png'

      // 处理加载错误
      el.addEventListener('error', () => {
        el.src = defaultImage
        el.alt = '图片加载失败'
      })

      // 处理加载成功
      el.addEventListener('load', () => {
        el.classList.add('loaded')
      })
    }
  }
}

/**
 * 复制保护指令
 * 用于防止用户复制内容
 */
export const vNoCopy: Directive = {
  mounted(el: HTMLElement) {
    el.addEventListener('copy', (event) => {
      event.preventDefault()
    })
    el.addEventListener('cut', (event) => {
      event.preventDefault()
    })
    el.addEventListener('paste', (event) => {
      event.preventDefault()
    })
  }
}

/**
 * 右键菜单保护指令
 * 用于禁用右键菜单
 */
export const vNoContextMenu: Directive = {
  mounted(el: HTMLElement) {
    el.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
  }
}
