import { ref } from 'vue';

export function useDialogOperations() {
  // 对话框状态
  const showCreateFolderDialog = ref(false);
  const showRenameDialog = ref(false);
  const showCreateLinkDialog = ref(false);
  const showPropertiesDialog = ref(false);
  const showInfoDialog = ref(false);
  const showHardLinkInfo = ref(false);
  const showDirectoryPicker = ref(false);
  const showLinkProgress = ref(false);

  // 对话框数据
  const newFolderName = ref('');
  const newName = ref('');
  const linkType = ref('symbolic');
  const linkName = ref('');
  const linkTargetDir = ref('');
  const selectedFile = ref(null);
  const hardLinks = ref([]);
  const recursiveLink = ref(false);

  // 信息对话框内容
  const infoDialog = ref({
    title: '',
    message: ''
  });

  // 链接进度对话框
  const linkProgress = ref(0);
  const processedFiles = ref(0);
  const totalFiles = ref(0);
  const currentProcessingFile = ref('');
  const linkProcessCompleted = ref(false);

  // 目录选择器状态
  const pickerCurrentPath = ref('');
  const pickerFiles = ref([]);
  const pickerBreadcrumbs = ref([]);
  const pickerLoading = ref(false);

  // 右键菜单
  const contextMenu = ref({
    show: false,
    top: 0,
    left: 0,
    item: null
  });

  return {
    // 对话框状态
    showCreateFolderDialog,
    showRenameDialog,
    showCreateLinkDialog,
    showPropertiesDialog,
    showInfoDialog,
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

    // 信息对话框
    infoDialog,

    // 链接进度
    linkProgress,
    processedFiles,
    totalFiles,
    currentProcessingFile,
    linkProcessCompleted,

    // 目录选择器
    pickerCurrentPath,
    pickerFiles,
    pickerBreadcrumbs,
    pickerLoading,

    // 右键菜单
    contextMenu
  };
}
