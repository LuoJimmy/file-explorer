/**
 * 输入验证工具
 */

/**
 * 验证规则类型
 */
export type ValidationRule = {
  validate: (value: any) => boolean
  message: string
}

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * 创建验证规则
 * @param validate 验证函数
 * @param message 错误消息
 * @returns 验证规则
 */
export function createRule(
  validate: (value: any) => boolean,
  message: string
): ValidationRule {
  return { validate, message }
}

/**
 * 验证器类
 */
export class Validator {
  private rules: ValidationRule[] = []

  /**
   * 添加验证规则
   * @param rule 验证规则
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule)
  }

  /**
   * 验证值
   * @param value 要验证的值
   * @returns 验证结果
   */
  validate(value: any): ValidationResult {
    const errors: string[] = []

    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * 创建字符串验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createStringValidator(options: {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  allowedValues?: string[]
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null && value !== '',
        '此字段是必填的'
      )
    )
  }

  if (options.minLength !== undefined) {
    validator.addRule(
      createRule(
        (value) => !value || value.length >= options.minLength!,
        `长度不能少于 ${options.minLength} 个字符`
      )
    )
  }

  if (options.maxLength !== undefined) {
    validator.addRule(
      createRule(
        (value) => !value || value.length <= options.maxLength!,
        `长度不能超过 ${options.maxLength} 个字符`
      )
    )
  }

  if (options.pattern) {
    validator.addRule(
      createRule(
        (value) => !value || options.pattern!.test(value),
        '格式不正确'
      )
    )
  }

  if (options.allowedValues) {
    validator.addRule(
      createRule(
        (value) => !value || options.allowedValues!.includes(value),
        '值不在允许的范围内'
      )
    )
  }

  return validator
}

/**
 * 创建数字验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createNumberValidator(options: {
  required?: boolean
  min?: number
  max?: number
  integer?: boolean
  allowedValues?: number[]
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null && value !== '',
        '此字段是必填的'
      )
    )
  }

  validator.addRule(
    createRule(
      (value) => !value || !isNaN(Number(value)),
      '必须是数字'
    )
  )

  if (options.min !== undefined) {
    validator.addRule(
      createRule(
        (value) => !value || Number(value) >= options.min!,
        `不能小于 ${options.min}`
      )
    )
  }

  if (options.max !== undefined) {
    validator.addRule(
      createRule(
        (value) => !value || Number(value) <= options.max!,
        `不能大于 ${options.max}`
      )
    )
  }

  if (options.integer) {
    validator.addRule(
      createRule(
        (value) => !value || Number.isInteger(Number(value)),
        '必须是整数'
      )
    )
  }

  if (options.allowedValues) {
    validator.addRule(
      createRule(
        (value) => !value || options.allowedValues!.includes(Number(value)),
        '值不在允许的范围内'
      )
    )
  }

  return validator
}

/**
 * 创建日期验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createDateValidator(options: {
  required?: boolean
  min?: Date
  max?: Date
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null && value !== '',
        '此字段是必填的'
      )
    )
  }

  validator.addRule(
    createRule(
      (value) => !value || !isNaN(Date.parse(value)),
      '必须是有效的日期'
    )
  )

  if (options.min) {
    validator.addRule(
      createRule(
        (value) => !value || new Date(value) >= options.min!,
        `不能早于 ${options.min.toLocaleDateString()}`
      )
    )
  }

  if (options.max) {
    validator.addRule(
      createRule(
        (value) => !value || new Date(value) <= options.max!,
        `不能晚于 ${options.max.toLocaleDateString()}`
      )
    )
  }

  return validator
}

/**
 * 创建邮箱验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createEmailValidator(options: {
  required?: boolean
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null && value !== '',
        '此字段是必填的'
      )
    )
  }

  validator.addRule(
    createRule(
      (value) =>
        !value ||
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
      '必须是有效的邮箱地址'
    )
  )

  return validator
}

/**
 * 创建手机号验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createPhoneValidator(options: {
  required?: boolean
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null && value !== '',
        '此字段是必填的'
      )
    )
  }

  validator.addRule(
    createRule(
      (value) => !value || /^1[3-9]\d{9}$/.test(value),
      '必须是有效的手机号'
    )
  )

  return validator
}

/**
 * 创建 URL 验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createUrlValidator(options: {
  required?: boolean
  allowedProtocols?: string[]
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null && value !== '',
        '此字段是必填的'
      )
    )
  }

  validator.addRule(
    createRule(
      (value) => {
        if (!value) return true
        try {
          const url = new URL(value)
          if (options.allowedProtocols) {
            return options.allowedProtocols.includes(url.protocol)
          }
          return true
        } catch {
          return false
        }
      },
      '必须是有效的 URL'
    )
  )

  return validator
}

/**
 * 创建文件验证器
 * @param options 验证选项
 * @returns 验证器
 */
export function createFileValidator(options: {
  required?: boolean
  maxSize?: number
  allowedTypes?: string[]
} = {}): Validator {
  const validator = new Validator()

  if (options.required) {
    validator.addRule(
      createRule(
        (value) => value !== undefined && value !== null,
        '此字段是必填的'
      )
    )
  }

  if (options.maxSize) {
    validator.addRule(
      createRule(
        (value) => !value || value.size <= options.maxSize!,
        `文件大小不能超过 ${options.maxSize} 字节`
      )
    )
  }

  if (options.allowedTypes) {
    validator.addRule(
      createRule(
        (value) => !value || options.allowedTypes!.includes(value.type),
        '不支持的文件类型'
      )
    )
  }

  return validator
}
