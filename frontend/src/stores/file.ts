import { defineStore } from 'pinia'
import type { FileInfo } from '../types'
import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    console.log('Request:', config.method?.toUpperCase(), config.url, config.params)
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data)
    return response
  },
  error => {
    console.error('Response Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// 定义 store 的类型
interface FileStoreState {
  currentPath: string
  files: FileInfo[]
  selectedFile: FileInfo | null
  selectedFiles: FileInfo[]
  clipboard: FileInfo[]
  clipboardAction: 'copy' | 'cut' | null
  viewMode: 'list' | 'grid'
  history: string[]
  historyIndex: number
  loading: boolean
  error: string | null
  showHiddenFiles: boolean
  sortBy: 'name' | 'size' | 'modified' | 'type'
  sortOrder: 'asc' | 'desc'
}

export type UseFileStore = ReturnType<typeof useFileStore>

export const useFileStore = defineStore('file', {
  state: (): FileStoreState => ({
    currentPath: '/',
    files: [],
    selectedFile: null,
    selectedFiles: [],
    clipboard: [],
    clipboardAction: null,
    viewMode: 'list',
    history: [],
    historyIndex: -1,
    loading: false,
    error: null,
    showHiddenFiles: false,
    sortBy: 'name',
    sortOrder: 'asc'
  }),

  getters: {
    canGoBack: (state) => state.historyIndex > 0,
    canGoForward: (state) => state.historyIndex < state.history.length - 1,
    canGoUp: (state) => state.currentPath !== '/',
    hasSelection: (state) => state.selectedFiles.length > 0,
    hasClipboard: (state) => state.clipboard.length > 0,
    breadcrumbs: (state) => {
      const parts = state.currentPath.split('/').filter(Boolean)
      const breadcrumbs = [{ name: '根目录', path: '/' }]
      let currentPath = ''
      parts.forEach(part => {
        currentPath += '/' + part
        breadcrumbs.push({ name: part, path: currentPath })
      })
      return breadcrumbs
    },
    sortedFiles: (state) => {
      let files = [...state.files]

      // 过滤隐藏文件
      if (!state.showHiddenFiles) {
        files = files.filter(file => !file.isHidden)
      }

      // 排序
      files.sort((a, b) => {
        let comparison = 0
        switch (state.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'size':
            comparison = a.size - b.size
            break
          case 'modified':
            comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
            break
          case 'type':
            comparison = (a.isDirectory ? 0 : 1) - (b.isDirectory ? 0 : 1)
            if (comparison === 0) {
              comparison = a.name.localeCompare(b.name)
            }
            break
        }
        return state.sortOrder === 'asc' ? comparison : -comparison
      })

      return files
    }
  },

  actions: {
    async fetchFiles(this: UseFileStore, path: string = this.currentPath) {
      console.log('Fetching files for path:', path)
      this.loading = true
      this.error = null
      try {
        console.log('Making API request to /files with params:', { path })
        const response = await api.get('/files', {
          params: { path }
        })
        console.log('Received response:', response)
        this.files = response.data
        this.currentPath = path
        this.history = this.history.slice(0, this.historyIndex + 1)
        this.history.push(path)
        this.historyIndex = this.history.length - 1
        this.clearSelection()
      } catch (error) {
        console.error('获取文件列表失败:', error)
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            data: error.response.data
          })
        }
        this.error = error instanceof Error ? error.message : '获取文件列表失败'
      } finally {
        this.loading = false
      }
    },

    setCurrentPath(this: UseFileStore, path: string) {
      this.currentPath = path
      this.fetchFiles(path)
    },

    setFiles(this: UseFileStore, files: FileInfo[]) {
      this.files = files
    },

    setSelectedFile(this: UseFileStore, file: FileInfo | null) {
      console.log('Setting selected file:', file)
      this.selectedFile = file
      this.selectedFiles = file ? [file] : []
      console.log('Selected files updated:', this.selectedFiles)
    },

    toggleFileSelection(this: UseFileStore, file: FileInfo) {
      console.log('Toggling file selection:', file)
      const index = this.selectedFiles.findIndex(f => f.path === file.path)
      if (index === -1) {
        this.selectedFiles = [...this.selectedFiles, file]
        this.selectedFile = file
      } else {
        this.selectedFiles = this.selectedFiles.filter(f => f.path !== file.path)
        if (this.selectedFile?.path === file.path) {
          this.selectedFile = null
        }
      }
      console.log('Selected files after toggle:', this.selectedFiles)
    },

    clearSelection(this: UseFileStore) {
      this.selectedFiles = []
      this.selectedFile = null
    },

    setViewMode(this: UseFileStore, mode: 'list' | 'grid') {
      this.viewMode = mode
    },

    toggleHiddenFiles(this: UseFileStore) {
      this.showHiddenFiles = !this.showHiddenFiles
    },

    setSortOptions(this: UseFileStore, sortBy: 'name' | 'size' | 'modified' | 'type', sortOrder: 'asc' | 'desc') {
      this.sortBy = sortBy
      this.sortOrder = sortOrder
    },

    copyToClipboard(this: UseFileStore, files: FileInfo[] = this.selectedFiles) {
      this.clipboard = [...files]
      this.clipboardAction = 'copy'
    },

    cutToClipboard(this: UseFileStore, files: FileInfo[] = this.selectedFiles) {
      this.clipboard = [...files]
      this.clipboardAction = 'cut'
    },

    pasteFromClipboard(this: UseFileStore) {
      // TODO: 实现粘贴逻辑
      console.log('Paste from clipboard:', this.clipboard, this.clipboardAction)
    },

    goBack(this: UseFileStore) {
      if (this.canGoBack) {
        this.historyIndex--
        this.fetchFiles(this.history[this.historyIndex])
      }
    },

    goForward(this: UseFileStore) {
      if (this.canGoForward) {
        this.historyIndex++
        this.fetchFiles(this.history[this.historyIndex])
      }
    },

    goUp(this: UseFileStore) {
      if (this.canGoUp) {
        const parentPath = this.currentPath.split('/').slice(0, -1).join('/') || '/'
        this.fetchFiles(parentPath)
      }
    },

    navigateTo(this: UseFileStore, path: string) {
      this.fetchFiles(path)
    },

    async moveFile(this: UseFileStore, sourcePath: string, targetPath: string) {
      try {
        await api.post('/files/move', {
          source: sourcePath,
          target: targetPath
        })
        await this.fetchFiles(this.currentPath)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '移动文件失败'
        throw error
      }
    },

    async renameFile(this: UseFileStore, file: FileInfo, newName: string) {
      try {
        await api.post('/files/rename', {
          path: file.path,
          newName
        })
        await this.fetchFiles(this.currentPath)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '重命名文件失败'
        throw error
      }
    },

    async deleteSelectedFiles(this: UseFileStore) {
      try {
        for (const file of this.selectedFiles) {
          await api.delete('/files', {
            params: { path: file.path }
          })
        }
        await this.fetchFiles(this.currentPath)
        this.clearSelection()
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除文件失败'
        throw error
      }
    },

    async createHardLink(this: UseFileStore, source: FileInfo, targetPath: string) {
      try {
        await api.post('/files/hardlink', {
          source: source.path,
          target: targetPath
        })
        await this.fetchFiles(this.currentPath)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建硬链接失败'
        throw error
      }
    },

    async createSymLink(this: UseFileStore, source: FileInfo, targetPath: string) {
      try {
        await api.post('/files/symlink', {
          source: source.path,
          target: targetPath
        })
        await this.fetchFiles(this.currentPath)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建符号链接失败'
        throw error
      }
    },

    async findHardLinks(this: UseFileStore, file: FileInfo) {
      try {
        const response = await api.get('/files/hardlinks', {
          params: { path: file.path }
        })
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '查找硬链接失败'
        throw error
      }
    },

    async deleteHardLink(this: UseFileStore, path: string) {
      try {
        await api.delete('/files/hardlink', {
          params: { path }
        })
        await this.fetchFiles(this.currentPath)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除硬链接失败'
        throw error
      }
    },

    async deleteAllHardLinks(this: UseFileStore, file: FileInfo) {
      try {
        await api.delete('/files/hardlinks', {
          params: { path: file.path }
        })
        await this.fetchFiles(this.currentPath)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除所有硬链接失败'
        throw error
      }
    },

    async openFile(this: UseFileStore, file: FileInfo) {
      try {
        const response = await api.get('/files/open', {
          params: { path: file.path }
        })
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '打开文件失败'
        throw error
      }
    }
  }
})
