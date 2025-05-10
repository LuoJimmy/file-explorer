<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog directory-picker-dialog">
      <div class="dialog-header">
        <h3>选择目标目录</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="directory-browser">
        <div class="breadcrumbs">
          <span
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="breadcrumb-item"
            @click="$emit('navigate', crumb.path)"
          >
            {{ crumb.name }}
            <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
          </span>
        </div>

        <div class="directory-list">
          <div v-if="loading" class="loading-message">
            加载中...
          </div>

          <template v-else>
            <div
              v-for="file in files.filter(f => f.isDirectory)"
              :key="file.name"
              class="directory-item"
              @dblclick="$emit('navigate', currentPath ? `${currentPath}/${file.name}` : file.name)"
            >
              <span class="file-icon">📁</span>
              <span class="dir-name">{{ file.name }}</span>
            </div>

            <div v-if="files.filter(f => f.isDirectory).length === 0" class="empty-message">
              此目录中没有子目录
            </div>
          </template>
        </div>
      </div>

      <div class="dialog-footer">
        <div class="current-path">
          当前路径: {{ currentPath || '/' }}
        </div>
        <div class="dialog-buttons">
          <button type="button" @click="$emit('navigate-up')" :disabled="!currentPath">上级目录</button>
          <button type="button" @click="$emit('close')">取消</button>
          <button type="button" @click="$emit('select', currentPath)">选择此目录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DirectoryPickerDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentPath: {
      type: String,
      default: ''
    },
    files: {
      type: Array,
      default: () => []
    },
    breadcrumbs: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'navigate', 'navigate-up', 'select']
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

.directory-picker-dialog {
  width: 600px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  height: 450px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.dialog-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.2em;
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

.directory-browser {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 15px;
  background-color: #fff;
}

.breadcrumbs {
  background-color: #f0f2f5;
  padding: 10px 15px;
  border-radius: 4px 4px 0 0;
  white-space: nowrap;
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color);
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
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.current-path {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
  word-break: break-all;
  max-height: 40px;
  overflow-y: auto;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 4px;
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
</style>
