<template>
  <div class="explorer">
    <!-- 面包屑导航 -->
    <div class="breadcrumbs">
      <span
        v-for="(crumb, index) in fileStore.breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        @click="navigateTo(crumb.path)"
      >
        {{ crumb.name }}
        <span v-if="index < fileStore.breadcrumbs.length - 1" class="separator">/</span>
      </span>
    </div>
    
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="actions">
        <button @click="navigateUp" title="返回上级目录">
          <span class="icon">↑</span>
        </button>
        <button @click="refreshDirectory" title="刷新">
          <span class="icon">⟳</span>
        </button>
        <button @click="showCreateFolderDialog = true" title="新建文件夹">
          <span class="icon">📁+</span>
        </button>
        <button 
          @click="fileInput.click()" 
          title="上传文件"
        >
          <span class="icon">⬆️</span>
        </button>
        <input 
          ref="fileInput" 
          type="file" 
          multiple 
          style="display: none"
          @change="uploadFiles" 
        />
      </div>
      
      <div class="view-controls">
        <button 
          @click="fileStore.setViewMode('list')" 
          :class="{ active: fileStore.viewMode === 'list' }"
          title="列表视图"
        >
          <span class="icon">☰</span>
        </button>
        <button 
          @click="fileStore.setViewMode('grid')" 
          :class="{ active: fileStore.viewMode === 'grid' }"
          title="图标视图"
        >
          <span class="icon">⊞</span>
        </button>
        <button 
          @click="fileStore.toggleHiddenFiles()" 
          :class="{ active: fileStore.showHiddenFiles }"
          title="显示隐藏文件"
        >
          <span class="icon">👁️</span>
        </button>
      </div>
    </div>
    
    <!-- 文件操作菜单 -->
    <div class="file-operations" v-if="fileStore.hasSelection">
      <button @click="renameSelected" title="重命名">
        重命名
      </button>
      <button @click="deleteSelected" title="删除">
        删除
      </button>
      <button @click="fileStore.copyToClipboard()" title="复制">
        复制
      </button>
      <button @click="fileStore.cutToClipboard()" title="剪切">
        剪切
      </button>
      <button @click="showCreateLinkDialog = true" title="创建链接">
        创建链接
      </button>
    </div>
    
    <button 
      v-if="fileStore.hasClipboard" 
      @click="fileStore.pasteFromClipboard()"
      class="paste-button"
      title="粘贴"
    >
      粘贴
    </button>
    
    <!-- 文件列表 -->
    <div :class="['file-list', fileStore.viewMode]">
      <div v-if="fileStore.loading" class="loading">
        加载中...
      </div>
      
      <div v-else-if="fileStore.error" class="error">
        {{ fileStore.error }}
      </div>
      
      <div v-else-if="fileStore.sortedFiles.length === 0" class="empty">
        文件夹为空
      </div>
      
      <template v-else>
        <!-- 列表头部 -->
        <div v-if="fileStore.viewMode === 'list'" class="file-list-header">
          <span @click="fileStore.setSortOptions('name')" class="column name">
            名称
            <span v-if="fileStore.sortBy === 'name'" class="sort-indicator">
              {{ fileStore.sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </span>
          <span @click="fileStore.setSortOptions('size')" class="column size">
            大小
            <span v-if="fileStore.sortBy === 'size'" class="sort-indicator">
              {{ fileStore.sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </span>
          <span @click="fileStore.setSortOptions('date')" class="column date">
            修改日期
            <span v-if="fileStore.sortBy === 'date'" class="sort-indicator">
              {{ fileStore.sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </span>
          <span class="column type">类型</span>
        </div>
        
        <!-- 文件项目 -->
        <div 
          v-for="file in fileStore.sortedFiles" 
          :key="file.name"
          :class="['file-item', { 
            selected: isSelected(file),
            directory: file.isDirectory,
            file: file.isFile,
            symlink: file.isSymbolicLink
          }]"
          @click="selectFile(file, $event.ctrlKey || $event.metaKey)"
          @dblclick="handleFileAction(file)"
          @contextmenu.prevent="showContextMenu($event, file)"
        >
          <!-- 列表视图 -->
          <template v-if="fileStore.viewMode === 'list'">
            <span class="column name">
              <span class="file-icon">
                {{ getFileIcon(file) }}
              </span>
              {{ file.name }}
            </span>
            <span class="column size">{{ formatFileSize(file.size) }}</span>
            <span class="column date">{{ formatDate(file.modifiedTime) }}</span>
            <span class="column type">{{ getFileType(file) }}</span>
          </template>
          
          <!-- 网格视图 -->
          <template v-else>
            <div class="file-icon">
              {{ getFileIcon(file) }}
            </div>
            <div class="file-name">{{ file.name }}</div>
          </template>
        </div>
      </template>
    </div>
    
    <!-- 右键菜单 -->
    <div 
      v-if="contextMenu.show" 
      class="context-menu"
      :style="{ top: contextMenu.top + 'px', left: contextMenu.left + 'px' }"
    >
      <div v-if="contextMenu.item" class="menu-items">
        <div class="menu-item" @click="handleFileAction(contextMenu.item)">
          {{ contextMenu.item.isDirectory ? '打开' : '查看' }}
        </div>
        <div class="menu-item" @click="renameSelected">重命名</div>
        <div class="menu-item" @click="deleteSelected">删除</div>
        <div class="menu-item" @click="fileStore.copyToClipboard([contextMenu.item])">复制</div>
        <div class="menu-item" @click="fileStore.cutToClipboard([contextMenu.item])">剪切</div>
        <div class="menu-item" @click="showFileProperties(contextMenu.item)">属性</div>
        <div class="menu-item" @click="showCreateLinkDialog = true">创建链接</div>
        <div v-if="contextMenu.item.isFile" class="menu-item" @click="findHardLinks(contextMenu.item)">查找硬链接</div>
        <div v-if="contextMenu.item.isSymbolicLink" class="menu-item" @click="getSymLinkTarget(contextMenu.item)">查看链接目标</div>
      </div>
      <div v-else class="menu-items">
        <div class="menu-item" @click="refreshDirectory">刷新</div>
        <div class="menu-item" @click="showCreateFolderDialog = true">新建文件夹</div>
        <div class="menu-item" @click="fileInput.click()">上传文件</div>
        <div v-if="fileStore.hasClipboard" class="menu-item" @click="fileStore.pasteFromClipboard()">粘贴</div>
        <div class="menu-item" @click="fileStore.setSortOptions('name')">按名称排序</div>
        <div class="menu-item" @click="fileStore.setSortOptions('date')">按日期排序</div>
        <div class="menu-item" @click="fileStore.toggleHiddenFiles()">
          {{ fileStore.showHiddenFiles ? '隐藏' : '显示' }}隐藏文件
        </div>
      </div>
    </div>
    
    <!-- 创建文件夹对话框 -->
    <div v-if="showCreateFolderDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>新建文件夹</h3>
        <form @submit.prevent="createFolder">
          <input 
            ref="folderNameInput"
            v-model="newFolderName" 
            type="text" 
            placeholder="文件夹名称"
            autofocus
          />
          <div class="dialog-buttons">
            <button type="button" @click="showCreateFolderDialog = false">取消</button>
            <button type="submit" :disabled="!newFolderName">创建</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 重命名对话框 -->
    <div v-if="showRenameDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>重命名</h3>
        <form @submit.prevent="confirmRename">
          <input 
            ref="renameInput"
            v-model="newName" 
            type="text" 
            placeholder="新名称"
            autofocus
          />
          <div class="dialog-buttons">
            <button type="button" @click="showRenameDialog = false">取消</button>
            <button type="submit" :disabled="!newName">重命名</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 创建链接对话框 -->
    <div v-if="showCreateLinkDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>创建链接</h3>
        <form @submit.prevent="createLink">
          <div class="form-group">
            <label>链接类型</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="linkType" value="hard" />
                硬链接
              </label>
              <label>
                <input type="radio" v-model="linkType" value="symbolic" />
                软链接 (符号链接)
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>源文件/目录</label>
            <input 
              type="text" 
              v-model="linkSource.name" 
              disabled
            />
          </div>
          <div class="form-group">
            <label>链接名称</label>
            <input 
              ref="linkNameInput"
              v-model="linkName" 
              type="text" 
              placeholder="链接名称"
              autofocus
            />
          </div>
          <div class="dialog-buttons">
            <button type="button" @click="showCreateLinkDialog = false">取消</button>
            <button type="submit" :disabled="!linkName">创建</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 文件属性对话框 -->
    <div v-if="showPropertiesDialog" class="dialog-overlay">
      <div class="dialog properties-dialog">
        <h3>文件属性</h3>
        <div v-if="selectedFile" class="properties-content">
          <div class="property-row">
            <div class="property-label">名称:</div>
            <div class="property-value">{{ selectedFile.name }}</div>
          </div>
          <div class="property-row">
            <div class="property-label">类型:</div>
            <div class="property-value">{{ getFileType(selectedFile) }}</div>
          </div>
          <div class="property-row">
            <div class="property-label">位置:</div>
            <div class="property-value">{{ fileStore.currentPath || '/' }}</div>
          </div>
          <div class="property-row">
            <div class="property-label">大小:</div>
            <div class="property-value">{{ formatFileSize(selectedFile.size) }}</div>
          </div>
          <div class="property-row">
            <div class="property-label">创建时间:</div>
            <div class="property-value">{{ formatDate(selectedFile.createdTime) }}</div>
          </div>
          <div class="property-row">
            <div class="property-label">修改时间:</div>
            <div class="property-value">{{ formatDate(selectedFile.modifiedTime) }}</div>
          </div>
          <div class="property-row">
            <div class="property-label">权限:</div>
            <div class="property-value">
              {{ selectedFile.permissions.readable ? 'r' : '-' }}
              {{ selectedFile.permissions.writable ? 'w' : '-' }}
              {{ selectedFile.permissions.executable ? 'x' : '-' }}
            </div>
          </div>
        </div>
        <div class="dialog-buttons">
          <button @click="showPropertiesDialog = false">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 提示对话框 -->
    <div v-if="showInfoDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{ infoDialog.title }}</h3>
        <div class="info-content" v-html="infoDialog.message"></div>
        <div class="dialog-buttons">
          <button @click="showInfoDialog = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useFileStore } from '../store/fileStore';
import axios from 'axios';

export default {
  name: 'Explorer',
  setup() {
    const fileStore = useFileStore();
    const fileInput = ref(null);
    const folderNameInput = ref(null);
    const renameInput = ref(null);
    const linkNameInput = ref(null);
    
    // 对话框状态
    const showCreateFolderDialog = ref(false);
    const showRenameDialog = ref(false);
    const showCreateLinkDialog = ref(false);
    const showPropertiesDialog = ref(false);
    const showInfoDialog = ref(false);
    
    // 表单数据
    const newFolderName = ref('');
    const newName = ref('');
    const linkType = ref('symbolic');
    const linkName = ref('');
    const linkSource = ref({});
    const selectedFile = ref(null);
    
    // 右键菜单
    const contextMenu = ref({
      show: false,
      top: 0,
      left: 0,
      item: null
    });
    
    // 信息对话框内容
    const infoDialog = ref({
      title: '',
      message: ''
    });
    
    // 加载初始目录内容
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
    
    // 导航到指定路径
    const navigateTo = async (path) => {
      try {
        await fileStore.fetchDirectory(path);
      } catch (error) {
        console.error('Failed to navigate:', error);
      }
    };
    
    // 导航到上级目录
    const navigateUp = () => {
      if (!fileStore.currentPath) return;
      
      const parts = fileStore.currentPath.split('/').filter(Boolean);
      parts.pop();
      const parentPath = parts.join('/');
      
      navigateTo(parentPath);
    };
    
    // 刷新当前目录
    const refreshDirectory = () => {
      fileStore.fetchDirectory(fileStore.currentPath);
    };
    
    // 创建文件夹
    const createFolder = async () => {
      if (!newFolderName.value) return;
      
      try {
        await fileStore.createDirectory(newFolderName.value);
        newFolderName.value = '';
        showCreateFolderDialog.value = false;
      } catch (error) {
        console.error('Failed to create folder:', error);
      }
    };
    
    // 上传文件
    const uploadFiles = async (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      try {
        await fileStore.uploadFiles(files);
        fileInput.value.value = ''; // 清空文件输入，允许再次上传相同文件
      } catch (error) {
        console.error('Failed to upload files:', error);
      }
    };
    
    // 重命名选中文件
    const renameSelected = () => {
      if (fileStore.selectedFiles.length !== 1) return;
      
      const file = fileStore.selectedFiles[0];
      newName.value = file.name;
      showRenameDialog.value = true;
      
      nextTick(() => {
        if (renameInput.value) {
          renameInput.value.focus();
          renameInput.value.select();
        }
      });
    };
    
    // 确认重命名
    const confirmRename = async () => {
      if (!newName.value || fileStore.selectedFiles.length !== 1) return;
      
      try {
        await fileStore.renameItem(fileStore.selectedFiles[0], newName.value);
        showRenameDialog.value = false;
      } catch (error) {
        console.error('Failed to rename:', error);
      }
    };
    
    // 删除选中文件
    const deleteSelected = async () => {
      if (!fileStore.selectedFiles.length) return;
      
      const isMultiple = fileStore.selectedFiles.length > 1;
      const confirmMessage = isMultiple 
        ? `确定要删除这 ${fileStore.selectedFiles.length} 个项目吗？`
        : `确定要删除 "${fileStore.selectedFiles[0].name}" 吗？`;
        
      if (confirm(confirmMessage)) {
        try {
          await fileStore.deleteItems();
        } catch (error) {
          console.error('Failed to delete:', error);
        }
      }
    };
    
    // 创建链接
    const createLink = async () => {
      if (!linkName.value || !fileStore.selectedFiles.length) return;
      
      linkSource.value = fileStore.selectedFiles[0];
      
      try {
        if (linkType.value === 'hard') {
          // 硬链接只能用于文件
          if (!linkSource.value.isFile) {
            alert('硬链接只能用于文件，不能用于目录');
            return;
          }
          
          await fileStore.createHardLink(linkSource.value, linkName.value);
        } else {
          await fileStore.createSymLink(linkSource.value, linkName.value);
        }
        
        showCreateLinkDialog.value = false;
        linkName.value = '';
      } catch (error) {
        console.error('Failed to create link:', error);
        alert(`创建链接失败: ${error.message}`);
      }
    };
    
    // 显示文件属性
    const showFileProperties = (file) => {
      selectedFile.value = file;
      showPropertiesDialog.value = true;
    };
    
    // 处理文件操作(打开目录或查看文件)
    const handleFileAction = (file) => {
      if (file.isDirectory) {
        const newPath = fileStore.currentPath
          ? `${fileStore.currentPath}/${file.name}`
          : file.name;
        navigateTo(newPath);
      } else {
        // 预览文件
        window.open(`/api/files/content?path=${encodeURIComponent(file.path)}`, '_blank');
      }
    };
    
    // 显示右键菜单
    const showContextMenu = (event, item = null) => {
      contextMenu.value = {
        show: true,
        top: event.clientY,
        left: event.clientX,
        item: item
      };
      
      // 如果右键点击的是文件/文件夹，选中它
      if (item) {
        fileStore.selectFile(item);
      }
      
      // 阻止事件冒泡
      event.stopPropagation();
    };
    
    // 选择文件
    const selectFile = (file, multiSelect = false) => {
      fileStore.selectFile(file, multiSelect);
    };
    
    // 检查文件是否被选中
    const isSelected = (file) => {
      return fileStore.selectedFiles.some(f => f.name === file.name);
    };
    
    // 查找硬链接
    const findHardLinks = async (file) => {
      try {
        const response = await axios.get('/api/links/find-hardlinks', {
          params: {
            path: file.path
          }
        });
        
        const data = response.data;
        
        let message = `<div>文件: ${file.name}</div>`;
        message += `<div>Inode: ${data.inode}</div>`;
        message += `<div>链接数: ${data.linkCount}</div>`;
        
        if (data.hardlinks.length) {
          message += '<div>硬链接列表:</div><ul>';
          data.hardlinks.forEach(link => {
            message += `<li>${link.path}</li>`;
          });
          message += '</ul>';
        } else {
          message += '<div>没有找到其他硬链接</div>';
        }
        
        infoDialog.value = {
          title: '硬链接信息',
          message
        };
        
        showInfoDialog.value = true;
      } catch (error) {
        console.error('Failed to find hard links:', error);
        alert('查找硬链接失败');
      }
    };
    
    // 获取符号链接目标
    const getSymLinkTarget = async (file) => {
      try {
        const response = await axios.get('/api/links/symlink-target', {
          params: {
            path: file.path
          }
        });
        
        const data = response.data;
        let status = data.broken ? '❌ 链接已断开' : '✅ 链接正常';
        
        let message = `<div>符号链接: ${file.name}</div>`;
        message += `<div>链接状态: ${status}</div>`;
        message += `<div>链接目标: ${data.target}</div>`;
        
        infoDialog.value = {
          title: '符号链接信息',
          message
        };
        
        showInfoDialog.value = true;
      } catch (error) {
        console.error('Failed to get symlink target:', error);
        alert('获取链接目标失败');
      }
    };
    
    // 格式化文件大小
    const formatFileSize = (size) => {
      if (size === 0) return '0 B';
      
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(1024));
      
      return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleString();
    };
    
    // 获取文件图标
    const getFileIcon = (file) => {
      if (file.isDirectory) return '📁';
      if (file.isSymbolicLink) return '🔗';
      
      // 根据文件扩展名返回不同图标
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      switch (ext) {
        case 'txt':
        case 'md':
        case 'log':
          return '📄';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
          return '🖼️';
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'ogg':
          return '🎵';
        case 'mp4':
        case 'mkv':
        case 'avi':
        case 'mov':
          return '🎬';
        case 'pdf':
          return '📕';
        case 'zip':
        case 'rar':
        case 'tar':
        case 'gz':
        case '7z':
          return '🗜️';
        case 'js':
        case 'py':
        case 'java':
        case 'c':
        case 'cpp':
        case 'php':
          return '💻';
        default:
          return '📄';
      }
    };
    
    // 获取文件类型描述
    const getFileType = (file) => {
      if (file.isDirectory) return '文件夹';
      if (file.isSymbolicLink) return '符号链接';
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      switch (ext) {
        case 'txt': return '文本文件';
        case 'md': return 'Markdown 文件';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp': return '图片';
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'ogg': return '音频文件';
        case 'mp4':
        case 'mkv':
        case 'avi':
        case 'mov': return '视频文件';
        case 'pdf': return 'PDF 文档';
        case 'zip':
        case 'rar':
        case 'tar':
        case 'gz':
        case '7z': return '压缩文件';
        case 'js': return 'JavaScript 文件';
        case 'py': return 'Python 文件';
        case 'java': return 'Java 文件';
        case 'c': return 'C 文件';
        case 'cpp': return 'C++ 文件';
        case 'php': return 'PHP 文件';
        default: return `${ext ? ext.toUpperCase() : '未知'} 文件`;
      }
    };
    
    return {
      fileStore,
      fileInput,
      folderNameInput,
      renameInput,
      linkNameInput,
      showCreateFolderDialog,
      showRenameDialog,
      showCreateLinkDialog,
      showPropertiesDialog,
      showInfoDialog,
      newFolderName,
      newName,
      linkType,
      linkName,
      linkSource,
      selectedFile,
      contextMenu,
      infoDialog,
      navigateTo,
      navigateUp,
      refreshDirectory,
      createFolder,
      uploadFiles,
      renameSelected,
      confirmRename,
      deleteSelected,
      createLink,
      showFileProperties,
      handleFileAction,
      showContextMenu,
      selectFile,
      isSelected,
      findHardLinks,
      getSymLinkTarget,
      formatFileSize,
      formatDate,
      getFileIcon,
      getFileType
    };
  }
};
</script>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - var(--footer-height) - 40px);
  position: relative;
}

.breadcrumbs {
  background-color: #f0f2f5;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: auto;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--primary-color);
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 5px;
  color: #999;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.actions, .view-controls {
  display: flex;
  gap: 5px;
}

button {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #f5f7fa;
}

button.active {
  background-color: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}

.icon {
  font-size: 16px;
}

.file-operations {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.paste-button {
  margin-bottom: 10px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
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

.context-menu {
  position: fixed;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 150px;
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.dialog {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 400px;
  max-width: 90%;
}

.dialog h3 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

.dialog input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 15px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.properties-dialog {
  width: 500px;
}

.properties-content {
  margin-bottom: 20px;
}

.property-row {
  display: flex;
  margin-bottom: 8px;
}

.property-label {
  width: 100px;
  font-weight: bold;
}

.property-value {
  flex: 1;
  word-break: break-all;
}

.info-content {
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
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