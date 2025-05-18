<template>
  <div class="flex-1 overflow-auto">
    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'" class="h-full">
      <div class="sticky top-0 z-10 border-b bg-background">
        <div class="flex h-10 items-center gap-4 px-4">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
                @click="handleSort('name')"
              >
                <span>名称</span>
                <component
                  :is="sortBy === 'name' ? (sortOrder === 'asc' ? RiArrowUpLine : RiArrowDownLine) : RiArrowUpLine"
                  class="h-4 w-4"
                  :class="{ 'opacity-50': sortBy !== 'name' }"
                />
              </button>
            </div>
          </div>
          <div class="w-24">
            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
                @click="handleSort('size')"
              >
                <span>大小</span>
                <component
                  :is="sortBy === 'size' ? (sortOrder === 'asc' ? RiArrowUpLine : RiArrowDownLine) : RiArrowUpLine"
                  class="h-4 w-4"
                  :class="{ 'opacity-50': sortBy !== 'size' }"
                />
              </button>
            </div>
          </div>
          <div class="w-32">
            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
                @click="handleSort('type')"
              >
                <span>类型</span>
                <component
                  :is="sortBy === 'type' ? (sortOrder === 'asc' ? RiArrowUpLine : RiArrowDownLine) : RiArrowUpLine"
                  class="h-4 w-4"
                  :class="{ 'opacity-50': sortBy !== 'type' }"
                />
              </button>
            </div>
          </div>
          <div class="w-40">
            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
                @click="handleSort('modified')"
              >
                <span>修改日期</span>
                <component
                  :is="sortBy === 'modified' ? (sortOrder === 'asc' ? RiArrowUpLine : RiArrowDownLine) : RiArrowUpLine"
                  class="h-4 w-4"
                  :class="{ 'opacity-50': sortBy !== 'modified' }"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="divide-y">
        <div
          v-for="file in sortedFiles"
          :key="file.path"
          class="flex items-center gap-4 px-4 py-2 hover:bg-muted/50 transition-colors"
          :class="{
            'bg-blue-100 dark:bg-blue-900': isSelected(file),
            'hover:bg-blue-200 dark:hover:bg-blue-800': isSelected(file)
          }"
          @click="handleSelect(file, $event)"
          @dblclick="handleDoubleClick(file)"
          @contextmenu.prevent="handleContextMenu($event, file)"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <component
                :is="file.isDirectory ? RiFolderLine : file.isSymbolicLink ? RiLink : RiFileLine"
                class="h-4 w-4 text-muted"
              />
              <span>{{ file.name }}</span>
            </div>
          </div>
          <div class="w-24 text-sm text-muted">
            {{ file.isDirectory ? '-' : formatSize(file.size) }}
          </div>
          <div class="w-32 text-sm text-muted">
            {{ file.isDirectory ? '文件夹' : file.isSymbolicLink ? '符号链接' : getFileType(file) }}
          </div>
          <div class="w-40 text-sm text-muted">
            {{ formatDate(file.modifiedTime) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 网格视图 -->
    <div v-else class="grid h-full grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <div
        v-for="file in sortedFiles"
        :key="file.path"
        class="flex cursor-pointer flex-col items-center gap-2 rounded-lg p-4 hover:bg-muted/50 transition-colors"
        :class="{
          'bg-blue-100 dark:bg-blue-900': isSelected(file),
          'hover:bg-blue-200 dark:hover:bg-blue-800': isSelected(file)
        }"
        @click="handleSelect(file, $event)"
        @dblclick="handleDoubleClick(file)"
        @contextmenu.prevent="handleContextMenu($event, file)"
      >
        <component
          :is="file.isDirectory ? RiFolderLine : file.isSymbolicLink ? RiLink : RiFileLine"
          class="h-12 w-12 text-muted"
        />
        <span class="max-w-full truncate text-center">{{ file.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  RiFolderLine,
  RiFileLine,
  RiLink,
  RiArrowUpLine,
  RiArrowDownLine
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
  viewMode: 'list' | 'grid'
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

const handleSort = (by: 'name' | 'size' | 'type' | 'modified') => {
  if (sortBy.value === by) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = by
    sortOrder.value = 'asc'
  }
}

const isSelected = (file: FileItem) => {
  const selected = props.selectedFiles.some(f => f.path === file.path)
  console.log('Checking if file is selected:', file.path, selected)
  return selected
}

const handleSelect = (file: FileItem, event: MouseEvent) => {
  console.log('Selecting file:', file.path, 'Multi-select:', event.ctrlKey || event.metaKey)
  emit('select', file.path, event.ctrlKey || event.metaKey)
}

const handleDoubleClick = (file: FileItem) => {
  if (file.isDirectory) {
  emit('open', file.path)
  } else {
    emit('action', 'open', file)
  }
}

const handleContextMenu = (event: MouseEvent, file: FileItem) => {
  event.preventDefault()
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

// 监听 selectedFiles 变化
watch(() => props.selectedFiles, (newFiles) => {
  console.log('Selected files changed:', newFiles)
}, { deep: true })
</script>

<style scoped>
.file-list {
  @apply flex-1 overflow-auto;
}

.file-list-header {
  @apply sticky top-0 z-10 border-b bg-background;
}

.file-list-header-content {
  @apply flex h-10 items-center gap-4 px-4;
}

.file-list-header-item {
  @apply flex items-center gap-2;
}

.file-list-header-button {
  @apply flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-hover transition-colors;
}

.file-list-header-icon {
  @apply h-4 w-4 text-muted;
}

.file-list-content {
  @apply divide-y divide-border;
}

.file-list-item {
  @apply flex items-center gap-4 px-4 py-2 hover:bg-hover transition-colors cursor-pointer;
}

.file-list-item.selected {
  @apply bg-selected;
}

.file-list-item-icon {
  @apply w-[var(--icon-size-list)] h-[var(--icon-size-list)] flex items-center justify-center;
}

.file-list-item-icon i {
  @apply text-2xl text-primary;
}

.file-list-item-content {
  @apply flex-1 min-w-0;
}

.file-list-item-name {
  @apply text-base font-medium truncate;
}

.file-list-item-info {
  @apply text-xs text-muted mt-1;
}

.file-list-item-size {
  @apply w-24 text-right text-xs text-muted;
}

.file-list-item-date {
  @apply w-32 text-right text-xs text-muted;
}
</style>
