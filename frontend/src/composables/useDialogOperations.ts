import { ref } from 'vue'
import type { FileInfo } from '../types'
import type { UseFileStore } from '../stores/file'
import { useFileOperations } from './useFileOperations'
import { useFileNavigation } from './useFileNavigation'

export function useDialogOperations(fileStore: UseFileStore) {
  const { createFolder, createLink } = useFileOperations(fileStore)
  const { navigateTo, navigateUp } = useFileNavigation(fileStore)

  // 对话框状态
  const showCreateFolderDialog = ref(false)
  const showRenameDialog = ref(false)
  const showCreateLinkDialog = ref(false)
  const showPropertiesDialog = ref(false)
  const showInfoDialog = ref(false)
  const showDeleteConfirmDialog = ref(false)
  const showHardLinkInfo = ref(false)
  const showDirectoryPicker = ref(false)
  const showLinkProgress = ref(false)

  // 对话框数据
  const newFolderName = ref('')
  const newName = ref('')
  const linkType = ref<'symlink' | 'hardlink'>('symlink')
  const linkName = ref('')
  const linkTargetDir = ref('')
  const selectedFile = ref<FileInfo | null>(null)
  const hardLinks = ref<FileInfo[]>([])
  const recursiveLink = ref(false)
  const deleteConfirmMessage = ref('')

  // 信息对话框内容
  const infoDialog = ref({
    title: '',
    message: ''
  })

  // 链接进度对话框
  const linkProgress = ref(0)
  const processedFiles = ref(0)
  const totalFiles = ref(0)
  const currentProcessingFile = ref('')
  const linkProcessCompleted = ref(false)

  // 目录选择器状态
  const pickerCurrentPath = ref('')
  const pickerFiles = ref<FileInfo[]>([])
  const pickerBreadcrumbs = ref<string[]>([])
  const pickerLoading = ref(false)

  // 右键菜单
  const contextMenu = ref({
    show: false,
    top: 0,
    left: 0,
    item: null as FileInfo | null
  })

  // 创建文件夹对话框操作
  const openCreateFolderDialog = () => {
    showCreateFolderDialog.value = true
  }

  const closeCreateFolderDialog = () => {
    showCreateFolderDialog.value = false
    newFolderName.value = ''
  }

  const handleCreateFolder = async (folderName: string) => {
    const success = await createFolder(folderName)
    if (success) {
      closeCreateFolderDialog()
    }
    return success
  }

  // 重命名对话框操作
  const openRenameDialog = (file: FileInfo) => {
    selectedFile.value = file
    newName.value = file.name
    showRenameDialog.value = true
  }

  const closeRenameDialog = () => {
    showRenameDialog.value = false
    newName.value = ''
    selectedFile.value = null
  }

  // 创建链接对话框操作
  const openCreateLinkDialog = (file: FileInfo) => {
    selectedFile.value = file
    linkName.value = file.name
    linkTargetDir.value = ''
    showCreateLinkDialog.value = true
  }

  const closeCreateLinkDialog = () => {
    showCreateLinkDialog.value = false
    linkName.value = ''
    linkTargetDir.value = ''
    selectedFile.value = null
  }

  const handleCreateLink = async (params: { sourcePath: string; targetPath: string; type: 'symlink' | 'hardlink'; name: string }) => {
    try {
      await createLink(params)
      closeCreateLinkDialog()
      return { success: true }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '创建链接失败' }
    }
  }

  // 属性对话框操作
  const openPropertiesDialog = (file: FileInfo) => {
    selectedFile.value = file
    showPropertiesDialog.value = true
  }

  const closePropertiesDialog = () => {
    showPropertiesDialog.value = false
    selectedFile.value = null
  }

  // 信息对话框操作
  const showInfo = (title: string, message: string) => {
    infoDialog.value = { title, message }
    showInfoDialog.value = true
  }

  const closeInfoDialog = () => {
    showInfoDialog.value = false
    infoDialog.value = { title: '', message: '' }
  }

  // 删除确认对话框操作
  const showDeleteConfirm = (message: string) => {
    deleteConfirmMessage.value = message
    showDeleteConfirmDialog.value = true
  }

  const closeDeleteConfirmDialog = () => {
    showDeleteConfirmDialog.value = false
    deleteConfirmMessage.value = ''
  }

  // 硬链接信息对话框操作
  const openHardLinkInfo = (file: FileInfo, links: FileInfo[]) => {
    selectedFile.value = file
    hardLinks.value = links
    showHardLinkInfo.value = true
  }

  const closeHardLinkInfo = () => {
    showHardLinkInfo.value = false
    hardLinks.value = []
    selectedFile.value = null
  }

  // 目录选择器对话框操作
  const openDirectoryPicker = async () => {
    pickerCurrentPath.value = fileStore.currentPath
    pickerBreadcrumbs.value = fileStore.breadcrumbs
    pickerFiles.value = fileStore.sortedFiles
    showDirectoryPicker.value = true
  }

  const closeDirectoryPicker = () => {
    showDirectoryPicker.value = false
    pickerCurrentPath.value = ''
    pickerFiles.value = []
    pickerBreadcrumbs.value = []
  }

  const handlePickerNavigate = async (path: string) => {
    pickerLoading.value = true
    try {
      await navigateTo(path)
      pickerCurrentPath.value = path
      pickerBreadcrumbs.value = fileStore.breadcrumbs
      pickerFiles.value = fileStore.sortedFiles
    } finally {
      pickerLoading.value = false
    }
  }

  const handlePickerNavigateUp = async () => {
    pickerLoading.value = true
    try {
      await navigateUp()
      pickerCurrentPath.value = fileStore.currentPath
      pickerBreadcrumbs.value = fileStore.breadcrumbs
      pickerFiles.value = fileStore.sortedFiles
    } finally {
      pickerLoading.value = false
    }
  }

  const handleSelectLinkTargetDir = (path: string) => {
    linkTargetDir.value = path
    closeDirectoryPicker()
  }

  // 链接进度对话框操作
  const openLinkProgress = () => {
    linkProgress.value = 0
    processedFiles.value = 0
    totalFiles.value = 0
    currentProcessingFile.value = ''
    linkProcessCompleted.value = false
    showLinkProgress.value = true
  }

  const closeLinkProgress = () => {
    showLinkProgress.value = false
    linkProgress.value = 0
    processedFiles.value = 0
    totalFiles.value = 0
    currentProcessingFile.value = ''
    linkProcessCompleted.value = false
  }

  const updateLinkProgress = (progress: number, processed: number, total: number, currentFile: string) => {
    linkProgress.value = progress
    processedFiles.value = processed
    totalFiles.value = total
    currentProcessingFile.value = currentFile
  }

  const completeLinkProcess = () => {
    linkProcessCompleted.value = true
  }

  // 右键菜单操作
  const showContextMenu = (event: MouseEvent, item: FileInfo) => {
    event.preventDefault()
    contextMenu.value = {
      show: true,
      top: event.clientY,
      left: event.clientX,
      item
    }
  }

  const hideContextMenu = () => {
    contextMenu.value.show = false
  }

  return {
    // 对话框状态
    showCreateFolderDialog,
    showRenameDialog,
    showCreateLinkDialog,
    showPropertiesDialog,
    showInfoDialog,
    showDeleteConfirmDialog,
    showHardLinkInfo,
    showDirectoryPicker,
    showLinkProgress,

    // 对话框数据
    newFolderName,
    newName,
    linkType,
    linkName,
    linkTargetDir,
    selectedFile,
    hardLinks,
    recursiveLink,
    deleteConfirmMessage,
    infoDialog,
    linkProgress,
    processedFiles,
    totalFiles,
    currentProcessingFile,
    linkProcessCompleted,
    pickerCurrentPath,
    pickerFiles,
    pickerBreadcrumbs,
    pickerLoading,
    contextMenu,

    // 对话框操作
    openCreateFolderDialog,
    closeCreateFolderDialog,
    handleCreateFolder,
    openRenameDialog,
    closeRenameDialog,
    openCreateLinkDialog,
    closeCreateLinkDialog,
    handleCreateLink,
    openPropertiesDialog,
    closePropertiesDialog,
    showInfo,
    closeInfoDialog,
    showDeleteConfirm,
    closeDeleteConfirmDialog,
    openHardLinkInfo,
    closeHardLinkInfo,
    openDirectoryPicker,
    closeDirectoryPicker,
    handlePickerNavigate,
    handlePickerNavigateUp,
    handleSelectLinkTargetDir,
    openLinkProgress,
    closeLinkProgress,
    updateLinkProgress,
    completeLinkProcess,
    showContextMenu,
    hideContextMenu
  }
}
