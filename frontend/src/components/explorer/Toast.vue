<template>
  <transition name="toast">
    <div v-if="show" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 2000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.toast.success {
  background-color: #67c23a;
}

.toast.error {
  background-color: #f56c6c;
}

.toast.info {
  background-color: #909399;
}

.toast.warning {
  background-color: #e6a23c;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
