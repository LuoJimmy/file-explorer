import type { FileInfo } from '../types'
import type { UseFileStore } from '../stores/file'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

interface CreateLinkParams {
  sourcePath: string
  targetPath: string
  type: 'symlink' | 'hardlink'
  name: string
}

export function useFileOperations(fileStore: UseFileStore) {
  const createFolder = async (folderName: string): Promise<boolean> => {
    try {
      const response = await api.post('/folders', {
        path: fileStore.currentPath,
        name: folderName
      })
      if (response.data.success) {
        await refreshDirectory()
        return true
      }
      return false
    } catch (error) {
      console.error('创建文件夹失败:', error)
      return false
    }
  }

  const uploadFiles = async (files: FileList): Promise<boolean> => {
    try {
      const formData = new FormData()
      formData.append('path', fileStore.currentPath)
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.data.success) {
        await refreshDirectory()
        return true
      }
      return false
    } catch (error) {
      console.error('上传文件失败:', error)
      return false
    }
  }

  const deleteSelected = async (): Promise<boolean> => {
    try {
      const response = await api.post('/files/delete', {
        paths: fileStore.selectedFiles.map(file => file.path)
      })
      if (response.data.success) {
        await refreshDirectory()
        return true
      }
      return false
    } catch (error) {
      console.error('删除文件失败:', error)
      return false
    }
  }

  const createLink = async ({ sourcePath, targetPath, type, name }: CreateLinkParams) => {
    try {
      await api.post('/files/link', {
        sourcePath,
        targetPath,
        type,
        name
      })
      await fileStore.fetchFiles()
    } catch (error) {
      console.error('创建链接失败:', error)
      throw error
    }
  }

  const openFile = async (file: FileInfo): Promise<{ success: boolean; message?: string }> => {
    try {
      // 获取文件扩展名
      const ext = file.name.split('.').pop()?.toLowerCase() || ''

      // 根据文件类型直接打开
      const fileType = {
        // 文本文件
        text: ['txt', 'md', 'json', 'js', 'css', 'html', 'xml', 'yaml', 'yml', 'ini', 'conf', 'log'],
        // 图片文件
        image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
        // PDF文件
        pdf: ['pdf']
      }

      // 构建文件URL
      const fileUrl = `/api/files/content?path=${encodeURIComponent(file.path)}`

      // 根据文件类型处理
      if (fileType.text.includes(ext) || fileType.image.includes(ext) || fileType.pdf.includes(ext)) {
        // 文本、图片、PDF文件：在新标签页中打开
        window.open(fileUrl, '_blank')
      } else {
        // 其他文件：下载
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      return { success: true }
    } catch (error) {
      console.error('打开文件失败:', error)
      return { success: false, message: `打开文件失败: ${error instanceof Error ? error.message : '未知错误'}` }
    }
  }

  const refreshDirectory = async () => {
    console.log('Refreshing directory:', fileStore.currentPath)
    await fileStore.fetchFiles(fileStore.currentPath)
  }

  return {
    createFolder,
    uploadFiles,
    deleteSelected,
    createLink,
    openFile,
    refreshDirectory
  }
}
