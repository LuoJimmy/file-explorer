<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog">
      <h3>创建链接</h3>
      <form @submit.prevent="handleSubmit">
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
            :value="sourceName"
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
              v-model="localLinkTargetDir"
              placeholder="留空表示当前目录"
              readonly
            />
            <button type="button" @click="handleBrowseClick">浏览...</button>
          </div>
        </div>

        <div class="form-group" v-if="isDirectory">
          <label>
            <input type="checkbox" v-model="recursiveLink" />
            递归创建文件夹内所有文件的链接
          </label>
          <small>将保留文件夹结构</small>
        </div>

        <div class="dialog-buttons">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" :disabled="!linkName">创建</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateLinkDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sourceName: {
      type: String,
      default: ''
    },
    sourcePath: {
      type: String,
      default: ''
    },
    isDirectory: {
      type: Boolean,
      default: false
    },
    linkTargetDir: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      linkType: 'symbolic',
      linkName: '',
      recursiveLink: false,
      localLinkTargetDir: ''
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.linkName = this.sourceName;
        this.localLinkTargetDir = this.linkTargetDir;
        this.$nextTick(() => {
          if (this.$refs.linkNameInput) {
            this.$refs.linkNameInput.focus();
            this.$refs.linkNameInput.select();
          }
        });
      } else {
        this.localLinkTargetDir = '';
        this.$emit('update:linkTargetDir', '');
      }
    },
    linkTargetDir(newVal) {
      this.localLinkTargetDir = newVal;
    }
  },
  mounted() {
    console.log('CreateLinkDialog - Component mounted');
  },
  methods: {
    handleBrowseClick() {
      console.log('CreateLinkDialog - Browse button clicked');
      this.$emit('open-directory-picker');
    },
    handleSubmit() {
      console.log('CreateLinkDialog - handleSubmit called');
      console.log('CreateLinkDialog - linkType:', this.linkType);
      console.log('CreateLinkDialog - linkName:', this.linkName);
      console.log('CreateLinkDialog - linkTargetDir:', this.localLinkTargetDir);
      console.log('CreateLinkDialog - recursiveLink:', this.recursiveLink);
      console.log('CreateLinkDialog - sourceName:', this.sourceName);
      console.log('CreateLinkDialog - isDirectory:', this.isDirectory);

      if (!this.linkName) {
        console.log('CreateLinkDialog - linkName is empty, not emitting create event');
        return;
      }

      console.log('CreateLinkDialog - Emitting create event with params:', {
        linkType: this.linkType,
        linkName: this.linkName,
        linkTargetDir: this.localLinkTargetDir,
        recursiveLink: this.recursiveLink,
        sourcePath: this.sourcePath
      });

      this.$emit('create', {
        linkType: this.linkType,
        linkName: this.linkName,
        linkTargetDir: this.localLinkTargetDir,
        recursiveLink: this.recursiveLink,
        sourcePath: this.sourcePath
      });
    }
  },
  emits: ['create', 'close', 'open-directory-picker']
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

.dialog h3 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group small {
  display: block;
  color: #666;
  margin-top: 4px;
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

button[type="submit"] {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

button[type="submit"]:hover {
  background-color: var(--primary-color-dark);
}

button[type="submit"]:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

input[type="checkbox"] {
  margin-right: 8px;
}
</style>
