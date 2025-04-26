<template>
  <div class="settings">
    <h2>设置</h2>
    
    <div class="settings-section">
      <h3>显示选项</h3>
      
      <div class="setting-item">
        <div class="setting-label">视图模式</div>
        <div class="setting-control">
          <select v-model="viewMode" @change="updateViewMode">
            <option value="list">列表视图</option>
            <option value="grid">网格视图</option>
          </select>
        </div>
      </div>
      
      <div class="setting-item">
        <div class="setting-label">显示隐藏文件</div>
        <div class="setting-control">
          <label class="toggle">
            <input type="checkbox" v-model="showHiddenFiles" @change="updateHiddenFiles">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div class="setting-item">
        <div class="setting-label">排序方式</div>
        <div class="setting-control">
          <select v-model="sortBy" @change="updateSortOptions">
            <option value="name">按名称</option>
            <option value="size">按大小</option>
            <option value="date">按日期</option>
            <option value="type">按类型</option>
          </select>
        </div>
      </div>
      
      <div class="setting-item">
        <div class="setting-label">排序顺序</div>
        <div class="setting-control">
          <select v-model="sortOrder" @change="updateSortOptions">
            <option value="asc">升序</option>
            <option value="desc">降序</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>系统信息</h3>
      
      <div v-if="systemInfo" class="system-info">
        <div class="info-item">
          <div class="info-label">基础路径:</div>
          <div class="info-value">{{ systemInfo.basePath }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">平台:</div>
          <div class="info-value">{{ systemInfo.platform }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">运行时间:</div>
          <div class="info-value">{{ formatUptime(systemInfo.uptime) }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">内存使用:</div>
          <div class="info-value">{{ formatMemoryUsage(systemInfo.memoryUsage) }}</div>
        </div>
      </div>
      
      <div v-else-if="loading" class="loading">
        加载中...
      </div>
      
      <div v-else class="error">
        无法获取系统信息
      </div>
      
      <button @click="refreshSystemInfo" class="refresh-button">
        刷新系统信息
      </button>
    </div>
    
    <div class="settings-section">
      <h3>关于</h3>
      
      <div class="about-content">
        <p>Linux文件资源管理器是一个功能强大的文件管理工具，基于Docker容器技术，提供与Windows资源管理器相似的操作体验。</p>
        <p>特色功能包括:</p>
        <ul>
          <li>文件和目录的基本操作（创建、复制、剪切、粘贴、删除等）</li>
          <li>多视图模式（列表视图、网格视图）</li>
          <li>文件排序和过滤</li>
          <li>Linux特有的硬链接和软链接管理</li>
        </ul>
        <p>版本: 0.1.0</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useFileStore } from '../store/fileStore';
import axios from 'axios';

export default {
  name: 'Settings',
  setup() {
    const fileStore = useFileStore();
    
    // 设置状态
    const viewMode = ref(fileStore.viewMode);
    const showHiddenFiles = ref(fileStore.showHiddenFiles);
    const sortBy = ref(fileStore.sortBy);
    const sortOrder = ref(fileStore.sortOrder);
    
    // 系统信息
    const systemInfo = ref(null);
    const loading = ref(false);
    
    // 获取系统信息
    const getSystemInfo = async () => {
      try {
        loading.value = true;
        const response = await axios.get('/api/system');
        systemInfo.value = response.data;
      } catch (error) {
        console.error('Failed to get system info:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // 刷新系统信息
    const refreshSystemInfo = () => {
      getSystemInfo();
    };
    
    // 更新视图模式
    const updateViewMode = () => {
      fileStore.setViewMode(viewMode.value);
    };
    
    // 更新隐藏文件显示
    const updateHiddenFiles = () => {
      fileStore.toggleHiddenFiles();
      showHiddenFiles.value = fileStore.showHiddenFiles;
    };
    
    // 更新排序选项
    const updateSortOptions = () => {
      fileStore.setSortOptions(sortBy.value, sortOrder.value);
    };
    
    // 格式化运行时间
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      let result = '';
      if (days > 0) result += `${days}天 `;
      if (hours > 0) result += `${hours}小时 `;
      if (minutes > 0) result += `${minutes}分钟`;
      
      return result || '刚刚启动';
    };
    
    // 格式化内存使用
    const formatMemoryUsage = (memoryUsage) => {
      if (!memoryUsage) return 'N/A';
      
      const rss = formatBytes(memoryUsage.rss);
      const heapTotal = formatBytes(memoryUsage.heapTotal);
      const heapUsed = formatBytes(memoryUsage.heapUsed);
      
      return `RSS: ${rss} | 堆总计: ${heapTotal} | 堆使用: ${heapUsed}`;
    };
    
    // 格式化字节数
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // 组件挂载时获取系统信息
    onMounted(() => {
      getSystemInfo();
    });
    
    return {
      viewMode,
      showHiddenFiles,
      sortBy,
      sortOrder,
      systemInfo,
      loading,
      updateViewMode,
      updateHiddenFiles,
      updateSortOptions,
      refreshSystemInfo,
      formatUptime,
      formatMemoryUsage
    };
  }
};
</script>

<style scoped>
.settings {
  padding: 0 10px;
}

h2 {
  margin-bottom: 20px;
  color: var(--primary-color);
}

.settings-section {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--primary-color);
  font-size: 18px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: 500;
}

.setting-control {
  min-width: 150px;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: #fff;
}

/* 开关样式 */
.toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 30px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--secondary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

/* 系统信息样式 */
.system-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-label {
  width: 100px;
  font-weight: 500;
}

.info-value {
  flex: 1;
  word-break: break-all;
}

.refresh-button {
  padding: 8px 16px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-button:hover {
  background-color: #3aa876;
}

.loading, .error {
  padding: 10px 0;
  margin-bottom: 15px;
}

.error {
  color: #f56c6c;
}

/* 关于部分样式 */
.about-content {
  line-height: 1.6;
}

.about-content p {
  margin-bottom: 10px;
}

.about-content ul {
  margin-bottom: 10px;
  padding-left: 20px;
}

.about-content li {
  margin-bottom: 5px;
}
</style> 