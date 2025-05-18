import axios from 'axios'
import type { ApiResponse, FileInfo, FileOperation } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 获取文件列表
export const getFileList = async (path: string): Promise<ApiResponse<FileInfo[]>> => {
  const response = await api.get(`/files`, { params: { path } })
  return response.data
}

// 获取文件详情
export const getFileInfo = async (path: string): Promise<ApiResponse<FileInfo>> => {
  const response = await api.get(`/files/info`, { params: { path } })
  return response.data
}

// 执行文件操作
export const executeFileOperation = async (operation: FileOperation): Promise<ApiResponse> => {
  const response = await api.post('/files/operation', operation)
  return response.data
}

// 创建目录
export const createDirectory = async (path: string): Promise<ApiResponse> => {
  const response = await api.post('/files/directory', { path })
  return response.data
}

// 上传文件
export const uploadFile = async (path: string, file: File): Promise<ApiResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
