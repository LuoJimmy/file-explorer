<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RiCloseLine } from '@remixicon/vue'

interface Props {
  modelValue: boolean
  title?: string
  description?: string
  showClose?: boolean
  width?: string
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
  animated?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  description: '',
  showClose: true,
  width: '500px',
  showFooter: true,
  confirmText: '确定',
  cancelText: '取消',
  animated: false,
  closeOnClickModal: false,
  closeOnPressEscape: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnPressEscape) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

defineOptions({
  name: 'DialogComponent'
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div
      class="fixed inset-0 bg-black/50"
      :class="{ 'cursor-pointer': closeOnClickModal }"
      @click="closeOnClickModal && handleClose"
    />
    <div
      class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
      :style="{ width }"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">{{ title }}</h2>
        <button v-if="showClose" class="rounded-sm p-1 hover:bg-muted" @click="handleClose">
          <RiCloseLine class="h-4 w-4" />
        </button>
      </div>

      <div class="mb-4">
        <p v-if="description" class="text-sm text-muted-foreground">
          {{ description }}
        </p>
        <slot />
      </div>

      <div v-if="showFooter" class="flex justify-end gap-2">
        <button
          class="rounded-sm border border-input bg-background px-4 py-2 text-sm hover:bg-muted"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button
          class="rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export const __code = `// ... existing code ...`
</script>
