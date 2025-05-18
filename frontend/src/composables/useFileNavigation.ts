import { ref } from 'vue'
import type { FileInfo } from '../types'
import type { UseFileStore } from '../stores/file'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export function useFileNavigation(fileStore: UseFileStore, emit: (event: string, ...args: any[]) => void) {
  const navigateTo = async (path: string): Promise<boolean> => {
    try {
      await fileStore.fetchFiles(path)
      return true
    } catch (error) {
      console.error('导航失败:', error)
      return false
    }
  }

  const navigateUp = async (): Promise<boolean> => {
    if (!fileStore.currentPath) return false

    const parts = fileStore.currentPath.split('/').filter(Boolean)
    parts.pop()
    const parentPath = parts.join('/')

    return navigateTo(parentPath)
  }

  const refreshDirectory = async () => {
    return fileStore.fetchFiles(fileStore.currentPath)
  }

  const handleFileAction = async (action: string, file: FileInfo) => {
    switch (action) {
      case 'open':
        if (file.isDirectory) {
          await navigateTo(file.path)
        } else {
          // 直接在浏览器中打开文件
          const fileUrl = `/api/files/content?path=${encodeURIComponent(file.path)}`
          window.open(fileUrl, '_blank')
        }
        break
      case 'rename':
        emit('action', 'rename', file)
        break
      case 'delete':
        emit('action', 'delete', file)
        break
      case 'properties':
        emit('action', 'properties', file)
        break
    }
  }

  const selectFile = (path: string, multiSelect: boolean) => {
    const file = fileStore.files.find((f: FileInfo) => f.path === path)
    if (!file) return

    if (multiSelect) {
      fileStore.toggleFileSelection(file)
    } else {
      fileStore.setSelectedFile(file)
    }
  }

  const handleFileClick = (path: string, multiSelect: boolean) => {
    selectFile(path, multiSelect)
  }

  const handleFileDoubleClick = (file: FileInfo) => {
    if (file.isDirectory) {
      navigateTo(file.path)
    } else {
      handleFileAction('open', file)
    }
  }

  const handleFileContextMenu = (event: MouseEvent, file: FileInfo) => {
    event.preventDefault()
    selectFile(file.path, event.ctrlKey || event.metaKey)
    emit('context-menu', event, file)
  }

  const handleFileDragStart = (event: DragEvent, file: FileInfo) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', file.path)
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleFileDrop = async (event: DragEvent) => {
    event.preventDefault()
    const sourcePath = event.dataTransfer?.getData('text/plain')
    if (sourcePath) {
      try {
        await fileStore.moveFile(sourcePath, fileStore.currentPath)
      } catch (error) {
        console.error('移动文件失败:', error)
      }
    }
  }

  const handleFileDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  const handleFileDragLeave = (event: DragEvent) => {
    event.preventDefault()
  }

  const findHardLinks = async (file: FileInfo) => {
    try {
      if (file.isDirectory) {
        throw new Error('只能查找文件的硬链接')
      }

      const response = await api.get('/links/find-hardlinks', {
        params: { path: file.path }
      })
      return response.data
    } catch (error) {
      console.error('查找硬链接失败:', error)
      throw error
    }
  }

  const getSymLinkTarget = async (file: FileInfo) => {
    try {
      const response = await api.get('/files/symlink-target', {
        params: { path: file.path }
      })
      return response.data.target
    } catch (error) {
      console.error('获取符号链接目标失败:', error)
      throw error
    }
  }

  const deleteHardLink = async (path: string) => {
    try {
      await api.delete('/files/hardlink', {
        params: { path }
      })
    } catch (error) {
      console.error('删除硬链接失败:', error)
      throw error
    }
  }

  const deleteAllHardLinks = async (path: string) => {
    try {
      await api.delete('/files/hardlinks', {
        params: { path }
      })
    } catch (error) {
      console.error('删除所有硬链接失败:', error)
      throw error
    }
  }

  return {
    navigateTo,
    navigateUp,
    refreshDirectory,
    handleFileAction,
    selectFile,
    handleFileClick,
    handleFileDoubleClick,
    handleFileContextMenu,
    handleFileDragStart,
    handleFileDrop,
    handleFileDragOver,
    handleFileDragLeave,
    findHardLinks,
    getSymLinkTarget,
    deleteHardLink,
    deleteAllHardLinks
  }
}
