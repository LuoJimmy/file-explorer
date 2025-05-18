<template>
  <div class="security-demo">
    <h2>安全工具示例</h2>

    <!-- XSS 防护示例 -->
    <section class="demo-section">
      <h3>XSS 防护</h3>
      <div class="demo-item">
        <h4>HTML 转义</h4>
        <div class="input-group">
          <input v-model="xssInput" placeholder="输入包含 HTML 标签的文本" />
          <button @click="handleXssEscape">转义</button>
        </div>
        <div class="result">
          <p>原始文本：{{ xssInput }}</p>
          <p>转义后：{{ escapedHtml }}</p>
        </div>
      </div>
    </section>

    <!-- CSRF 防护示例 -->
    <section class="demo-section">
      <h3>CSRF 防护</h3>
      <div class="demo-item">
        <h4>CSRF Token</h4>
        <div class="token-display">
          <p>当前 Token：{{ csrfToken }}</p>
          <button @click="refreshToken">刷新 Token</button>
        </div>
      </div>
    </section>

    <!-- 加密示例 -->
    <section class="demo-section">
      <h3>加密工具</h3>
      <div class="demo-item">
        <h4>AES 加密/解密</h4>
        <div class="input-group">
          <input v-model="encryptInput" placeholder="输入要加密的文本" />
          <input v-model="encryptPassword" type="password" placeholder="输入密码" />
          <button @click="handleEncrypt">加密</button>
          <button @click="handleDecrypt">解密</button>
        </div>
        <div class="result">
          <p>加密结果：{{ encryptedResult }}</p>
          <p>解密结果：{{ decryptedResult }}</p>
        </div>
      </div>
    </section>

    <!-- 输入验证示例 -->
    <section class="demo-section">
      <h3>输入验证</h3>
      <div class="demo-item">
        <h4>邮箱验证</h4>
        <div class="input-group">
          <input v-model="emailInput" placeholder="输入邮箱地址" />
          <button @click="validateEmail">验证</button>
        </div>
        <div class="result">
          <p>验证结果：{{ emailValidationResult }}</p>
        </div>
      </div>
    </section>

    <!-- 权限控制示例 -->
    <section class="demo-section">
      <h3>权限控制</h3>
      <div class="demo-item">
        <h4>权限检查</h4>
        <div class="permission-buttons">
          <button v-permission="'write'">需要写权限的按钮</button>
          <button v-role="'admin'">需要管理员角色的按钮</button>
        </div>
        <div class="permission-status">
          <p>当前角色：{{ currentRole }}</p>
          <p>当前权限：{{ currentPermissions.join(', ') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { escapeHtml } from '../utils/xss'
import { getCsrfToken, refreshCsrfToken } from '../utils/csrf'
import { deriveKey, encrypt, decrypt } from '../utils/crypto'
import { createEmailValidator } from '../utils/validator'
import { permissionManager, checkPermission, checkRole } from '../utils/permission'

// XSS 防护
const xssInput = ref('')
const escapedHtml = ref('')

const handleXssEscape = () => {
  escapedHtml.value = escapeHtml(xssInput.value)
}

// CSRF 防护
const csrfToken = ref('')

const refreshToken = () => {
  csrfToken.value = refreshCsrfToken()
}

// 加密工具
const encryptInput = ref('')
const encryptPassword = ref('')
const encryptedResult = ref('')
const decryptedResult = ref('')
let currentKey: CryptoKey | null = null

const handleEncrypt = async () => {
  try {
    const salt = 'demo-salt'
    currentKey = await deriveKey(encryptPassword.value, salt)
    const result = await encrypt(encryptInput.value, currentKey)
    encryptedResult.value = `IV: ${result.iv}, Data: ${result.data}`
  } catch (error) {
    console.error('加密失败:', error)
  }
}

const handleDecrypt = async () => {
  try {
    if (!currentKey || !encryptedResult.value) return
    const [iv, data] = encryptedResult.value.split(', ').map(s => s.split(': ')[1])
    decryptedResult.value = await decrypt(data, iv, currentKey)
  } catch (error) {
    console.error('解密失败:', error)
  }
}

// 输入验证
const emailInput = ref('')
const emailValidationResult = ref('')

const validateEmail = () => {
  const validator = createEmailValidator({ required: true })
  const result = validator.validate(emailInput.value)
  emailValidationResult.value = result.valid ? '验证通过' : result.errors.join(', ')
}

// 权限控制
const currentRole = ref('user')
const currentPermissions = ref<string[]>([])

onMounted(() => {
  // 初始化 CSRF Token
  csrfToken.value = getCsrfToken()

  // 设置用户角色和权限
  permissionManager.setUserRoles([currentRole.value])
  currentPermissions.value = permissionManager.getUserPermissions()
})
</script>

<style scoped>
.security-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.demo-item {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.token-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.permission-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.permission-status {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
