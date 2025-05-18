<template>
  <div
    v-if="show"
    class="fixed z-50 min-w-[200px] rounded-lg border bg-background p-1 shadow-lg"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
  >
    <div class="space-y-1">
      <button
        v-if="canOpen"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleOpen"
      >
        <RiFolderOpenLine class="h-4 w-4" />
        <span>打开</span>
      </button>

      <button
        v-if="canOpenWith"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleOpenWith"
      >
        <RiExternalLinkLine class="h-4 w-4" />
        <span>打开方式</span>
      </button>

      <button
        v-if="canCopy"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleCopy"
      >
        <RiFileCopyLine class="h-4 w-4" />
        <span>复制</span>
      </button>

      <button
        v-if="canMove"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleMove"
      >
        <RiScissorsLine class="h-4 w-4" />
        <span>剪切</span>
      </button>

      <button
        v-if="canRename"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleRename"
      >
        <RiEditLine class="h-4 w-4" />
        <span>重命名</span>
      </button>

      <button
        v-if="canDelete"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleDelete"
      >
        <RiDeleteBinLine class="h-4 w-4" />
        <span>删除</span>
      </button>

      <div class="h-px bg-border" />

      <button
        v-if="canCreateLink"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleCreateLink"
      >
        <RiLink class="h-4 w-4" />
        <span>创建链接</span>
      </button>

      <button
        v-if="canCompress"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleCompress"
      >
        <RiFileZipLine class="h-4 w-4" />
        <span>压缩</span>
      </button>

      <button
        v-if="canExtract"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleExtract"
      >
        <RiFileZipLine class="h-4 w-4" />
        <span>解压</span>
      </button>

      <div class="h-px bg-border" />

      <button
        v-if="canViewProperties"
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
        @click="handleViewProperties"
      >
        <RiInformationLine class="h-4 w-4" />
        <span>属性</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  RiFolderOpenLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiScissorsLine,
  RiEditLine,
  RiDeleteBinLine,
  RiLink,
  RiFileZipLine,
  RiInformationLine
} from '@remixicon/vue'

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  isSymbolicLink: boolean
}

const props = withDefaults(defineProps<{
  show: boolean
  position: { x: number; y: number }
  file: FileItem
  canOpen?: boolean
  canOpenWith?: boolean
  canCopy?: boolean
  canMove?: boolean
  canRename?: boolean
  canDelete?: boolean
  canCreateLink?: boolean
  canCompress?: boolean
  canExtract?: boolean
  canViewProperties?: boolean
}>(), {
  canOpen: false,
  canOpenWith: false,
  canCopy: false,
  canMove: false,
  canRename: false,
  canDelete: false,
  canCreateLink: false,
  canCompress: false,
  canExtract: false,
  canViewProperties: false
})

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'openWith'): void
  (e: 'copy'): void
  (e: 'move'): void
  (e: 'rename'): void
  (e: 'delete'): void
  (e: 'create-link'): void
  (e: 'compress'): void
  (e: 'extract'): void
  (e: 'view-properties'): void
}>()

const handleOpen = () => {
  emit('open')
}

const handleOpenWith = () => {
  emit('openWith')
}

const handleCopy = () => {
  emit('copy')
}

const handleMove = () => {
  emit('move')
}

const handleRename = () => {
  emit('rename')
}

const handleDelete = () => {
  emit('delete')
}

const handleCreateLink = () => {
  emit('create-link')
}

const handleCompress = () => {
  emit('compress')
}

const handleExtract = () => {
  emit('extract')
}

const handleViewProperties = () => {
  emit('view-properties')
}
</script>
