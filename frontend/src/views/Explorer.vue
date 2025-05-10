<template>
  <div class="explorer">
    <Breadcrumbs
      :breadcrumbs="fileStore.breadcrumbs"
      @navigate="navigateTo"
    />

    <Toolbar
      :has-selection="fileStore.hasSelection"
      :has-clipboard="fileStore.hasClipboard"
      :view-mode="fileStore.viewMode"
      :show-hidden-files="fileStore.showHiddenFiles"
      @navigate-up="navigateUp"
      @refresh="refreshDirectory"
      @create-folder="showCreateFolderDialog = true"
      @upload="fileInput.click()"
      @rename="renameSelected"
      @delete="handleDelete"
      @copy="fileStore.copyToClipboard()"
      @cut="fileStore.cutToClipboard()"
      @create-link="openCreateLinkDialog"
      @paste="fileStore.pasteFromClipboard()"
      @view-mode-change="fileStore.setViewMode"
      @toggle-hidden="fileStore.toggleHiddenFiles()"
    />

    <FileList
      :files="fileStore.sortedFiles"
      :loading="fileStore.loading"
      :error="fileStore.error"
      :view-mode="fileStore.viewMode"
      :sort-by="fileStore.sortBy"
      :sort-order="fileStore.sortOrder"
      :selected-files="fileStore.selectedFiles"
      @select="selectFile"
      @action="handleFileAction"
      @context-menu="showContextMenu"
      @sort="fileStore.setSortOptions"
    />

    <input
      ref="fileInput"
      type="file"
      multiple
      style="display: none"
      @change="uploadFiles"
    />

    <ContextMenu
      :show="contextMenu.show"
      :top="contextMenu.top"
      :left="contextMenu.left"
      :item="contextMenu.item"
      :has-clipboard="fileStore.hasClipboard"
      :show-hidden-files="fileStore.showHiddenFiles"
      @action="handleFileAction"
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
      @close="showRenameDialog = false"
      @rename="confirmRename"
    />

    <CreateLinkDialog
      :show="showCreateLinkDialog"
      :source-name="selectedFile ? selectedFile.name : ''"
      :source-path="selectedFile ? selectedFile.path : ''"
      :is-directory="selectedFile ? selectedFile.isDirectory : false"
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
      @open-directory-picker="() => {
        console.log('Explorer - open-directory-picker event received');
        openDirectoryPicker();
      }"
    />

    <PropertiesDialog
      :show="showPropertiesDialog"
      :file="selectedFile"
      :current-path="fileStore.currentPath"
      @close="showPropertiesDialog = false"
    />

    <InfoDialog
      :show="showInfoDialog"
      :title="infoDialog.title"
      :message="infoDialog.message"
      @close="showInfoDialog = false"
    />

    <!-- 删除确认对话框 -->
    <InfoDialog
      :show="showDeleteConfirmDialog"
      title="确认删除"
      :message="deleteConfirmMessage"
      :show-confirm="true"
      confirm-text="删除"
      @close="showDeleteConfirmDialog = false"
      @confirm="confirmDelete"
    />

    <HardLinkInfoDialog
      :show="showHardLinkInfo"
      :source-path="selectedFile ? selectedFile.path : ''"
      :hard-links="hardLinks"
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

<script>
import { ref, onMounted } from 'vue';
import { useFileStore } from '../store/fileStore';
import { useFileOperations } from '../composables/useFileOperations';
import { useDialogOperations } from '../composables/useDialogOperations';
import { useFileNavigation } from '../composables/useFileNavigation';
import { getFileIcon, getFileType } from '../utils/fileUtils';
import { formatFileSize, formatDate } from '../utils/formatUtils';

// 组件导入
import Breadcrumbs from '../components/explorer/Breadcrumbs.vue';
import Toolbar from '../components/explorer/Toolbar.vue';
import FileList from '../components/explorer/FileList.vue';
import ContextMenu from '../components/explorer/ContextMenu.vue';
import CreateFolderDialog from '../components/explorer/dialogs/CreateFolderDialog.vue';
import RenameDialog from '../components/explorer/dialogs/RenameDialog.vue';
import CreateLinkDialog from '../components/explorer/dialogs/CreateLinkDialog.vue';
import PropertiesDialog from '../components/explorer/dialogs/PropertiesDialog.vue';
import InfoDialog from '../components/explorer/dialogs/InfoDialog.vue';
import HardLinkInfoDialog from '../components/explorer/dialogs/HardLinkInfoDialog.vue';
import DirectoryPickerDialog from '../components/explorer/dialogs/DirectoryPickerDialog.vue';
import LinkProgressDialog from '../components/explorer/dialogs/LinkProgressDialog.vue';
import Toast from '../components/explorer/Toast.vue';

export default {
  name: 'Explorer',
  components: {
    Breadcrumbs,
    Toolbar,
    FileList,
    ContextMenu,
    CreateFolderDialog,
    RenameDialog,
    CreateLinkDialog,
    PropertiesDialog,
    InfoDialog,
    HardLinkInfoDialog,
    DirectoryPickerDialog,
    LinkProgressDialog,
    Toast
  },
  setup() {
    console.log('Explorer - setup called');
    const fileStore = useFileStore();
    console.log('Explorer - fileStore initialized:', fileStore);
    const fileInput = ref(null);

    // 使用组合式函数
    const {
      createFolder,
      uploadFiles,
      deleteSelected,
      createLink,
      openFile
    } = useFileOperations(fileStore);

    const {
      showCreateFolderDialog,
      showRenameDialog,
      showCreateLinkDialog,
      showPropertiesDialog,
      showInfoDialog,
      showHardLinkInfo,
      showDirectoryPicker,
      showLinkProgress,
      newFolderName,
      newName,
      linkType,
      linkName,
      linkTargetDir,
      selectedFile,
      hardLinks,
      recursiveLink,
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
      contextMenu
    } = useDialogOperations();

    const {
      navigateTo,
      navigateUp,
      refreshDirectory,
      navigateToHardLink,
      pickerNavigateTo,
      pickerNavigateUp
    } = useFileNavigation(fileStore, {
      pickerLoading,
      pickerCurrentPath,
      pickerFiles,
      pickerBreadcrumbs
    });

    // 文件选择
    const selectFile = (file, event) => {
      if (event.ctrlKey || event.metaKey) {
        fileStore.toggleFileSelection(file);
      } else {
        fileStore.selectFile(file);
      }
    };

    // 文件操作处理
    const handleFileAction = async (action, file) => {
      switch (action) {
        case 'open':
          if (file.isDirectory) {
            navigateTo(file.path);
          } else {
            try {
              await openFile(file);
            } catch (error) {
              console.error('Failed to open file:', error);
              infoDialog.value = {
                title: '打开失败',
                message: `无法打开文件 "${file.name}"：${error.message}`
              };
              showInfoDialog.value = true;
            }
          }
          break;
        case 'rename':
          selectedFile.value = file;
          newName.value = file.name;
          showRenameDialog.value = true;
          break;
        case 'delete':
          if (await deleteSelected()) {
            refreshDirectory();
          }
          break;
        case 'properties':
          selectedFile.value = file;
          showPropertiesDialog.value = true;
          break;
      }
    };

    // 右键菜单
    const showContextMenu = (event, file) => {
      event.preventDefault();
      contextMenu.value = {
        show: true,
        top: event.clientY,
        left: event.clientX,
        item: file
      };
    };

    // 文件属性
    const showFileProperties = (file) => {
      selectedFile.value = file;
      showPropertiesDialog.value = true;
    };

    // 创建链接
    const openCreateLinkDialog = (file) => {
      if (!file) {
        if (!fileStore.selectedFiles.length) return;
        file = fileStore.selectedFiles[0];
      }
      selectedFile.value = file;
      linkName.value = file.name;
      linkType.value = 'symbolic';
      showCreateLinkDialog.value = true;
    };

    // 打开目录选择器
    const openDirectoryPicker = async () => {
      console.log('Explorer - openDirectoryPicker called');
      console.log('Explorer - fileStore:', fileStore);
      console.log('Explorer - fileStore.currentPath:', fileStore?.currentPath);

      if (!fileStore) {
        console.error('Explorer - fileStore is undefined');
        showToastMessage('文件存储未初始化', 'error');
        return;
      }

      try {
        pickerLoading.value = true;
        const currentPath = fileStore.currentPath || '';
        console.log('Explorer - Current path:', currentPath);

        await fileStore.fetchDirectory(currentPath);
        console.log('Explorer - Directory fetch completed');

        pickerCurrentPath.value = currentPath;
        pickerFiles.value = fileStore.files;
        pickerBreadcrumbs.value = fileStore.breadcrumbs;

        console.log('Explorer - Setting directory picker state:', {
          currentPath: pickerCurrentPath.value,
          filesCount: pickerFiles.value.length,
          breadcrumbsCount: pickerBreadcrumbs.value.length
        });

        showDirectoryPicker.value = true;
        console.log('Explorer - Directory picker dialog shown');
      } catch (error) {
        console.error('Explorer - Failed to open directory picker:', error);
        showToastMessage('打开目录选择器失败: ' + (error.message || '未知错误'), 'error');
      } finally {
        pickerLoading.value = false;
      }
    };

    // 重命名选中的文件
    const renameSelected = (file) => {
      if (!file) {
        if (!fileStore.selectedFiles.length) return;
        file = fileStore.selectedFiles[0];
      }
      console.log('Explorer - renameSelected called with file:', file);
      selectedFile.value = file;
      newName.value = file.name;
      showRenameDialog.value = true;
    };

    // 确认重命名
    const confirmRename = async (newName) => {
      console.log('Explorer - confirmRename called with:', newName);
      console.log('Explorer - selectedFile:', selectedFile.value);
      try {
        if (!newName || !selectedFile.value) {
          console.log('Explorer - Missing required data for rename');
          return;
        }

        console.log('Explorer - Calling renameItem API');
        await fileStore.renameItem(selectedFile.value, newName);
        console.log('Explorer - Rename successful');

        showRenameDialog.value = false;
        showToast.value = true;
        toastMessage.value = '重命名成功';
        toastType.value = 'success';
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
      } catch (error) {
        console.error('Explorer - Rename failed:', error);
        showToast.value = true;
        toastMessage.value = `重命名失败: ${error.message}`;
        toastType.value = 'error';
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
      }
    };

    // 选择链接目标目录
    const selectLinkTargetDir = (path) => {
      console.log('Explorer - selectLinkTargetDir called with path:', path);
      linkTargetDir.value = path;
      showDirectoryPicker.value = false;
    };

    // 查找硬链接
    const findHardLinks = async (file) => {
      try {
        const response = await fileStore.findHardLinks(file);
        hardLinks.value = response.hardlinks;
        selectedFile.value = file;
        showHardLinkInfo.value = true;
      } catch (error) {
        console.error('Failed to find hard links:', error);
      }
    };

    // 获取符号链接目标
    const getSymLinkTarget = async (file) => {
      try {
        const response = await fileStore.getSymLinkTarget(file);
        infoDialog.value = {
          title: '符号链接信息',
          message: `目标路径: ${response.targetPath}`
        };
        showInfoDialog.value = true;
      } catch (error) {
        console.error('Failed to get symlink target:', error);
      }
    };

    // 删除硬链接
    const deleteHardLink = async (path) => {
      try {
        await fileStore.deleteHardLink(path);
        await findHardLinks(selectedFile.value);
      } catch (error) {
        console.error('Failed to delete hard link:', error);
      }
    };

    // 删除所有硬链接
    const deleteAllHardLinks = async () => {
      try {
        await fileStore.deleteAllHardLinks(selectedFile.value);
        showHardLinkInfo.value = false;
      } catch (error) {
        console.error('Failed to delete all hard links:', error);
      }
    };

    // 关闭链接进度对话框
    const closeLinkProgress = () => {
      showLinkProgress.value = false;
      linkProgress.value = 0;
      processedFiles.value = 0;
      totalFiles.value = 0;
      currentProcessingFile.value = '';
      linkProcessCompleted.value = false;
    };

    // 对话框状态
    const showDeleteConfirmDialog = ref(false);
    const deleteConfirmMessage = ref('');

    const showToast = ref(false);
    const toastMessage = ref('');
    const toastType = ref('info');

    const showToastMessage = (message, type = 'info') => {
      console.log('Explorer - showToastMessage called:', { message, type });
      toastMessage.value = message;
      toastType.value = type;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    // 删除确认
    const confirmDelete = async () => {
      showDeleteConfirmDialog.value = false;
      try {
        if (await deleteSelected()) {
          refreshDirectory();
          showToastMessage('删除成功', 'success');
        }
      } catch (error) {
        showToastMessage(`删除失败：${error.message}`, 'error');
      }
    };

    // 删除选中的文件
    const handleDelete = () => {
      if (!fileStore.selectedFiles.length) return;

      const items = fileStore.selectedFiles;
      const itemNames = items.map(item => item.name).join('、');
      deleteConfirmMessage.value = `确定要删除以下项目吗？\n${itemNames}`;
      showDeleteConfirmDialog.value = true;
    };

    // 处理硬链接导航
    const handleHardLinkNavigate = async (data) => {
      try {
        // 导航到目录
        await fileStore.fetchDirectory(data.path);

        // 如果有目标文件，选中它
        if (data.targetFile) {
          const targetFile = fileStore.files.find(file => file.name === data.targetFile);
          if (targetFile) {
            fileStore.selectFile(targetFile);
          }
        }
      } catch (error) {
        console.error('Failed to navigate to hard link:', error);
      }
    };

    // 初始化
    onMounted(async () => {
      try {
        await fileStore.fetchDirectory('');
      } catch (error) {
        console.error('Failed to load directory:', error);
      }

      // 点击页面任意位置关闭右键菜单
      document.addEventListener('click', () => {
        contextMenu.value.show = false;
      });
    });

    return {
      // Store
      fileStore,

      // Refs
      fileInput,

      // 对话框状态
      showCreateFolderDialog,
      showRenameDialog,
      showCreateLinkDialog,
      showPropertiesDialog,
      showInfoDialog,
      showHardLinkInfo,
      showDirectoryPicker,
      showLinkProgress,
      showDeleteConfirmDialog,
      deleteConfirmMessage,

      // 对话框数据
      newFolderName,
      newName,
      linkType,
      linkName,
      linkTargetDir,
      selectedFile,
      hardLinks,
      recursiveLink,
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

      // 方法
      navigateTo,
      navigateUp,
      refreshDirectory,
      createFolder,
      uploadFiles,
      renameSelected,
      confirmRename,
      deleteSelected,
      handleDelete,
      confirmDelete,
      createLink,
      selectFile,
      handleFileAction,
      showContextMenu,
      showFileProperties,
      openCreateLinkDialog,
      selectLinkTargetDir,
      findHardLinks,
      getSymLinkTarget,
      deleteHardLink,
      deleteAllHardLinks,
      closeLinkProgress,
      pickerNavigateTo,
      pickerNavigateUp,
      navigateToHardLink,
      openDirectoryPicker,

      // 工具函数
      getFileIcon,
      getFileType,
      formatFileSize,
      formatDate,

      // Toast
      showToast,
      toastMessage,
      toastType,
      showToastMessage,

      // 处理硬链接导航
      handleHardLinkNavigate
    };
  }
};
</script>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  gap: 10px;
  background-color: #f5f7fa;
}

.file-list {
  flex: 1;
  overflow: auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-list.list {
  display: flex;
  flex-direction: column;
}

.file-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  column-gap: 15px;
  row-gap: 15px;
  padding: 15px 15px 5px 15px;
  align-content: start;
  height: auto;
  min-height: 200px;
}

.file-list-header {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 15px;
  font-weight: bold;
  user-select: none;
}

.file-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-list.list .file-item {
  display: flex;
  padding: 8px 15px;
  border-bottom: 1px solid #f0f2f5;
}

.file-list.grid .file-item {
  position: relative;
  text-align: center;
  padding: 5px;
  border-radius: 4px;
  max-width: 150px;
  margin: 0 auto;
  width: 100%;
  height: 90px;
  overflow: visible;
  margin-bottom: 0;
}

.file-icon {
  font-size: 24px;
  margin-right: 10px;
}

.file-list.grid .file-icon {
  font-size: 36px;
  display: block;
  margin: 0 auto 8px;
}

.file-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.file-list.grid .file-name {
  display: block;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

.file-item:hover {
  background-color: #f5f7fa;
}

.file-item.selected {
  background-color: rgba(66, 185, 131, 0.1);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.3);
}

.file-list.grid .file-item.selected {
  background-color: rgba(66, 185, 131, 0.1);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.3);
  border-radius: 8px;
}

.column {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.column.name {
  flex: 3;
  display: flex;
  align-items: center;
}

.column.size {
  flex: 1;
}

.column.date {
  flex: 2;
}

.column.type {
  flex: 1;
}

.loading, .error, .empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}

.error {
  color: #f56c6c;
}

@media (max-width: 768px) {
  .file-list.grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .file-list.grid .file-item {
    max-width: 100px;
  }

  .column.date {
    display: none;
  }

  .column.type {
    display: none;
  }
}
</style>
