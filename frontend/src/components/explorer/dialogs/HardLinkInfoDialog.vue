<template>
  <div v-if="show" class="hardlink-dialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>硬链接信息</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="material-icons">close</i>
        </button>
      </div>

      <div class="dialog-body">
        <div class="source-info">
          <h4>源文件</h4>
          <div class="source-path">{{ sourcePath }}</div>
        </div>

        <div v-if="!hardLinks.length" class="no-links">
          没有找到其他硬链接
        </div>
        <div v-else class="hardlink-list">
          <div v-for="(link, index) in hardLinks" :key="index" class="hardlink-item">
            <a
              class="hardlink-path"
              href="#"
              @click.prevent="handleNavigate(link)"
              :title="link.path"
            >
              <i class="material-icons file-icon">insert_link</i>
              <span class="filename">{{ getFileName(link.path) }}</span>
              <span class="path-suffix">{{ getDirPath(link.path) ? '在 ' + getDirPath(link.path) : '(根目录)' }}</span>
            </a>

            <button class="delete-btn" @click="$emit('delete', link.path)" title="删除硬链接">
              <i class="material-icons">delete</i>
            </button>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="delete-all-btn" @click="$emit('delete-all')" v-if="hardLinks.length">
          删除所有硬链接
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HardLinkInfoDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sourcePath: {
      type: String,
      default: ''
    },
    hardLinks: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getFileName(path) {
      const parts = path.split('/');
      return parts[parts.length - 1];
    },
    getDirPath(path) {
      const parts = path.split('/');
      parts.pop(); // 移除文件名
      return parts.join('/');
    },
    handleNavigate(link) {
      const dirPath = this.getDirPath(link.path);
      const fileName = this.getFileName(link.path);

      // 关闭对话框
      this.$emit('close');

      // 导航到目录并选中文件
      this.$emit('navigate', {
        path: dirPath,
        targetFile: fileName
      });
    }
  },
  emits: ['close', 'navigate', 'delete', 'delete-all']
}
</script>

<style scoped>
.hardlink-dialog {
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

.dialog-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 500px;
  max-width: 90%;
  flex: 1;
  overflow-y: auto;
  max-height: calc(70vh - 100px);
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

.dialog-body {
  flex: 1;
  overflow-y: auto;
  max-height: calc(70vh - 100px);
}

.source-info {
  margin-bottom: 20px;
}

.source-info h4 {
  margin-bottom: 10px;
}

.source-path {
  font-size: 14px;
  color: #666;
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

.no-links {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin: 10px 0;
}
</style>
