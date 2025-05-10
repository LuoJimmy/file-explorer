<template>
  <div
    v-if="show"
    ref="menuRef"
    class="context-menu"
    :style="menuStyle"
  >
    <div v-if="item" class="menu-items">
      <div class="menu-item" @click="$emit('action', item)">
        {{ item.isDirectory ? '打开' : '查看' }}
      </div>
      <div class="menu-item" @click="$emit('rename')">重命名</div>
      <div class="menu-item" @click="$emit('delete')">删除</div>
      <div class="menu-item" @click="$emit('copy')">复制</div>
      <div class="menu-item" @click="$emit('cut')">剪切</div>
      <div class="menu-item" @click="$emit('properties')">属性</div>
      <div class="menu-item" @click="$emit('create-link')">创建链接</div>
      <div v-if="item.isFile" class="menu-item" @click="$emit('find-hardlinks', item)">查找硬链接</div>
      <div v-if="item.isSymbolicLink" class="menu-item" @click="$emit('get-symlink-target')">查看链接目标</div>
    </div>
    <div v-else class="menu-items">
      <div class="menu-item" @click="$emit('refresh')">刷新</div>
      <div class="menu-item" @click="$emit('create-folder')">新建文件夹</div>
      <div class="menu-item" @click="$emit('upload')">上传文件</div>
      <div v-if="hasClipboard" class="menu-item" @click="$emit('paste')">粘贴</div>
      <div class="menu-item" @click="$emit('sort', 'name')">按名称排序</div>
      <div class="menu-item" @click="$emit('sort', 'date')">按日期排序</div>
      <div class="menu-item" @click="$emit('toggle-hidden')">
        {{ showHiddenFiles ? '隐藏' : '显示' }}隐藏文件
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: null
    },
    hasClipboard: {
      type: Boolean,
      default: false
    },
    showHiddenFiles: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'action',
    'rename',
    'delete',
    'copy',
    'cut',
    'properties',
    'create-link',
    'find-hardlinks',
    'get-symlink-target',
    'refresh',
    'create-folder',
    'upload',
    'paste',
    'sort',
    'toggle-hidden'
  ],
  data() {
    return {
      menuPosition: {
        top: 0,
        left: 0
      }
    }
  },
  computed: {
    menuStyle() {
      return {
        top: this.menuPosition.top + 'px',
        left: this.menuPosition.left + 'px'
      }
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.updateMenuPosition();
        });
      }
    }
  },
  methods: {
    updateMenuPosition() {
      if (!this.$refs.menuRef) return;

      const menu = this.$refs.menuRef;
      const rect = menu.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let finalTop = this.top;
      let finalLeft = this.left;

      // 检查底部边界
      if (finalTop + rect.height > viewportHeight) {
        finalTop = viewportHeight - rect.height - 10; // 添加10px的边距
      }

      // 检查右侧边界
      if (finalLeft + rect.width > viewportWidth) {
        finalLeft = viewportWidth - rect.width - 10; // 添加10px的边距
      }

      // 确保不会出现负值
      finalTop = Math.max(10, finalTop); // 顶部至少留出10px边距
      finalLeft = Math.max(10, finalLeft); // 左侧至少留出10px边距

      this.menuPosition = {
        top: finalTop,
        left: finalLeft
      };
    }
  }
}
</script>

<style scoped>
.context-menu {
  position: fixed;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 150px;
  max-height: 80vh; /* 限制最大高度为视口高度的80% */
  overflow-y: auto; /* 如果内容过多，显示滚动条 */
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap; /* 防止菜单项文字换行 */
}

.menu-item:hover {
  background-color: #f5f7fa;
}
</style>
