export interface FileInfo {
  name: string
  path: string
  size: number
  isDirectory: boolean
  isSymbolicLink: boolean
  isHidden: boolean
  permissions: string
  owner: string
  group: string
  lastModified: string
  lastAccessed: string
  created: string
  hardLinks: number
  target?: string
  type?: string
  mimeType?: string
}

// API 相关类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 文件操作相关类型
export interface FileOperation {
  type: 'copy' | 'move' | 'delete' | 'rename'
  source: string
  target?: string
  newName?: string
}

// 用户设置相关类型
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  showHiddenFiles: boolean
  sortBy: 'name' | 'size' | 'modified' | 'type'
  sortOrder: 'asc' | 'desc'
  viewMode: 'list' | 'grid'
}
