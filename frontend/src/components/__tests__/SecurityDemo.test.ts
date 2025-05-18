import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SecurityDemo from '../SecurityDemo.vue'
import { permissionManager } from '../../utils/permission'

describe('SecurityDemo 组件', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(SecurityDemo)
  })

  describe('XSS 防护', () => {
    it('应该正确转义 HTML 内容', async () => {
      const input = wrapper.find('input[placeholder="输入包含 HTML 标签的文本"]')
      await input.setValue('<script>alert("XSS")</script>')
      await wrapper.find('button').trigger('click')

      const result = wrapper.find('.result')
      expect(result.text()).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
    })
  })

  describe('CSRF 防护', () => {
    it('应该显示 CSRF Token', () => {
      const tokenDisplay = wrapper.find('.token-display')
      expect(tokenDisplay.text()).toContain('当前 Token：')
    })

    it('应该能够刷新 Token', async () => {
      const oldToken = wrapper.find('.token-display').text()
      await wrapper.find('button').trigger('click')
      const newToken = wrapper.find('.token-display').text()
      expect(oldToken).not.toBe(newToken)
    })
  })

  describe('加密工具', () => {
    it('应该能够加密和解密文本', async () => {
      const textInput = wrapper.find('input[placeholder="输入要加密的文本"]')
      const passwordInput = wrapper.find('input[placeholder="输入密码"]')
      const encryptButton = wrapper.findAll('button').at(2)
      const decryptButton = wrapper.findAll('button').at(3)

      await textInput.setValue('测试文本')
      await passwordInput.setValue('测试密码')
      await encryptButton?.trigger('click')

      const encryptedResult = wrapper.find('.result').text()
      expect(encryptedResult).toContain('加密结果：')

      await decryptButton?.trigger('click')
      const decryptedResult = wrapper.find('.result').text()
      expect(decryptedResult).toContain('解密结果：测试文本')
    })
  })

  describe('输入验证', () => {
    it('应该验证邮箱格式', async () => {
      const emailInput = wrapper.find('input[placeholder="输入邮箱地址"]')
      const validateButton = wrapper.findAll('button').at(4)

      await emailInput.setValue('invalid-email')
      await validateButton?.trigger('click')
      expect(wrapper.find('.result').text()).toContain('必须是有效的邮箱地址')

      await emailInput.setValue('test@example.com')
      await validateButton?.trigger('click')
      expect(wrapper.find('.result').text()).toContain('验证通过')
    })
  })

  describe('权限控制', () => {
    it('应该根据权限显示按钮', async () => {
      // 设置用户角色为 admin
      permissionManager.setUserRoles(['admin'])
      await wrapper.vm.$nextTick()

      const permissionButtons = wrapper.find('.permission-buttons')
      expect(permissionButtons.text()).toContain('需要写权限的按钮')
      expect(permissionButtons.text()).toContain('需要管理员角色的按钮')

      // 设置用户角色为 user
      permissionManager.setUserRoles(['user'])
      await wrapper.vm.$nextTick()

      expect(permissionButtons.text()).toContain('需要写权限的按钮')
      expect(permissionButtons.text()).not.toContain('需要管理员角色的按钮')
    })

    it('应该显示当前角色和权限', () => {
      const status = wrapper.find('.permission-status')
      expect(status.text()).toContain('当前角色：user')
      expect(status.text()).toContain('当前权限：')
    })
  })
})
