/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  BUSINESS = 'BUSINESS',
  UNKNOWN = 'UNKNOWN'
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
  type: ErrorType
  code: string
  details?: any

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, code: string = '', details?: any) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.code = code
    this.details = details
  }
}

/**
 * 错误处理函数
 * @param error 错误对象
 * @returns 处理后的错误对象
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message)
  }

  return new AppError('未知错误')
}

/**
 * 错误日志记录
 * @param error 错误对象
 * @param context 错误上下文
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const appError = handleError(error)
  console.error('错误详情:', {
    message: appError.message,
    type: appError.type,
    code: appError.code,
    details: appError.details,
    context,
    timestamp: new Date().toISOString()
  })
}

/**
 * 错误提示格式化
 * @param error 错误对象
 * @returns 格式化的错误提示
 */
export function formatErrorMessage(error: unknown): string {
  const appError = handleError(error)
  const errorMessages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '网络错误，请检查网络连接',
    [ErrorType.AUTH]: '认证失败，请重新登录',
    [ErrorType.VALIDATION]: '输入验证失败',
    [ErrorType.BUSINESS]: '业务处理失败',
    [ErrorType.UNKNOWN]: '系统错误，请稍后重试'
  }
  return errorMessages[appError.type] || appError.message
}

/**
 * 错误重试函数
 * @param fn 需要重试的函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @returns Promise
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }
  throw lastError
}
