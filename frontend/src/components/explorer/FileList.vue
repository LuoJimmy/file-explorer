<template>
  <div :class="['file-list', viewMode]">
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="files.length === 0" class="empty">
      文件夹为空
    </div>

    <template v-else>
      <!-- 列表头部 -->
      <div v-if="viewMode === 'list'" class="file-list-header">
        <span @click="$emit('sort', 'name')" class="column name">
          名称
          <span v-if="sortBy === 'name'" class="sort-indicator">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </span>
        <span @click="$emit('sort', 'size')" class="column size">
          大小
          <span v-if="sortBy === 'size'" class="sort-indicator">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </span>
        <span @click="$emit('sort', 'date')" class="column date">
          修改日期
          <span v-if="sortBy === 'date'" class="sort-indicator">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </span>
        <span class="column type">类型</span>
      </div>

      <!-- 文件项目 -->
      <div
        v-for="file in files"
        :key="file.name"
        :class="['file-item', {
          selected: isSelected(file),
          directory: file.isDirectory,
          file: file.isFile,
          symlink: file.isSymbolicLink
        }]"
        @click="$emit('select', file, $event.ctrlKey || $event.metaKey)"
        @dblclick="$emit('action', 'open', file)"
        @contextmenu.prevent="$emit('context-menu', $event, file)"
      >
        <!-- 列表视图 -->
        <template v-if="viewMode === 'list'">
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
</template>

<script>
export default {
  name: 'FileList',
  props: {
    files: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    viewMode: {
      type: String,
      default: 'list'
    },
    sortBy: {
      type: String,
      default: 'name'
    },
    sortOrder: {
      type: String,
      default: 'asc'
    },
    selectedFiles: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select', 'action', 'context-menu', 'sort'],
  methods: {
    isSelected(file) {
      return this.selectedFiles.some(f => f.name === file.name);
    },
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
    },
    getFileIcon(file) {
      if (file.isDirectory) return '📁';
      if (file.isSymbolicLink) return '🔗';

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
    },
    getFileType(file) {
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
    }
  }
}
</script>

<style scoped>
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
