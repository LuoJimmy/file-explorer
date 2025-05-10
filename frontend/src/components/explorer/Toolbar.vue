<template>
  <div class="toolbar">
    <div class="actions">
      <button @click="$emit('navigate-up')" title="返回上级目录">
        <span class="icon">↑</span>
      </button>
      <button @click="$emit('refresh')" title="刷新">
        <span class="icon">⟳</span>
      </button>
      <button @click="$emit('create-folder')" title="新建文件夹">
        <span class="icon">📁+</span>
      </button>
      <button @click="$emit('upload')" title="上传文件">
        <span class="icon">⬆️</span>
      </button>
    </div>

    <div class="file-actions">
      <div v-if="hasSelection" class="selection-actions">
        <button @click="$emit('rename')" title="重命名">重命名</button>
        <button @click="$emit('delete')" title="删除">删除</button>
        <button @click="$emit('copy')" title="复制">复制</button>
        <button @click="$emit('cut')" title="剪切">剪切</button>
        <button @click="$emit('create-link')" title="创建链接">创建链接</button>
      </div>

      <button
        v-if="hasClipboard"
        @click="$emit('paste')"
        title="粘贴"
      >
        粘贴
      </button>
    </div>

    <div class="view-controls">
      <button
        @click="$emit('view-mode-change', 'list')"
        :class="{ active: viewMode === 'list' }"
        title="列表视图"
      >
        <span class="icon">☰</span>
      </button>
      <button
        @click="$emit('view-mode-change', 'grid')"
        :class="{ active: viewMode === 'grid' }"
        title="图标视图"
      >
        <span class="icon">⊞</span>
      </button>
      <button
        @click="$emit('toggle-hidden')"
        :class="{ active: showHiddenFiles }"
        title="显示隐藏文件"
      >
        <span class="icon">👁️</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    hasSelection: {
      type: Boolean,
      default: false
    },
    hasClipboard: {
      type: Boolean,
      default: false
    },
    viewMode: {
      type: String,
      default: 'list'
    },
    showHiddenFiles: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'navigate-up',
    'refresh',
    'create-folder',
    'upload',
    'rename',
    'delete',
    'copy',
    'cut',
    'create-link',
    'paste',
    'view-mode-change',
    'toggle-hidden'
  ]
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.actions, .view-controls {
  display: flex;
  gap: 5px;
}

.file-actions {
  display: flex;
  gap: 5px;
  position: absolute;
  right: 150px;
  top: 8px;
}

.selection-actions {
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
  white-space: nowrap;
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
</style>
