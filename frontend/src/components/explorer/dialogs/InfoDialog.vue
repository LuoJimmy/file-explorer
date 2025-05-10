<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog">
      <h3>{{ title }}</h3>
      <div class="info-content" v-html="message"></div>
      <div class="dialog-buttons">
        <button v-if="showConfirm" @click="$emit('close')">取消</button>
        <button v-if="showConfirm" @click="$emit('confirm')" class="confirm-btn">{{ confirmText }}</button>
        <button v-else @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      default: ''
    },
    showConfirm: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  emits: ['close', 'confirm']
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

.info-content {
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.5;
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

.confirm-btn {
  background-color: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.confirm-btn:hover {
  background-color: #f78989;
  border-color: #f78989;
  color: white;
}
</style>
