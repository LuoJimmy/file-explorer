import type { FileInfo } from '../types'

export function getFileIcon(file: FileInfo): string {
  if (file.isDirectory) {
    return 'ri-folder-line'
  }
  if (file.isSymbolicLink) {
    return 'ri-link'
  }
  return 'ri-file-line'
}

export function getFileType(file: FileInfo): string {
  if (file.isDirectory) {
    return '文件夹'
  }
  if (file.isSymbolicLink) {
    return '符号链接'
  }
  if (file.mimeType) {
    return file.mimeType.split('/')[1].toUpperCase()
  }
  return '文件'
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)
}

export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext)
}

export function isAudioFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['mp3', 'wav', 'ogg', 'm4a'].includes(ext)
}

export function isTextFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'py', 'java', 'c', 'cpp', 'h', 'hpp'].includes(ext)
}

export function isArchiveFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)
}

export function isPdfFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf'
}

export function isCodeFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['js', 'ts', 'jsx', 'tsx', 'vue', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go', 'rs', 'php'].includes(ext)
}
