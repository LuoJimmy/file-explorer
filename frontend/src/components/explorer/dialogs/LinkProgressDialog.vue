<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog link-progress-dialog">
      <div class="dialog-header">
        <h3>创建链接</h3>
        <button class="close-btn" @click="$emit('close')" :disabled="!isComplete">×</button>
      </div>

      <div class="progress-content">
        <div class="progress-info">
          <div class="source-info">
            <span class="label">源文件/目录：</span>
            <span class="value">{{ sourcePath }}</span>
          </div>
          <div class="target-info">
            <span class="label">目标目录：</span>
            <span class="value">{{ targetPath }}</span>
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          <div class="progress-text">{{ progress }}%</div>
        </div>

        <div class="status-message" :class="{ 'error': error }">
          {{ statusMessage }}
        </div>

        <div v-if="error" class="error-details">
          {{ errorDetails }}
        </div>
      </div>

      <div class="dialog-footer">
        <div class="dialog-buttons">
          <button
            v-if="!isComplete"
            type="button"
            @click="$emit('cancel')"
            :disabled="!canCancel"
          >
            取消
          </button>
          <button
            v-if="isComplete"
            type="button"
            @click="$emit('close')"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkProgressDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sourcePath: {
      type: String,
      required: true
    },
    targetPath: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 0
    },
    statusMessage: {
      type: String,
      default: '准备中...'
    },
    error: {
      type: Boolean,
      default: false
    },
    errorDetails: {
      type: String,
      default: ''
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    canCancel: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'cancel']
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

.link-progress-dialog {
  width: 500px;
  max-width: 90%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.close-btn:hover:not(:disabled) {
  color: #666;
}

.close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-content {
  margin-bottom: 20px;
}

.progress-info {
  margin-bottom: 20px;
}

.source-info,
.target-info {
  margin-bottom: 10px;
  word-break: break-all;
}

.label {
  color: #666;
  margin-right: 5px;
}

.value {
  color: #333;
}

.progress-bar-container {
  position: relative;
  height: 20px;
  background-color: #f0f2f5;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.status-message {
  text-align: center;
  margin-bottom: 10px;
  color: #666;
}

.status-message.error {
  color: #ff4d4f;
}

.error-details {
  padding: 10px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 0.9em;
  white-space: pre-wrap;
  word-break: break-all;
}

.dialog-footer {
  margin-top: 20px;
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
  padding: 5px 15px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background-color: #f5f7fa;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
