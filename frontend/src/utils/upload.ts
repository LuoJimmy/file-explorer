/**
 * 文件类型配置
 */
export interface FileTypeConfig {
  mimeTypes: string[]
  extensions: string[]
  maxSize: number // 字节
}

/**
 * 默认文件类型配置
 */
export const defaultFileTypes: Record<string, FileTypeConfig> = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  document: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    extensions: ['.mp4', '.webm', '.ogg'],
    maxSize: 100 * 1024 * 1024 // 100MB
  },
  audio: {
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    extensions: ['.mp3', '.wav', '.ogg'],
    maxSize: 20 * 1024 * 1024 // 20MB
  }
}

/**
 * 文件验证结果
 */
export interface FileValidationResult {
  valid: boolean
  errors: string[]
  type?: string
}

/**
 * 验证文件
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型
 * @returns 验证结果
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = Object.keys(defaultFileTypes)
): FileValidationResult {
  const errors: string[] = []
  let fileType: string | undefined

  // 检查文件类型
  for (const type of allowedTypes) {
    const config = defaultFileTypes[type]
    if (config.mimeTypes.includes(file.type)) {
      fileType = type
      break
    }
  }

  if (!fileType) {
    errors.push('不支持的文件类型')
    return { valid: false, errors }
  }

  const config = defaultFileTypes[fileType]

  // 检查文件大小
  if (file.size > config.maxSize) {
    errors.push(`文件大小不能超过 ${formatFileSize(config.maxSize)}`)
  }

  // 检查文件扩展名
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (!config.extensions.includes(extension)) {
    errors.push('不支持的文件扩展名')
  }

  return {
    valid: errors.length === 0,
    errors,
    type: fileType
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

/**
 * 获取文件 MIME 类型
 * @param file 文件对象
 * @returns Promise<string>
 */
export function getFileMimeType(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const array = new Uint8Array(event.target?.result as ArrayBuffer).subarray(0, 4)
      const header = Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      const mimeTypes: Record<string, string> = {
        '89504e47': 'image/png',
        '47494638': 'image/gif',
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        'ffd8ffe2': 'image/jpeg',
        'ffd8ffe3': 'image/jpeg',
        'ffd8ffe8': 'image/jpeg',
        '25504446': 'application/pdf',
        '504b0304': 'application/zip'
      }

      resolve(mimeTypes[header] || file.type)
    }
    reader.onerror = () => reject(new Error('无法读取文件'))
    reader.readAsArrayBuffer(file.slice(0, 4))
  })
}

/**
 * 扫描文件内容
 * @param file 文件对象
 * @returns Promise<boolean>
 */
export async function scanFileContent(file: File): Promise<boolean> {
  // 这里可以实现文件内容扫描逻辑
  // 例如：检查文件是否包含恶意代码、病毒等
  return true
}

/**
 * 生成文件哈希
 * @param file 文件对象
 * @returns Promise<string>
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 创建文件上传进度监听器
 * @param onProgress 进度回调
 * @returns 进度监听器
 */
export function createUploadProgressListener(
  onProgress: (progress: number) => void
): (event: ProgressEvent) => void {
  return (event: ProgressEvent) => {
    if (event.lengthComputable) {
      const progress = (event.loaded / event.total) * 100
      onProgress(progress)
    }
  }
}
