<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog properties-dialog">
      <h3>文件属性</h3>
      <div v-if="file" class="properties-content">
        <div class="property-row">
          <div class="property-label">名称:</div>
          <div class="property-value">{{ file.name }}</div>
        </div>
        <div class="property-row">
          <div class="property-label">类型:</div>
          <div class="property-value">{{ fileType }}</div>
        </div>
        <div class="property-row">
          <div class="property-label">位置:</div>
          <div class="property-value">{{ currentPath || '/' }}</div>
        </div>
        <div class="property-row">
          <div class="property-label">大小:</div>
          <div class="property-value">{{ formatFileSize(file.size) }}</div>
        </div>
        <div class="property-row">
          <div class="property-label">创建时间:</div>
          <div class="property-value">{{ formatDate(file.createdTime) }}</div>
        </div>
        <div class="property-row">
          <div class="property-label">修改时间:</div>
          <div class="property-value">{{ formatDate(file.modifiedTime) }}</div>
        </div>
        <div class="property-row">
          <div class="property-label">权限:</div>
          <div class="property-value">
            {{ file.permissions.readable ? 'r' : '-' }}
            {{ file.permissions.writable ? 'w' : '-' }}
            {{ file.permissions.executable ? 'x' : '-' }}
          </div>
        </div>
      </div>
      <div class="dialog-buttons">
        <button @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropertiesDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object,
      default: null
    },
    currentPath: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileType() {
      if (!this.file) return '';

      if (this.file.isDirectory) return '文件夹';
      if (this.file.isSymbolicLink) return '符号链接';

      const ext = this.file.name.split('.').pop()?.toLowerCase();

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
    }
  },
  methods: {
    formatFileSize(size) {
      if (size === 0) return '0 B';

      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(1024));

      return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
    },
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleString();
    }
  },
  emits: ['close']
}
</script>

<style scoped>
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
  padding-top: 10vh;
}

.dialog {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 400px;
  max-width: 90%;
}

.properties-dialog {
  width: 500px;
}

.dialog h3 {
  margin-bottom: 15px;
  color: var(--primary-color);
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

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>
