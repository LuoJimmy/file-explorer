<script setup lang="ts">
import { computed } from 'vue'
import { useToast, type ToastType } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const topToasts = computed(() => toasts.value.filter(t => t.options.position === 'top'))
const bottomToasts = computed(() => toasts.value.filter(t => t.options.position === 'bottom'))

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'ri-checkbox-circle-line'
    case 'error':
      return 'ri-error-warning-line'
    case 'warning':
      return 'ri-alert-line'
    case 'loading':
      return 'ri-loader-4-line'
    default:
      return 'ri-information-line'
  }
}

const getTypeClass = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-success text-success-foreground'
    case 'error':
      return 'bg-destructive text-destructive-foreground'
    case 'warning':
      return 'bg-warning text-warning-foreground'
    case 'loading':
      return 'bg-primary text-primary-foreground'
    default:
      return 'bg-background text-foreground'
  }
}
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <!-- 顶部提示 -->
    <div class="fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in topToasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-md shadow-lg"
          :class="[getTypeClass(toast.type), toast.options.class]"
        >
          <i :class="[getIcon(toast.type), 'text-lg']" />
          <span>{{ toast.message }}</span>
          <button
            class="ml-2 hover:opacity-80"
            @click="removeToast(toast.id)"
          >
            <i class="ri-close-line" />
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- 底部提示 -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2">
      <TransitionGroup name="toast">
    <div
          v-for="toast in bottomToasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-md shadow-lg"
          :class="[getTypeClass(toast.type), toast.options.class]"
    >
          <i :class="[getIcon(toast.type), 'text-lg']" />
          <span>{{ toast.message }}</span>
      <button
            class="ml-2 hover:opacity-80"
            @click="removeToast(toast.id)"
      >
            <i class="ri-close-line" />
      </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
