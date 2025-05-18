describe('安全功能测试', () => {
  beforeEach(() => {
    cy.visit('/security-demo')
  })

  it('应该正确转义 HTML 内容', () => {
    const xssInput = '<script>alert("XSS")</script>'
    cy.get('input[placeholder="输入包含 HTML 标签的文本"]').type(xssInput)
    cy.contains('button', '转义').click()
    cy.get('.result').should('contain', '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
  })

  it('应该能够刷新 CSRF Token', () => {
    cy.get('.token-display').invoke('text').as('oldToken')
    cy.contains('button', '刷新 Token').click()
    cy.get('.token-display').invoke('text').should('not.equal', '@oldToken')
  })

  it('应该能够加密和解密文本', () => {
    const testText = '测试文本'
    const testPassword = '测试密码'

    cy.get('input[placeholder="输入要加密的文本"]').type(testText)
    cy.get('input[placeholder="输入密码"]').type(testPassword)
    cy.contains('button', '加密').click()
    cy.get('.result').should('contain', '加密结果：')

    cy.contains('button', '解密').click()
    cy.get('.result').should('contain', `解密结果：${testText}`)
  })

  it('应该验证邮箱格式', () => {
    // 测试无效邮箱
    cy.get('input[placeholder="输入邮箱地址"]').type('invalid-email')
    cy.contains('button', '验证').click()
    cy.get('.result').should('contain', '必须是有效的邮箱地址')

    // 测试有效邮箱
    cy.get('input[placeholder="输入邮箱地址"]').clear().type('test@example.com')
    cy.contains('button', '验证').click()
    cy.get('.result').should('contain', '验证通过')
  })

  it('应该根据权限显示按钮', () => {
    // 检查默认用户权限
    cy.get('.permission-buttons').should('contain', '需要写权限的按钮')
    cy.get('.permission-buttons').should('not.contain', '需要管理员角色的按钮')

    // 模拟管理员权限
    cy.window().then((win) => {
      win.localStorage.setItem('userRole', 'admin')
      cy.reload()
      cy.get('.permission-buttons').should('contain', '需要管理员角色的按钮')
    })
  })

  it('应该显示当前角色和权限', () => {
    cy.get('.permission-status').should('contain', '当前角色：')
    cy.get('.permission-status').should('contain', '当前权限：')
  })
})
