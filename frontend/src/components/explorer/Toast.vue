<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border bg-background p-4 shadow-lg"
    :class="{
      'border-destructive bg-destructive/10 text-destructive': type === 'error',
      'border-warning bg-warning/10 text-warning': type === 'warning',
      'border-success bg-success/10 text-success': type === 'success'
    }"
  >
    <component
      :is="type === 'error' ? RiErrorWarningLine : type === 'warning' ? RiAlertLine : RiCheckLine"
      class="h-4 w-4"
    />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { RiErrorWarningLine, RiAlertLine, RiCheckLine } from '@remixicon/vue'

defineProps<{
  show: boolean
  message: string
  type: 'error' | 'warning' | 'success'
}>()
</script>
