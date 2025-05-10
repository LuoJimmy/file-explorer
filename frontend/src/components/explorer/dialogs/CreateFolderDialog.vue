<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog">
      <h3>新建文件夹</h3>
      <form @submit.prevent="$emit('create', folderName)">
        <input
          ref="folderNameInput"
          v-model="folderName"
          type="text"
          placeholder="文件夹名称"
          autofocus
        />
        <div class="dialog-buttons">
          <button type="button" @click="$emit('close')">取消</button>
          <button type="submit" :disabled="!folderName">创建</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateFolderDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      folderName: ''
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.folderName = '';
        this.$nextTick(() => {
          if (this.$refs.folderNameInput) {
            this.$refs.folderNameInput.focus();
          }
        });
      }
    }
  },
  emits: ['create', 'close']
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
</style>
