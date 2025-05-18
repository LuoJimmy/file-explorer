<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFileStore } from '../stores/file'
import { useFileOperations } from '../composables/useFileOperations'
import { useFileNavigation } from '../composables/useFileNavigation'
import { useDialogOperations } from '../composables/useDialogOperations'
import type { FileInfo } from '../types'
import Toolbar from '../components/explorer/Toolbar.vue'
import Breadcrumbs from '../components/explorer/Breadcrumbs.vue'
import FileList from '../components/explorer/FileList.vue'
import FileGrid from '../components/explorer/FileGrid.vue'
import ContextMenu from '../components/explorer/ContextMenu.vue'
import Toast from '../components/explorer/Toast.vue'
import Button from '../components/ui/Button.vue'

// 初始化 store
const fileStore = useFileStore()

// 初始化文件操作
const { createFolder, uploadFiles, createLink, refreshDirectory } = useFileOperations(fileStore)

// 初始化文件导航
const {
  handleFileClick,
  handleFileDoubleClick,
  handleFileContextMenu,
  handleFileDragStart,
  handleFileDrop,
  handleFileDragOver,
  handleFileDragLeave
} = useFileNavigation(fileStore)

// 初始化对话框操作
const { showToast, showInfoDialog, showConfirmDialog, showProgressDialog } = useDialogOperations()

// 视图模式
const viewMode = ref<'list' | 'grid'>('list')

// 上下文菜单
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  file: null as FileInfo | null
})

// 处理文件选择
const handleFileSelect = (file: FileInfo) => {
  fileStore.toggleFileSelection(file)
}

// 处理文件拖拽
const handleDragStart = (e: DragEvent, file: FileInfo) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', file.path)
    e.dataTransfer.effectAllowed = 'move'
  }
}

// 处理文件拖放
const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  const targetPath = e.dataTransfer?.getData('text/plain')
  if (targetPath) {
    // 处理文件移动
    await fileStore.moveFile(targetPath, fileStore.currentPath)
    await refreshDirectory()
  }
}

// 处理拖拽悬停
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

// 处理拖拽离开
const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
}

// 处理上下文菜单
const handleContextMenu = (e: MouseEvent, file: FileInfo) => {
  e.preventDefault()
  contextMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
    file
  }
}

// 关闭上下文菜单
const closeContextMenu = () => {
  contextMenu.value.show = false
}

// 处理文件操作
const handleFileOperation = async (operation: string) => {
  switch (operation) {
    case 'new-folder':
      const folderName = await showInfoDialog('新建文件夹', '请输入文件夹名称：')
      if (folderName) {
        await createFolder(folderName)
      }
      break
    case 'upload':
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files
        if (files) {
          await uploadFiles(files)
        }
      }
      input.click()
      break
    case 'delete':
      if (fileStore.hasSelection) {
        const confirmed = await showConfirmDialog('删除', '确定要删除选中的文件吗？')
        if (confirmed) {
          await fileStore.deleteSelectedFiles()
          await refreshDirectory()
        }
      }
      break
    case 'copy':
      if (fileStore.hasSelection) {
        fileStore.copyToClipboard()
        showToast('已复制到剪贴板')
      }
      break
    case 'cut':
      if (fileStore.hasSelection) {
        fileStore.cutToClipboard()
        showToast('已剪切到剪贴板')
      }
      break
    case 'paste':
      if (fileStore.hasClipboard) {
        await fileStore.pasteFromClipboard()
        await refreshDirectory()
      }
      break
    case 'rename':
      if (fileStore.hasSelection) {
        const newName = await showInfoDialog('重命名', '请输入新名称：')
        if (newName) {
          await fileStore.renameFile(fileStore.selectedFiles[0], newName)
          await refreshDirectory()
        }
      }
      break
    case 'create-link':
      if (fileStore.hasSelection) {
        const linkType = await showInfoDialog('创建链接', '请选择链接类型（symlink/hardlink）：')
        if (linkType === 'symlink' || linkType === 'hardlink') {
          const linkName = await showInfoDialog('创建链接', '请输入链接名称：')
          if (linkName) {
            try {
              await createLink({
                sourcePath: fileStore.selectedFiles[0].path,
                targetPath: fileStore.currentPath,
                type: linkType,
                name: linkName
              })
              showToast('创建链接成功', 'success')
            } catch (error) {
              showToast('创建链接失败', 'error')
            }
          }
        }
      }
      break
  }
  closeContextMenu()
}

// 组件挂载时初始化
onMounted(async () => {
  console.log('Home component mounted')
  try {
    await fileStore.fetchFiles()
    console.log('Files fetched successfully')
  } catch (error) {
    console.error('Error fetching files:', error)
  }
})
</script>

<template>
  <div class="file-explorer">
    <Toolbar
      :view-mode="viewMode"
      @view-change="viewMode = $event"
      @operation="handleFileOperation"
    />

    <Breadcrumbs
      :path="fileStore.currentPath"
      @navigate="fileStore.navigateTo"
    />

    <div
      class="file-container"
      @dragover="handleDragOver"
      @drop="handleDrop"
      @dragleave="handleDragLeave"
    >
      <FileList
        v-if="viewMode === 'list'"
        :files="fileStore.sortedFiles"
        :selected-files="fileStore.selectedFiles"
        @select="handleFileSelect"
        @click="handleFileClick"
        @dblclick="handleFileDoubleClick"
        @contextmenu="handleContextMenu"
        @dragstart="handleDragStart"
      />

      <FileGrid
        v-else
        :files="fileStore.sortedFiles"
        :selected-files="fileStore.selectedFiles"
        @select="handleFileSelect"
        @click="handleFileClick"
        @dblclick="handleFileDoubleClick"
        @contextmenu="handleContextMenu"
        @dragstart="handleDragStart"
      />
    </div>

    <ContextMenu
      v-if="contextMenu.show"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :file="contextMenu.file"
      @close="closeContextMenu"
      @operation="handleFileOperation"
    />

    <Toast />
  </div>
</template>

<style scoped>
.file-explorer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background);
  color: var(--text);
}

.file-container {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background-color: var(--background);
}

:deep(.file-item) {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.file-item:hover) {
  background-color: var(--hover);
}

:deep(.file-item.selected) {
  background-color: var(--selected);
}

:deep(.file-icon) {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}

:deep(.file-name) {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.file-info) {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

:deep(.file-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

:deep(.file-grid-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.file-grid-item:hover) {
  background-color: var(--hover);
}

:deep(.file-grid-item.selected) {
  background-color: var(--selected);
}

:deep(.file-grid-icon) {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
}

:deep(.file-grid-name) {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
