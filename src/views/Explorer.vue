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
      <button @click="openCreateLinkDialog" title="创建链接">
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
        <div class="menu-item" @click="openCreateLinkDialog">创建链接</div>
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
              :value="fileStore.selectedFiles.length > 0 ? fileStore.selectedFiles[0].name : ''" 
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
          <div class="form-group">
            <label>目标目录 (可选)</label>
            <div class="directory-selector">
              <input 
                type="text" 
                v-model="linkTargetDir" 
                placeholder="留空表示当前目录"
                readonly
              />
              <button type="button" @click="openDirectoryPicker">浏览...</button>
            </div>
          </div>
          <div class="form-group" v-if="fileStore.selectedFiles.length > 0 && fileStore.selectedFiles[0].isDirectory">
            <label>
              <input type="checkbox" v-model="recursiveLink" />
              递归创建文件夹内所有文件的链接
            </label>
            <small>将保留文件夹结构</small>
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
    
    <!-- 硬链接信息对话框 -->
    <div v-if="showHardLinkInfo" class="dialog-overlay" @click.self="showHardLinkInfo = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>硬链接信息</h3>
          <button class="close-btn" @click="showHardLinkInfo = false">×</button>
        </div>
        <div class="dialog-content">
          <p><strong>源文件:</strong> {{ selectedFile ? selectedFile.path : '' }}</p>
          <p><strong>硬链接数量:</strong> {{ hardLinks.length }}</p>
          
          <div v-if="hardLinks.length === 0" class="no-links-message">
            未找到硬链接
          </div>
          
          <div v-else class="hardlink-list">
            <div v-for="(link, index) in hardLinks" :key="index" class="hardlink-item">
              <a 
                class="hardlink-path" 
                href="#" 
                @click.prevent="navigateToHardLink(link.fullPath)"
                :title="link.fullPath"
              >
                <i class="material-icons file-icon">insert_link</i>
                <span class="filename">{{ link.fileName }}</span>
                <span class="path-suffix">{{ link.dirPath ? '在 ' + link.dirPath : '(根目录)' }}</span>
              </a>
              
              <button class="delete-btn" @click="deleteHardLink(link.fullPath)" title="删除硬链接">
                <i class="material-icons">delete</i>
              </button>
            </div>
          </div>
          
          <div class="delete-all-container" v-if="hardLinks.length > 1">
            <button class="delete-all-btn" @click="deleteAllHardLinks">
              <i class="material-icons" style="margin-right: 5px;">delete_sweep</i>
              删除所有硬链接
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 目录选择对话框 -->
    <div v-if="showDirectoryPicker" class="dialog-overlay">
      <div class="dialog directory-picker-dialog">
        <div class="dialog-header">
          <h3>选择目标目录</h3>
          <button class="close-btn" @click="showDirectoryPicker = false">×</button>
        </div>
        
        <div class="directory-browser">
          <!-- 面包屑导航 -->
          <div class="breadcrumbs">
            <span
              v-for="(crumb, index) in pickerBreadcrumbs"
              :key="index"
              class="breadcrumb-item"
              @click="pickerNavigateTo(crumb.path)"
            >
              {{ crumb.name }}
              <span v-if="index < pickerBreadcrumbs.length - 1" class="separator">/</span>
            </span>
          </div>
          
          <!-- 目录列表 -->
          <div class="directory-list">
            <div v-if="pickerLoading" class="loading-message">
              加载中...
            </div>
            
            <template v-else>
              <div 
                v-for="file in pickerFiles.filter(f => f.isDirectory)" 
                :key="file.name"
                class="directory-item"
                @dblclick="pickerNavigateTo(pickerCurrentPath ? `${pickerCurrentPath}/${file.name}` : file.name)"
              >
                <span class="file-icon">📁</span>
                <span class="dir-name">{{ file.name }}</span>
              </div>
              
              <div v-if="pickerFiles.filter(f => f.isDirectory).length === 0" class="empty-message">
                此目录中没有子目录
                <div class="debug-info">
                  <small>文件总数: {{ pickerFiles.length }}，目录数: {{ pickerFiles.filter(f => f.isDirectory).length }}</small>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <div class="dialog-footer">
          <div class="current-path">
            当前路径: {{ pickerCurrentPath || '/' }}
          </div>
          <div class="dialog-buttons">
            <button type="button" @click="pickerNavigateUp()" :disabled="!pickerCurrentPath">上级目录</button>
            <button type="button" @click="showDirectoryPicker = false">取消</button>
            <button type="button" @click="selectLinkTargetDir(pickerCurrentPath)">选择此目录</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 链接进度对话框 -->
    <div v-if="showLinkProgress" class="dialog-overlay">
      <div class="dialog link-progress-dialog">
        <h3>{{ linkProcessCompleted ? '操作完成' : '创建链接进度' }}</h3>
        
        <div v-if="!linkProcessCompleted" class="progress-bar">
          <div class="progress" :style="{ width: linkProgress + '%' }"></div>
        </div>
        
        <div v-if="!linkProcessCompleted" class="progress-info">
          <span>已处理 {{ processedFiles }} 个文件，共 {{ totalFiles }} 个</span>
          <span>正在处理: {{ currentProcessingFile }}</span>
        </div>
        
        <div v-else class="success-message">
          <div class="success-icon">✓</div>
          <p>成功为 {{ processedFiles }} 个文件创建了链接</p>
        </div>
        
        <div class="dialog-buttons" v-if="linkProcessCompleted">
          <button @click="closeLinkProgress">关闭</button>
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
    const showHardLinkInfo = ref(false);
    const showDirectoryPicker = ref(false);
    
    // 目录选择器独立状态
    const pickerCurrentPath = ref('');
    const pickerFiles = ref([]);
    const pickerBreadcrumbs = ref([]);
    const pickerLoading = ref(false);
    
    // 表单数据
    const newFolderName = ref('');
    const newName = ref('');
    const linkType = ref('symbolic');
    const linkName = ref('');
    const linkSource = ref({});
    const linkTargetDir = ref('');
    const selectedFile = ref(null);
    const hardLinks = ref([]);
    const recursiveLink = ref(false);
    
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
    
    // 链接进度对话框
    const showLinkProgress = ref(false);
    const linkProgress = ref(0);
    const processedFiles = ref(0);
    const totalFiles = ref(0);
    const currentProcessingFile = ref('');
    const linkProcessCompleted = ref(false);
    
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
    
    // 打开创建链接对话框
    const openCreateLinkDialog = () => {
      if (!fileStore.selectedFiles.length) return;
      
      // 设置默认链接名称为选中文件的名称
      const selectedFile = fileStore.selectedFiles[0];
      linkName.value = selectedFile.name;
      
      // 显示对话框
      showCreateLinkDialog.value = true;
      
      // 下一个渲染周期后聚焦输入框并选中文本
      nextTick(() => {
        if (linkNameInput.value) {
          linkNameInput.value.focus();
          linkNameInput.value.select();
        }
      });
    };
    
    // 创建链接
    const createLink = async () => {
      if (!linkName.value || !fileStore.selectedFiles.length) return;
      
      try {
        const source = fileStore.selectedFiles[0];
        
        // 递归创建文件夹中所有文件的链接
        if (source.isDirectory && recursiveLink.value) {
          await createDirectoryLinks(source);
        } else {
          // 普通链接创建
          const targetPath = linkTargetDir.value ? 
            `${linkTargetDir.value}/${linkName.value}` : 
            linkName.value;
          
          if (linkType.value === 'hard') {
            // 硬链接只能用于文件
            if (!source.isFile) {
              alert('硬链接只能用于文件，不能用于目录');
              return;
            }
            
            await fileStore.createHardLink(source, targetPath);
          } else {
            await fileStore.createSymLink(source, targetPath);
          }
        }
        
        showCreateLinkDialog.value = false;
        linkName.value = '';
        linkTargetDir.value = '';
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
      // 计算菜单位置，防止超出视口边界
      const menuHeight = item ? 320 : 220; // 增加估计的菜单高度
      const menuWidth = 180; // 估计的菜单宽度
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const clickX = event.clientX;
      const clickY = event.clientY;
      
      // 如果点击位置加上菜单高度超出窗口高度，则将菜单向上显示
      const topPosition = (clickY + menuHeight > windowHeight) 
        ? clickY - menuHeight 
        : clickY;
      
      // 如果点击位置加上菜单宽度超出窗口宽度，则将菜单向左显示
      const leftPosition = (clickX + menuWidth > windowWidth)
        ? clickX - menuWidth
        : clickX;
      
      contextMenu.value = {
        show: true,
        top: topPosition,
        left: leftPosition,
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
        fileStore.loading = true;
        const response = await axios.get(`/api/links/find-hardlinks`, {
          params: { path: file.path }
        });
        
        console.log('收到硬链接数据:', response.data);
        
        // 设置源文件和文件路径
        selectedFile.value = file;
        
        // 解析硬链接数据
        if (response.data && response.data.hardlinks) {
          const links = response.data.hardlinks.map(link => {
            // 分割路径为目录和文件名部分
            const parts = link.path.split('/');
            const fileName = parts.pop();
            const dirPath = parts.join('/');
            
            return {
              fullPath: link.path,
              dirPath: dirPath,
              fileName: fileName
            };
          });
          
          hardLinks.value = links;
        } else {
          // 即使没有硬链接也清空数组
          hardLinks.value = [];
        }
        
        // 总是显示对话框，即使没有找到硬链接
        nextTick(() => {
          showHardLinkInfo.value = true;
        });
      } catch (error) {
        console.error('Error finding hard links:', error);
        alert('查找硬链接失败: ' + (error.response?.data?.error || error.message));
      } finally {
        fileStore.loading = false;
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
    
    // 导航到硬链接所在目录
    const navigateToHardLink = (path) => {
      // 分割路径为目录和文件名部分
      const parts = path.split('/');
      const fileName = parts.pop();
      const dirPath = parts.join('/') || './';
      
      // 设置目标选中的文件名
      fileStore.targetToSelect = fileName;
      
      // 关闭对话框
      showHardLinkInfo.value = false;
      
      // 导航到硬链接所在目录并等待导航完成
      fileStore.fetchDirectory(dirPath).then(() => {
        // 确保目录加载完成后刷新显示
        nextTick(() => {
          // 尝试重新选择目标文件
          const targetFile = fileStore.files.find(f => f.name === fileName);
          if (targetFile) {
            fileStore.selectFile(targetFile);
            
            // 确保滚动到选中的文件
            const element = document.querySelector('.file-item.selected');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      });
    };
    
    // 删除硬链接
    const deleteHardLink = async (path) => {
      if (confirm(`确定要删除硬链接 "${path}" 吗？`)) {
        try {
          await axios.delete('/api/files/', {
            params: { path: path }
          });
          
          // 移除已删除的硬链接
          hardLinks.value = hardLinks.value.filter(link => link.fullPath !== path);
          
          // 如果当前目录中有这个文件，刷新目录
          refreshDirectory();
        } catch (error) {
          console.error('Failed to delete hardlink:', error);
          alert('删除硬链接失败');
        }
      }
    };
    
    // 删除所有硬链接
    const deleteAllHardLinks = async () => {
      if (confirm(`确定要删除所有 ${hardLinks.value.length} 个硬链接吗？`)) {
        try {
          // 创建删除所有硬链接的请求数组
          const deletePromises = hardLinks.value.map(link => 
            axios.delete('/api/files/', {
              params: { path: link.fullPath }
            })
          );
          
          // 等待所有删除操作完成
          await Promise.all(deletePromises);
          
          // 更新界面
          hardLinks.value = [];
          
          // 刷新目录
          refreshDirectory();
          
          alert('所有硬链接已删除');
        } catch (error) {
          console.error('Failed to delete all hardlinks:', error);
          alert('删除硬链接失败');
        }
      }
    };
    
    // 打开目录选择器
    const openDirectoryPicker = async () => {
      pickerCurrentPath.value = fileStore.currentPath;
      await fetchPickerDirectory(pickerCurrentPath.value);
      showDirectoryPicker.value = true;
    };
    
    // 获取目录选择器的目录内容
    const fetchPickerDirectory = async (path) => {
      pickerLoading.value = true;
      try {
        // 修改为正确的API路径
        const response = await axios.get('/api/files/list', { 
          params: { 
            path: path,
            showHidden: fileStore.showHiddenFiles
          } 
        });
        
        // 确保文件列表存在并且正确处理
        if (response.data) {
          pickerFiles.value = response.data;
        } else {
          console.error('API返回的数据格式不正确:', response.data);
          pickerFiles.value = [];
        }
        
        // 构建面包屑
        pickerBreadcrumbs.value = [];
        if (path) {
          const parts = path.split('/');
          let currentPath = '';
          
          // 添加根目录
          pickerBreadcrumbs.value.push({ name: '根目录', path: '' });
          
          // 添加各级目录
          for (let i = 0; i < parts.length; i++) {
            if (!parts[i]) continue;
            
            currentPath += (currentPath ? '/' : '') + parts[i];
            pickerBreadcrumbs.value.push({
              name: parts[i],
              path: currentPath
            });
          }
        } else {
          // 只有根目录
          pickerBreadcrumbs.value.push({ name: '根目录', path: '' });
        }
        
        // 调试输出
        console.log('目录选择器文件列表:', pickerFiles.value);
        console.log('目录数量:', pickerFiles.value.filter(f => f.isDirectory).length);
      } catch (error) {
        console.error('Failed to fetch directory for picker:', error);
        console.error('错误详情:', error.response || error);
        pickerFiles.value = [];
      } finally {
        pickerLoading.value = false;
      }
    };
    
    // 目录选择器导航
    const pickerNavigateTo = async (path) => {
      await fetchPickerDirectory(path);
      pickerCurrentPath.value = path;
    };
    
    // 目录选择器上级导航
    const pickerNavigateUp = async () => {
      if (!pickerCurrentPath.value) return;
      
      const parts = pickerCurrentPath.value.split('/').filter(Boolean);
      parts.pop();
      const parentPath = parts.join('/');
      
      await pickerNavigateTo(parentPath);
    };
    
    // 选择目录作为链接目标
    const selectLinkTargetDir = (path) => {
      linkTargetDir.value = path;
      showDirectoryPicker.value = false;
    };
    
    // 递归创建目录内所有文件的链接
    const createDirectoryLinks = async (sourceDir) => {
      try {
        showLinkProgress.value = true;
        linkProgress.value = 0;
        processedFiles.value = 0;
        totalFiles.value = 0;
        linkProcessCompleted.value = false;
        
        // 创建目标根目录
        const targetBasePath = linkTargetDir.value ? 
          `${linkTargetDir.value}/${linkName.value}` : 
          linkName.value;
        
        // 确保目标根目录存在
        await ensureDirectoryExists(targetBasePath);
        
        // 递归处理文件夹
        await processDirectoryRecursively(sourceDir.path, targetBasePath);
        
        // 刷新当前目录
        await fileStore.fetchDirectory(fileStore.currentPath);
        
        // 显示成功信息在进度面板中
        linkProcessCompleted.value = true;
      } catch (error) {
        console.error('Failed to create directory links:', error);
        alert(`创建链接失败: ${error.message}`);
        showLinkProgress.value = false;
      }
    };
    
    // 递归处理目录
    const processDirectoryRecursively = async (sourcePath, targetPath) => {
      try {
        // 获取目录内容
        const response = await axios.get('/api/files/list', {
          params: {
            path: sourcePath,
            showHidden: fileStore.showHiddenFiles
          }
        });
        
        const files = response.data || [];
        
        // 处理文件
        const regularFiles = files.filter(f => f.isFile);
        totalFiles.value += regularFiles.length;
        
        // 创建当前层级的链接
        for (const file of regularFiles) {
          currentProcessingFile.value = file.name;
          
          try {
            const sourceFilePath = `${sourcePath}/${file.name}`.replace(/\/\//g, '/');
            const targetFilePath = `${targetPath}/${file.name}`.replace(/\/\//g, '/');
            
            if (linkType.value === 'hard') {
              await axios.post('/api/links/hardlink', {
                source: sourceFilePath,
                target: targetFilePath
              });
            } else {
              await axios.post('/api/links/symlink', {
                source: sourceFilePath,
                target: targetFilePath
              });
            }
            
            // 更新进度
            processedFiles.value++;
            if (totalFiles.value > 0) {
              linkProgress.value = (processedFiles.value / totalFiles.value) * 100;
            }
          } catch (error) {
            console.error(`Failed to create link for file ${file.name}:`, error);
          }
        }
        
        // 递归处理子目录
        const directories = files.filter(f => f.isDirectory);
        for (const dir of directories) {
          const subSourcePath = `${sourcePath}/${dir.name}`.replace(/\/\//g, '/');
          const subTargetPath = `${targetPath}/${dir.name}`.replace(/\/\//g, '/');
          
          // 创建子目录
          await ensureDirectoryExists(subTargetPath);
          
          // 递归处理
          await processDirectoryRecursively(subSourcePath, subTargetPath);
        }
      } catch (error) {
        console.error(`Failed to process directory ${sourcePath}:`, error);
        throw error;
      }
    };
    
    // 确保目录存在
    const ensureDirectoryExists = async (dirPath) => {
      try {
        // 如果是绝对路径，提取目录名和父路径
        let parentPath = '';
        let dirName = dirPath;
        
        if (dirPath.includes('/')) {
          const parts = dirPath.split('/');
          dirName = parts.pop();
          parentPath = parts.join('/');
        }
        
        await axios.post('/api/files/directory', {
          path: parentPath,
          name: dirName
        });
      } catch (error) {
        // 如果目录已存在，忽略错误
        if (!error.response || error.response.status !== 409) {
          console.error('Error creating directory:', error);
        }
      }
    };
    
    // 关闭链接进度对话框
    const closeLinkProgress = () => {
      showLinkProgress.value = false;
      linkProcessCompleted.value = false;
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
      showHardLinkInfo,
      showDirectoryPicker,
      pickerCurrentPath,
      pickerFiles,
      pickerBreadcrumbs,
      pickerLoading,
      newFolderName,
      newName,
      linkType,
      linkName,
      linkSource,
      linkTargetDir,
      selectedFile,
      contextMenu,
      infoDialog,
      hardLinks,
      recursiveLink,
      showLinkProgress,
      linkProgress,
      processedFiles,
      totalFiles,
      currentProcessingFile,
      linkProcessCompleted,
      navigateTo,
      navigateUp,
      refreshDirectory,
      createFolder,
      uploadFiles,
      renameSelected,
      confirmRename,
      deleteSelected,
      openCreateLinkDialog,
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
      getFileType,
      navigateToHardLink,
      deleteHardLink,
      deleteAllHardLinks,
      openDirectoryPicker,
      pickerNavigateTo,
      pickerNavigateUp,
      selectLinkTargetDir,
      createDirectoryLinks,
      closeLinkProgress
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
  align-items: flex-start;
  z-index: 1001;
  padding-top: 10vh; /* 距离顶部的距离，约为视口高度的10% */
  overflow-y: auto; /* 允许整个遮罩可滚动 */
}

.dialog {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 400px;
  max-width: 90%;
  max-height: 80vh; /* 最大高度为视口高度的80% */
  display: flex;
  flex-direction: column;
  margin-bottom: 50px; /* 确保底部有足够空间 */
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
  align-items: center;
  margin-top: 5px;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-bottom: 0;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.dialog-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: #999;
}

.close-btn:hover {
  color: #666;
}

.dialog-content {
  flex: 1;
  overflow-y: auto; /* 内容可滚动 */
  max-height: calc(70vh - 100px); /* 动态计算内容区最大高度 */
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

.hardlink-list {
  margin-top: 10px;
}

.hardlink-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  margin-bottom: 6px;
  border-radius: 4px;
  background-color: #f5f9f7;
  transition: all 0.2s ease;
  border: 1px solid #e0e8e4;
}

.hardlink-item:hover {
  background-color: #e8f4ee;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.hardlink-path {
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hardlink-path .file-icon {
  color: #42b983;
  margin-right: 8px;
  font-size: 18px;
}

.hardlink-path .filename {
  font-weight: 500;
  color: #333;
  margin-right: 6px;
}

.hardlink-path .path-suffix {
  color: #666;
  font-size: 0.9em;
}

.delete-btn {
  background: none;
  border: none;
  color: #f56c6c;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  margin-left: 6px;
}

.delete-btn:hover {
  background-color: rgba(245, 108, 108, 0.15);
  opacity: 1;
}

.delete-all-container {
  margin-top: 15px;
  text-align: center;
}

.delete-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(245, 108, 108, 0.2);
}

.delete-all-btn:hover {
  background-color: #f78989;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
}

.no-links-message {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin: 10px 0;
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

.directory-selector {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.directory-selector input {
  flex: 1;
  cursor: default;
  background-color: #f9f9f9;
  height: 36px;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.directory-selector button {
  height: 36px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: #f5f7fa;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"] {
  height: 36px;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.directory-picker-dialog {
  width: 600px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  height: 450px;
}

.directory-browser {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 15px;
}

.directory-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff;
}

.directory-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.directory-item:hover {
  background-color: #f5f7fa;
}

.dir-name {
  margin-left: 8px;
}

.dialog-footer {
  margin-top: auto;
}

.current-path {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
  word-break: break-all;
  max-height: 40px;
  overflow-y: auto;
}

.empty-message {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.loading-message {
  padding: 20px;
  text-align: center;
  color: #666;
}

.debug-info {
  margin-top: 10px;
  font-size: 0.8em;
  color: #aaa;
}

.link-progress-dialog {
  max-width: 500px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin: 15px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  color: #666;
}

input[type="checkbox"] {
  margin-right: 8px;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  color: #42b983;
  text-align: center;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 15px;
  background-color: #e8f5f0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #42b983;
  font-weight: bold;
}

.success-message p {
  font-size: 16px;
  margin: 0;
}
</style> 