import { ref, watch } from 'vue'
import { AppError, ErrorType } from './error'

/**
 * 会话状态
 */
export interface SessionState {
  isAuthenticated: boolean
  userId: string | null
  username: string | null
  lastActivity: number
  expiresAt: number
}

/**
 * 会话配置
 */
export interface SessionConfig {
  timeout: number // 会话超时时间（毫秒）
  maxConcurrentSessions: number // 最大并发会话数
  activityCheckInterval: number // 活动检查间隔（毫秒）
}

/**
 * 默认会话配置
 */
export const defaultSessionConfig: SessionConfig = {
  timeout: 30 * 60 * 1000, // 30 分钟
  maxConcurrentSessions: 1,
  activityCheckInterval: 60 * 1000 // 1 分钟
}

// 会话状态
const sessionState = ref<SessionState>({
  isAuthenticated: false,
  userId: null,
  username: null,
  lastActivity: Date.now(),
  expiresAt: Date.now() + defaultSessionConfig.timeout
})

// 活动监听器
let activityListener: (() => void) | null = null

/**
 * 初始化会话
 * @param config 会话配置
 */
export function initSession(config: Partial<SessionConfig> = {}): void {
  const finalConfig = { ...defaultSessionConfig, ...config }

  // 设置活动监听器
  activityListener = () => {
    updateLastActivity()
  }

  // 添加活动监听
  window.addEventListener('mousemove', activityListener)
  window.addEventListener('keydown', activityListener)
  window.addEventListener('click', activityListener)
  window.addEventListener('scroll', activityListener)

  // 启动会话检查
  startSessionCheck(finalConfig.activityCheckInterval)
}

/**
 * 更新最后活动时间
 */
export function updateLastActivity(): void {
  sessionState.value.lastActivity = Date.now()
  sessionState.value.expiresAt = Date.now() + defaultSessionConfig.timeout
}

/**
 * 启动会话检查
 * @param interval 检查间隔
 */
function startSessionCheck(interval: number): void {
  setInterval(() => {
    const now = Date.now()
    if (now > sessionState.value.expiresAt) {
      handleSessionTimeout()
    }
  }, interval)
}

/**
 * 处理会话超时
 */
function handleSessionTimeout(): void {
  clearSession()
  throw new AppError('会话已过期，请重新登录', ErrorType.AUTH)
}

/**
 * 设置会话
 * @param userId 用户 ID
 * @param username 用户名
 */
export function setSession(userId: string, username: string): void {
  sessionState.value = {
    isAuthenticated: true,
    userId,
    username,
    lastActivity: Date.now(),
    expiresAt: Date.now() + defaultSessionConfig.timeout
  }
}

/**
 * 清除会话
 */
export function clearSession(): void {
  if (activityListener) {
    window.removeEventListener('mousemove', activityListener)
    window.removeEventListener('keydown', activityListener)
    window.removeEventListener('click', activityListener)
    window.removeEventListener('scroll', activityListener)
    activityListener = null
  }

  sessionState.value = {
    isAuthenticated: false,
    userId: null,
    username: null,
    lastActivity: Date.now(),
    expiresAt: Date.now() + defaultSessionConfig.timeout
  }
}

/**
 * 获取会话状态
 */
export function getSessionState(): SessionState {
  return { ...sessionState.value }
}

/**
 * 检查会话是否有效
 */
export function isSessionValid(): boolean {
  return (
    sessionState.value.isAuthenticated &&
    Date.now() <= sessionState.value.expiresAt
  )
}

/**
 * 获取剩余会话时间（毫秒）
 */
export function getRemainingSessionTime(): number {
  return Math.max(0, sessionState.value.expiresAt - Date.now())
}

/**
 * 会话状态监听器
 * @param callback 回调函数
 */
export function watchSession(callback: (state: SessionState) => void): void {
  watch(
    () => sessionState.value,
    (newState) => {
      callback({ ...newState })
    },
    { deep: true }
  )
}
