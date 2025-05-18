<template>
  <div class="flex h-full flex-col space-y-4">
    <!-- 面包屑导航 -->
    <Breadcrumbs
      :breadcrumbs="fileStore.breadcrumbs"
      :path="fileStore.currentPath"
      @navigate="navigateTo"
      class="rounded-lg border bg-card p-2 shadow-sm"
    />

    <!-- 工具栏 -->
    <Toolbar
      :can-go-back="fileStore.canGoBack"
      :can-go-forward="fileStore.canGoForward"
      :can-go-up="fileStore.canGoUp"
      :local-path="fileStore.currentPath"
      @back="navigateBack"
      @forward="navigateForward"
      @up="navigateUp"
      @refresh="refreshDirectory"
      @new-folder="showCreateFolderDialog = true"
      @upload="fileInput.click()"
      @delete="handleDelete"
      @rename="renameSelected"
      @properties="showFileProperties"
      @settings="showSettings"
      @view-mode="toggleViewMode"
      class="rounded-lg border bg-card p-2 shadow-sm"
    />

    <!-- 文件列表 -->
    <FileList
      :files="fileStore.sortedFiles"
      :loading="fileStore.loading"
      :error="fileStore.error"
      :view-mode="fileStore.viewMode"
      :sort-by="fileStore.sortBy"
      :sort-order="fileStore.sortOrder"
      :selected-files="fileStore.selectedFiles"
      :path="fileStore.currentPath"
      @select="handleFileClick"
      @action="handleFileAction"
      @context-menu="handleFileContextMenu"
      @open="navigateTo"
      @sort="fileStore.setSortOptions"
      class="flex-1 rounded-lg border bg-card p-2 shadow-sm"
    />

    <!-- 隐藏的文件上传输入框 -->
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      @change="uploadFiles"
    />

    <!-- 右键菜单 -->
    <ContextMenu
      :show="contextMenu.show"
      :top="contextMenu.top"
      :left="contextMenu.left"
      :item="contextMenu.item"
      :position="{ x: contextMenu.left, y: contextMenu.top }"
      :file="contextMenu.item || {}"
      :has-clipboard="fileStore.hasClipboard"
      :show-hidden-files="fileStore.showHiddenFiles"
      :can-open="contextMenu.item && !contextMenu.item.isDirectory"
      :can-open-with="contextMenu.item && !contextMenu.item.isDirectory"
      :can-copy="!!contextMenu.item"
      :can-move="!!contextMenu.item"
      :can-rename="!!contextMenu.item"
      :can-delete="!!contextMenu.item"
      :can-create-link="!!contextMenu.item"
      :can-compress="contextMenu.item && !contextMenu.item.isDirectory"
      :can-extract="contextMenu.item && contextMenu.item.isDirectory"
      :can-view-properties="!!contextMenu.item"
      @action="(item) => handleFileAction('open', item)"
      @rename="renameSelected"
      @delete="handleDelete"
      @copy="fileStore.copyToClipboard([contextMenu.item])"
      @cut="fileStore.cutToClipboard([contextMenu.item])"
      @properties="showFileProperties"
      @create-link="openCreateLinkDialog"
      @find-hardlinks="findHardLinks"
      @get-symlink-target="getSymLinkTarget"
      @refresh="refreshDirectory"
      @create-folder="showCreateFolderDialog = true"
      @upload="fileInput.click()"
      @paste="fileStore.pasteFromClipboard()"
      @sort="fileStore.setSortOptions"
      @toggle-hidden="fileStore.toggleHiddenFiles()"
    />

    <!-- 对话框组件 -->
    <CreateFolderDialog
      :show="showCreateFolderDialog"
      @close="showCreateFolderDialog = false"
      @create="async (folderName) => {
        if (await createFolder(folderName)) {
          showCreateFolderDialog = false;
        }
      }"
    />

    <RenameDialog
      :show="showRenameDialog"
      :current-name="newName"
      :file="selectedFile || {}"
      @close="showRenameDialog = false"
      @rename="confirmRename"
    />

    <CreateLinkDialog
      :show="showCreateLinkDialog"
      :source-name="selectedFile ? selectedFile.name : ''"
      :source-path="selectedFile ? selectedFile.path : ''"
      :is-directory="selectedFile ? selectedFile.isDirectory : false"
      :file="selectedFile || {}"
      v-model:link-target-dir="linkTargetDir"
      @close="showCreateLinkDialog = false"
      @create="async (params) => {
        const result = await createLink(params);
        if (result.success) {
          showCreateLinkDialog = false;
          showToastMessage(result.message, 'success');
        } else {
          showToastMessage(result.message, 'error');
        }
      }"
      @open-directory-picker="openDirectoryPicker"
    />

    <PropertiesDialog
      :show="showPropertiesDialog"
      :file="selectedFile || {}"
      :current-path="fileStore.currentPath"
      :size="selectedFile ? formatFileSize(selectedFile.size) : '0 B'"
      @close="showPropertiesDialog = false"
    />

    <InfoDialog
      :show="showInfoDialog"
      :title="infoDialog.title"
      :message="infoDialog.message"
      :file="selectedFile || { name: '', path: '', isDirectory: false, isSymbolicLink: false }"
      :size="selectedFile ? formatFileSize(selectedFile.size) : '0 B'"
      :type="selectedFile ? (selectedFile.isDirectory ? 'directory' : 'file') : ''"
      :permissions="selectedFile ? selectedFile.permissions : ''"
      :owner="selectedFile ? selectedFile.owner : ''"
      :group="selectedFile ? selectedFile.group : ''"
      :created-at="selectedFile ? selectedFile.createdTime : ''"
      :modified-at="selectedFile ? selectedFile.modifiedTime : ''"
      :accessed-at="selectedFile ? selectedFile.accessedTime : ''"
      @close="showInfoDialog = false"
    />

    <InfoDialog
      :show="showDeleteConfirmDialog"
      title="确认删除"
      :message="deleteConfirmMessage"
      :show-confirm="true"
      confirm-text="删除"
      :file="selectedFile || { name: '', path: '', isDirectory: false, isSymbolicLink: false }"
      :size="selectedFile ? formatFileSize(selectedFile.size) : '0 B'"
      :type="selectedFile ? (selectedFile.isDirectory ? 'directory' : 'file') : ''"
      :permissions="selectedFile ? selectedFile.permissions : ''"
      :owner="selectedFile ? selectedFile.owner : ''"
      :group="selectedFile ? selectedFile.group : ''"
      :created-at="selectedFile ? selectedFile.createdTime : ''"
      :modified-at="selectedFile ? selectedFile.modifiedTime : ''"
      :accessed-at="selectedFile ? selectedFile.accessedTime : ''"
      @close="showDeleteConfirmDialog = false"
      @confirm="confirmDelete"
    />

    <HardLinkInfoDialog
      :show="showHardLinkInfo"
      :source-path="selectedFile ? selectedFile.path : ''"
      :hard-links="hardLinks.length"
      :inode="selectedFile ? selectedFile.inode : 0"
      :device="selectedFile ? selectedFile.device : ''"
      :file="selectedFile || { name: '', path: '', isDirectory: false, isSymbolicLink: false }"
      @close="showHardLinkInfo = false"
      @navigate="handleHardLinkNavigate"
      @delete="deleteHardLink"
      @delete-all="deleteAllHardLinks"
    />

    <DirectoryPickerDialog
      :show="showDirectoryPicker"
      :current-path="pickerCurrentPath"
      :files="pickerFiles"
      :breadcrumbs="pickerBreadcrumbs"
      :loading="pickerLoading"
      @close="showDirectoryPicker = false"
      @navigate="pickerNavigateTo"
      @navigate-up="pickerNavigateUp"
      @select="selectLinkTargetDir"
    />

    <LinkProgressDialog
      :show="showLinkProgress"
      :source-path="fileStore.selectedFiles[0] ? fileStore.selectedFiles[0].path : ''"
      :target-path="linkTargetDir"
      :progress="linkProgress"
      :status-message="currentProcessingFile"
      :is-complete="linkProcessCompleted"
      :can-cancel="!linkProcessCompleted"
      :current-file="currentProcessingFile"
      :can-close="linkProcessCompleted"
      @close="closeLinkProgress"
      @cancel="showLinkProgress = false"
    />

    <Toast
      :show="showToast"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFileStore } from '../stores/file'
import { useFileOperations } from '../composables/useFileOperations'
import { useDialogOperations } from '../composables/useDialogOperations'
import { useFileNavigation } from '../composables/useFileNavigation'
import { getFileIcon, getFileType } from '../utils/fileUtils'
import { formatFileSize, formatDate } from '../utils/formatUtils'

// 组件导入
import Breadcrumbs from '../components/explorer/Breadcrumbs.vue'
import Toolbar from '../components/explorer/Toolbar.vue'
import FileList from '../components/explorer/FileList.vue'
import ContextMenu from '../components/explorer/ContextMenu.vue'
import CreateFolderDialog from '../components/explorer/dialogs/CreateFolderDialog.vue'
import RenameDialog from '../components/explorer/dialogs/RenameDialog.vue'
import CreateLinkDialog from '../components/explorer/dialogs/CreateLinkDialog.vue'
import PropertiesDialog from '../components/explorer/dialogs/PropertiesDialog.vue'
import InfoDialog from '../components/explorer/dialogs/InfoDialog.vue'
import HardLinkInfoDialog from '../components/explorer/dialogs/HardLinkInfoDialog.vue'
import DirectoryPickerDialog from '../components/explorer/dialogs/DirectoryPickerDialog.vue'
import LinkProgressDialog from '../components/explorer/dialogs/LinkProgressDialog.vue'
import Toast from '../components/explorer/Toast.vue'

// 状态管理
const fileStore = useFileStore()

// 使用组合式函数
const {
  createFolder,
  uploadFiles,
  createLink,
  refreshDirectory
} = useFileOperations(fileStore)

// 对话框状态
const showCreateFolderDialog = ref(false)
const showRenameDialog = ref(false)
const showCreateLinkDialog = ref(false)
const showPropertiesDialog = ref(false)
const showInfoDialog = ref(false)
const showHardLinkInfo = ref(false)
const showDirectoryPicker = ref(false)
const showLinkProgress = ref(false)
const showDeleteConfirmDialog = ref(false)
const showToast = ref(false)

// 对话框数据
const contextMenu = ref({ show: false, top: 0, left: 0, item: null })
const newFolderName = ref('')
const newName = ref('')
const linkType = ref('symlink')
const linkName = ref('')
const linkTargetDir = ref('')
const selectedFile = ref(null)
const hardLinks = ref([])
const linkProgress = ref(0)
const currentProcessingFile = ref('')
const linkProcessCompleted = ref(false)
const deleteConfirmMessage = ref('')
const toastMessage = ref('')
const toastType = ref('info')
const infoDialog = ref({ title: '', message: '' })
const pickerCurrentPath = ref('')
const pickerFiles = ref([])
const pickerBreadcrumbs = ref([])
const pickerLoading = ref(false)

// 文件上传输入框引用
const fileInput = ref(null)

// 从 useFileNavigation 中解构出事件处理函数
const {
  navigateTo,
  navigateUp,
  handleFileAction,
  handleFileClick,
  handleFileDoubleClick,
  handleFileContextMenu,
  findHardLinks,
  getSymLinkTarget,
  openDirectoryPicker,
  handleHardLinkNavigate,
  deleteHardLink,
  deleteAllHardLinks,
  pickerNavigateTo,
  pickerNavigateUp,
  selectLinkTargetDir,
  closeLinkProgress,
  confirmRename,
  confirmDelete,
  showToastMessage,
  openCreateLinkDialog
} = useFileNavigation(fileStore, (event, ...args) => {
  if (event === 'context-menu') {
    contextMenu.value = {
      show: true,
      top: args[0].clientY,
      left: args[0].clientX,
      item: args[1]
    }
  }
})

// 重命名选中的文件
const renameSelected = () => {
  if (fileStore.selectedFiles.length === 1) {
    selectedFile.value = fileStore.selectedFiles[0]
    newName.value = selectedFile.value.name
    showRenameDialog.value = true
  }
}

// 处理删除
const handleDelete = async () => {
  if (fileStore.selectedFiles.length === 0) return

  deleteConfirmMessage.value = `确定要删除选中的 ${fileStore.selectedFiles.length} 个文件/文件夹吗？`
  showDeleteConfirmDialog.value = true
}

// 显示文件属性
const showFileProperties = () => {
  if (fileStore.selectedFiles.length === 1) {
    selectedFile.value = fileStore.selectedFiles[0]
    showPropertiesDialog.value = true
  }
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenu.value.show = false
}

// 初始化
onMounted(() => {
  console.log('Explorer mounted, fetching files...')
  fileStore.fetchFiles().then(() => {
    console.log('Files fetched successfully:', fileStore.files)
  }).catch(error => {
    console.error('Failed to fetch files:', error)
  })
  document.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})

const navigateBack = () => {
  fileStore.goBack()
}

const navigateForward = () => {
  fileStore.goForward()
}

const showSettings = () => {
  // TODO: 实现设置对话框
  console.log('Show settings')
}

const toggleViewMode = () => {
  fileStore.setViewMode(fileStore.viewMode === 'list' ? 'grid' : 'list')
}
</script>

<style scoped>
/* 只保留必要的样式 */
.hidden {
  display: none;
}
</style>
