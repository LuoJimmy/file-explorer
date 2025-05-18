<template>
  <div class="file-grid">
    <div
      v-for="file in files"
      :key="file.path"
      class="file-grid-item group relative flex cursor-pointer flex-col items-center rounded-lg border p-2 hover:bg-muted"
      @click="handleSelect(file)"
      @contextmenu.prevent="handleContextMenu($event, file)"
    >
      <div class="relative mb-2">
        <component
          :is="file.isDirectory ? RiFolderLine : file.isSymbolicLink ? RiLink : RiFileLine"
          class="h-12 w-12 text-primary"
        />
        <RiExternalLinkLine
          v-if="file.isSymbolicLink"
          class="absolute -right-1 -top-1 h-4 w-4 text-muted-foreground"
        />
      </div>
      <div class="w-full truncate text-center text-sm">
        {{ file.name }}
      </div>
      <div class="mt-1 text-xs text-muted">
        {{ formatSize(file.size) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  RiFolderLine,
  RiFileLine,
  RiLink,
  RiExternalLinkLine
} from '@remixicon/vue'

interface FileItem {
  name: string
  path: string
  size: number
  modifiedTime: string
  isDirectory: boolean
  isSymbolicLink: boolean
}

const props = defineProps<{
  files: FileItem[]
  selectedFiles: FileItem[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'select', path: string, multiSelect: boolean): void
  (e: 'open', path: string): void
  (e: 'action', action: string, file: FileItem): void
  (e: 'context-menu', event: MouseEvent, file: FileItem): void
}>()

const sortBy = ref<'name' | 'size' | 'type' | 'modified'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedFiles = computed(() => {
  return [...props.files].sort((a, b) => {
    let comparison = 0

    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy.value === 'size') {
      comparison = a.size - b.size
    } else if (sortBy.value === 'type') {
      const aType = a.isDirectory ? 'folder' : a.isSymbolicLink ? 'link' : getFileType(a)
      const bType = b.isDirectory ? 'folder' : b.isSymbolicLink ? 'link' : getFileType(b)
      comparison = aType.localeCompare(bType)
    } else if (sortBy.value === 'modified') {
      comparison = new Date(a.modifiedTime || 0).getTime() - new Date(b.modifiedTime || 0).getTime()
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const handleSelect = (file: FileItem, event: MouseEvent) => {
  emit('select', file.path, event.ctrlKey || event.metaKey)
}

const handleDoubleClick = (file: FileItem) => {
  emit('open', file.path)
}

const handleContextMenu = (event: MouseEvent, file: FileItem) => {
  emit('context-menu', event, file)
}

const formatSize = (size: number): string => {
  if (size === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString()
}

const getFileType = (file: FileItem): string => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext) return '文件'
  const types: Record<string, string> = {
    txt: '文本文档',
    pdf: 'PDF文档',
    doc: 'Word文档',
    docx: 'Word文档',
    xls: 'Excel表格',
    xlsx: 'Excel表格',
    ppt: 'PowerPoint演示文稿',
    pptx: 'PowerPoint演示文稿',
    jpg: '图片',
    jpeg: '图片',
    png: '图片',
    gif: '图片',
    mp3: '音频',
    mp4: '视频',
    zip: '压缩文件',
    rar: '压缩文件',
    exe: '可执行文件'
  }
  return types[ext] || '文件'
}
</script>

<style scoped>
.file-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4;
}

.file-grid-item {
  @apply flex flex-col items-center p-3 rounded-lg hover:bg-hover transition-colors cursor-pointer;
}

.file-grid-item.selected {
  @apply bg-selected;
}

.file-grid-item-icon {
  @apply w-[var(--icon-size-grid)] h-[var(--icon-size-grid)] flex items-center justify-center mb-2;
}

.file-grid-item-icon i {
  @apply text-4xl text-primary;
}

.file-grid-item-name {
  @apply text-sm text-center truncate w-full;
}

.file-grid-item-info {
  @apply text-xs text-muted mt-1 text-center;
}

.file-grid-item-size {
  @apply text-xs text-muted mt-1;
}

.file-grid-item-date {
  @apply text-xs text-muted mt-1;
}
</style>
