// 文件操作类型
export const FILE_OPERATIONS = {
  COPY: 'copy',
  MOVE: 'move',
  DELETE: 'delete',
  RENAME: 'rename'
} as const

// 文件排序方式
export const SORT_TYPES = {
  NAME: 'name',
  SIZE: 'size',
  MODIFIED: 'modified',
  TYPE: 'type'
} as const

// 排序顺序
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
} as const

// 视图模式
export const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid'
} as const

// 文件类型图标映射
export const FILE_TYPE_ICONS = {
  // 文档
  'application/pdf': 'ri-file-pdf-line',
  'application/msword': 'ri-file-word-line',
  'application/vnd.ms-excel': 'ri-file-excel-line',
  'application/vnd.ms-powerpoint': 'ri-file-ppt-line',
  'text/plain': 'ri-file-text-line',
  'text/markdown': 'ri-markdown-line',
  'text/html': 'ri-html5-line',
  'text/css': 'ri-css3-line',
  'text/javascript': 'ri-javascript-line',
  'application/json': 'ri-code-line',
  // 图片
  'image/jpeg': 'ri-image-line',
  'image/png': 'ri-image-line',
  'image/gif': 'ri-image-line',
  'image/svg+xml': 'ri-image-line',
  // 音频
  'audio/mpeg': 'ri-file-music-line',
  'audio/wav': 'ri-file-music-line',
  // 视频
  'video/mp4': 'ri-file-video-line',
  'video/webm': 'ri-file-video-line',
  // 压缩文件
  'application/zip': 'ri-file-zip-line',
  'application/x-rar-compressed': 'ri-file-zip-line',
  'application/x-7z-compressed': 'ri-file-zip-line',
  // 其他
  'application/octet-stream': 'ri-file-line',
  'inode/directory': 'ri-folder-line',
  'inode/symlink': 'ri-link-line'
} as const

// 默认文件图标
export const DEFAULT_FILE_ICON = 'ri-file-line'
export const DEFAULT_FOLDER_ICON = 'ri-folder-line'
export const DEFAULT_SYMLINK_ICON = 'ri-link-line'
