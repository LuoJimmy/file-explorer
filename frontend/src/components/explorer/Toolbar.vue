<template>
  <div class="flex items-center gap-2 border-b bg-background p-2">
    <div class="flex items-center gap-1">
      <button
        class="rounded-sm p-2 hover:bg-muted"
        :disabled="!props.canGoBack"
        @click="handleBack"
      >
        <RiArrowLeftSLine class="h-4 w-4" :class="{ 'opacity-50': !props.canGoBack }" />
      </button>
      <button
        class="rounded-sm p-2 hover:bg-muted"
        :disabled="!props.canGoForward"
        @click="handleForward"
      >
        <RiArrowRightSLine class="h-4 w-4" :class="{ 'opacity-50': !props.canGoForward }" />
      </button>
      <button
        class="rounded-sm p-2 hover:bg-muted"
        :disabled="!props.canGoUp"
        @click="handleUp"
      >
        <RiArrowUpLine class="h-4 w-4" :class="{ 'opacity-50': !props.canGoUp }" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleRefresh">
        <RiRefreshLine class="h-4 w-4" />
      </button>
    </div>

    <div class="flex-1">
      <div class="text-sm text-muted-foreground">{{ props.localPath }}</div>
    </div>

    <div class="flex items-center gap-1">
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleNewFolder">
        <RiFolderAddLine class="h-4 w-4" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleUpload">
        <RiFileAddLine class="h-4 w-4" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleDelete">
        <RiDeleteBinLine class="h-4 w-4" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleRename">
        <RiEditLine class="h-4 w-4" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleProperties">
        <RiInformationLine class="h-4 w-4" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleSettings">
        <RiSettings4Line class="h-4 w-4" />
      </button>
      <button class="rounded-sm p-2 hover:bg-muted" @click="handleViewMode">
        <RiGridLine class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiRefreshLine,
  RiFolderAddLine,
  RiFileAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiInformationLine,
  RiSettings4Line,
  RiGridLine
} from '@remixicon/vue'

const props = defineProps<{
  canGoBack: boolean
  canGoForward: boolean
  canGoUp: boolean
  localPath: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'forward'): void
  (e: 'up'): void
  (e: 'refresh'): void
  (e: 'new-folder'): void
  (e: 'upload'): void
  (e: 'delete'): void
  (e: 'rename'): void
  (e: 'properties'): void
  (e: 'settings'): void
  (e: 'view-mode'): void
}>()

const handleBack = () => {
  emit('back')
}

const handleForward = () => {
  emit('forward')
}

const handleUp = () => {
  emit('up')
}

const handleRefresh = () => {
  emit('refresh')
}

const handleNewFolder = () => {
  emit('new-folder')
}

const handleUpload = () => {
  emit('upload')
}

const handleDelete = () => {
  emit('delete')
}

const handleRename = () => {
  emit('rename')
}

const handleProperties = () => {
  emit('properties')
}

const handleSettings = () => {
  emit('settings')
}

const handleViewMode = () => {
  emit('view-mode')
}
</script>

<style scoped>
.toolbar {
  @apply flex items-center gap-2 border-b bg-background px-4 py-2;
}

.toolbar-group {
  @apply flex items-center gap-1;
}

.toolbar-button {
  @apply flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-hover transition-colors;
}

.toolbar-button.active {
  @apply bg-hover;
}

.toolbar-button i {
  @apply h-[var(--icon-size-toolbar)] w-[var(--icon-size-toolbar)] text-muted;
}

.toolbar-separator {
  @apply h-6 w-px bg-border mx-2;
}

.toolbar-input {
  @apply flex-1 max-w-md;
}

.toolbar-input input {
  @apply w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}
</style>
