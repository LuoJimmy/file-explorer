<script setup lang="ts">
import { ref } from 'vue'
import {
  RiUploadCloudLine,
  RiDeleteBinLine,
  RiFileLine,
  RiImageLine,
  RiVideoLine,
  RiMusicLine,
  RiFileTextLine,
  RiFileZipLine,
  RiFilePdfLine,
  RiFileWordLine,
  RiFileExcelLine,
  RiFilePptLine,
  RiCloseLine,
  RiUploadCloud2Line
} from '@remixicon/vue'

interface FileItem {
  name: string
  size: number
  type: string
  status: 'success' | 'error' | 'uploading'
  progress?: number
  error?: string
}

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxCount?: number
  disabled?: boolean
  drag?: boolean
  showFileList?: boolean
  listType?: 'text' | 'picture' | 'picture-card'
  action?: string
  headers?: Record<string, string>
  data?: Record<string, any>
  withCredentials?: boolean
  name?: string
  autoUpload?: boolean
  onProgress?: (event: ProgressEvent, file: FileItem) => void
  onSuccess?: (response: any, file: FileItem) => void
  onError?: (error: Error, file: FileItem) => void
  onExceed?: (files: FileItem[]) => void
  beforeUpload?: (file: File) => boolean | Promise<File>
  beforeRemove?: (file: FileItem) => boolean | Promise<boolean>
}

const props = withDefaults(defineProps<Props>(), {
  accept: '',
  multiple: false,
  maxSize: 0,
  maxCount: 0,
  disabled: false,
  drag: false,
  showFileList: true,
  listType: 'text',
  action: '',
  headers: () => ({}),
  data: () => ({}),
  withCredentials: false,
  name: 'file',
  autoUpload: true
})

const emit = defineEmits<{
  (e: 'update:fileList', files: FileItem[]): void
  (e: 'change', files: FileItem[]): void
  (e: 'remove', file: FileItem): void
}>()

const fileList = ref<FileItem[]>([])
const uploadProgress = ref<Record<string, number>>({})
const isDragging = ref(false)

const getFileIcon = (file: FileItem) => {
  const type = file.type.toLowerCase()
  if (type.startsWith('image/')) {
    return RiImageLine
  }
  if (type.startsWith('video/')) {
    return RiVideoLine
  }
  if (type.startsWith('audio/')) {
    return RiMusicLine
  }
  if (type === 'application/pdf') {
    return RiFilePdfLine
  }
  if (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return RiFileWordLine
  }
  if (
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return RiFileExcelLine
  }
  if (
    type === 'application/vnd.ms-powerpoint' ||
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return RiFilePptLine
  }
  if (type === 'application/zip' || type === 'application/x-rar-compressed') {
    return RiFileZipLine
  }
  if (type.startsWith('text/')) {
    return RiFileTextLine
  }
  return RiFileLine
}

const formatSize = (size: number) => {
  if (size < 1024) {
    return size + 'B'
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  }
  if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  }
  return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const files = Array.from(input.files)
  if (props.maxCount && fileList.value.length + files.length > props.maxCount) {
    emit(
      'onExceed',
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'error'
      }))
    )
    return
  }

  const validFiles = files.filter((file) => {
    if (props.maxSize && file.size > props.maxSize) {
      return false
    }
    if (props.accept) {
      const acceptTypes = props.accept.split(',').map((type) => type.trim())
      const fileType = file.type
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      return acceptTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type.slice(1)
        }
        return fileType.match(new RegExp(type.replace('*', '.*')))
      })
    }
    return true
  })

  if (props.autoUpload) {
    validFiles.forEach((file) => uploadFile(file))
  } else {
    const fileItems = validFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const
    }))
    fileList.value.push(...fileItems)
    emit('update:fileList', fileList.value)
    emit('change', fileList.value)
  }
}

const uploadFile = async (file: File) => {
  if (!props.action) return

  const fileItem: FileItem = {
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'uploading'
  }

  const formData = new FormData()
  formData.append(props.name, file)
  Object.entries(props.data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  try {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total)
        uploadProgress.value[file.name] = progress
        fileItem.progress = progress
        props.onProgress?.(event, fileItem)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        fileItem.status = 'success'
        props.onSuccess?.(xhr.response, fileItem)
        fileList.value.push(fileItem)
        emit('update:fileList', fileList.value)
        emit('change', fileList.value)
      } else {
        fileItem.status = 'error'
        fileItem.error = xhr.statusText
        props.onError?.(new Error(xhr.statusText), fileItem)
      }
    })

    xhr.addEventListener('error', () => {
      fileItem.status = 'error'
      fileItem.error = 'Upload failed'
      props.onError?.(new Error('Upload failed'), fileItem)
    })

    xhr.open('POST', props.action)
    Object.entries(props.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.withCredentials = props.withCredentials
    xhr.send(formData)
  } catch (error) {
    fileItem.status = 'error'
    fileItem.error = (error as Error).message
    props.onError?.(error as Error, fileItem)
  }
}

const handleRemove = async (file: FileItem) => {
  if (props.beforeRemove) {
    const canRemove = await Promise.resolve(props.beforeRemove(file))
    if (!canRemove) return
  }

  const index = fileList.value.indexOf(file)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emit('update:fileList', fileList.value)
    emit('remove', file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  const files = Array.from(event.dataTransfer?.files || [])
  if (props.maxCount && fileList.value.length + files.length > props.maxCount) {
    emit(
      'onExceed',
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'error'
      }))
    )
    return
  }

  const validFiles = files.filter((file) => {
    if (props.maxSize && file.size > props.maxSize) {
      return false
    }
    if (props.accept) {
      const acceptTypes = props.accept.split(',').map((type) => type.trim())
      const fileType = file.type
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      return acceptTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type.slice(1)
        }
        return fileType.match(new RegExp(type.replace('*', '.*')))
      })
    }
    return true
  })

  if (props.autoUpload) {
    validFiles.forEach((file) => uploadFile(file))
  } else {
    const fileItems = validFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const
    }))
    fileList.value.push(...fileItems)
    emit('update:fileList', fileList.value)
    emit('change', fileList.value)
  }
}

defineOptions({
  name: 'UploadComponent'
})
</script>

<template>
  <div
    class="upload"
    :class="{
      'upload--disabled': disabled,
      'upload--drag': drag,
      'upload--dragging': isDragging
    }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div v-if="drag" class="upload-drag-area" :class="{ 'upload-drag-area--dragging': isDragging }">
      <RiUploadCloud2Line class="upload-icon" />
      <div class="upload-text">
        <span>将文件拖到此处，或</span>
        <label class="upload-button">
          <input
            type="file"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            class="upload-input"
            @change="handleFileChange"
          />
          <span>点击上传</span>
        </label>
      </div>
    </div>
    <div v-else class="upload-trigger">
      <label class="upload-button">
        <input
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          class="upload-input"
          @change="handleFileChange"
        />
        <span>点击上传</span>
      </label>
    </div>

    <div v-if="showFileList && fileList.length > 0" class="upload-list">
      <div v-for="file in fileList" :key="file.name" class="upload-list-item">
        <div class="upload-list-item-info">
          <span class="upload-list-item-name">{{ file.name }}</span>
          <span class="upload-list-item-size"> {{ (file.size / 1024).toFixed(2) }} KB </span>
        </div>
        <div class="upload-list-item-actions">
          <div v-if="file.status === 'uploading'" class="upload-list-item-progress">
            <div class="upload-list-item-progress-bar" :style="{ width: file.progress + '%' }" />
          </div>
          <span v-if="file.status === 'error'" class="upload-list-item-error">{{
            file.error
          }}</span>
          <button class="upload-list-item-remove" @click="handleRemove(file)">
            <RiCloseLine />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export const __code = `// ... existing code ...`
</script>

<style scoped>
.upload {
  position: relative;
  display: inline-block;
}

.upload--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.upload--drag {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload--dragging {
  border-color: #1890ff;
}

.upload-drag-area {
  padding: 20px;
  text-align: center;
}

.upload-drag-area--dragging {
  background-color: rgba(24, 144, 255, 0.1);
}

.upload-icon {
  font-size: 48px;
  color: #d9d9d9;
  margin-bottom: 8px;
}

.upload-text {
  color: #666;
}

.upload-button {
  display: inline-block;
  margin: 0 4px;
  color: #1890ff;
  cursor: pointer;
}

.upload-input {
  display: none;
}

.upload-list {
  margin-top: 8px;
}

.upload-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.upload-list-item-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-list-item-name {
  color: #333;
}

.upload-list-item-size {
  color: #999;
  font-size: 12px;
}

.upload-list-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-list-item-progress {
  width: 100px;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
}

.upload-list-item-progress-bar {
  height: 100%;
  background-color: #1890ff;
  transition: width 0.3s;
}

.upload-list-item-error {
  color: #ff4d4f;
  font-size: 12px;
}

.upload-list-item-remove {
  padding: 4px;
  color: #999;
  cursor: pointer;
  border: none;
  background: none;
  transition: color 0.3s;
}

.upload-list-item-remove:hover {
  color: #ff4d4f;
}
</style>
