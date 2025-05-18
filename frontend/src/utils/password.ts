/**
 * 密码强度级别
 */
export enum PasswordStrength {
  WEAK = 'WEAK',
  MEDIUM = 'MEDIUM',
  STRONG = 'STRONG',
  VERY_STRONG = 'VERY_STRONG'
}

/**
 * 密码策略配置
 */
export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxConsecutiveChars: number
  minUniqueChars: number
}

/**
 * 默认密码策略
 */
export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxConsecutiveChars: 3,
  minUniqueChars: 6
}

/**
 * 检查密码强度
 * @param password 密码
 * @returns 密码强度级别
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0

  // 长度检查
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  // 字符类型检查
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // 复杂度检查
  const uniqueChars = new Set(password).size
  if (uniqueChars >= 8) score++
  if (uniqueChars >= 12) score++

  // 根据分数返回强度级别
  if (score >= 8) return PasswordStrength.VERY_STRONG
  if (score >= 6) return PasswordStrength.STRONG
  if (score >= 4) return PasswordStrength.MEDIUM
  return PasswordStrength.WEAK
}

/**
 * 验证密码是否符合策略
 * @param password 密码
 * @param policy 密码策略
 * @returns 验证结果
 */
export function validatePasswordPolicy(
  password: string,
  policy: PasswordPolicy = defaultPasswordPolicy
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // 检查长度
  if (password.length < policy.minLength) {
    errors.push(`密码长度不能少于 ${policy.minLength} 个字符`)
  }

  // 检查大写字母
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母')
  }

  // 检查小写字母
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母')
  }

  // 检查数字
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('密码必须包含数字')
  }

  // 检查特殊字符
  if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('密码必须包含特殊字符')
  }

  // 检查连续字符
  const consecutiveRegex = new RegExp(`(.)\\1{${policy.maxConsecutiveChars},}`)
  if (consecutiveRegex.test(password)) {
    errors.push(`密码不能包含超过 ${policy.maxConsecutiveChars} 个连续相同字符`)
  }

  // 检查唯一字符
  const uniqueChars = new Set(password).size
  if (uniqueChars < policy.minUniqueChars) {
    errors.push(`密码必须包含至少 ${policy.minUniqueChars} 个不同字符`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 生成随机密码
 * @param length 密码长度
 * @param options 生成选项
 * @returns 随机密码
 */
export function generateRandomPassword(
  length: number = 12,
  options: {
    includeUppercase?: boolean
    includeLowercase?: boolean
    includeNumbers?: boolean
    includeSpecialChars?: boolean
  } = {}
): string {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecialChars = true
  } = options

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let chars = ''
  if (includeUppercase) chars += uppercase
  if (includeLowercase) chars += lowercase
  if (includeNumbers) chars += numbers
  if (includeSpecialChars) chars += special

  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }

  // 确保生成的密码符合策略
  const validation = validatePasswordPolicy(password)
  if (!validation.valid) {
    return generateRandomPassword(length, options)
  }

  return password
}

/**
 * 密码强度提示信息
 */
export const passwordStrengthMessages: Record<PasswordStrength, string> = {
  [PasswordStrength.WEAK]: '密码强度较弱，建议使用更复杂的密码',
  [PasswordStrength.MEDIUM]: '密码强度一般，建议增加密码复杂度',
  [PasswordStrength.STRONG]: '密码强度良好',
  [PasswordStrength.VERY_STRONG]: '密码强度非常强'
}
