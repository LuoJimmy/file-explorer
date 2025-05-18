<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="handleClose" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">解压文件</h2>
        <Button v-if="canClose" variant="ghost" size="icon" @click="handleClose">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>进度</Label>
          <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              class="h-full bg-primary transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <div class="text-sm text-muted-foreground">{{ progress }}%</div>
        </div>

        <div class="space-y-2">
          <Label>当前文件</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-file-line h-4 w-4 text-muted-foreground" />
              <span>{{ currentFile }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '../../ui/Button.vue'
import Label from '../../ui/Label.vue'

const props = defineProps<{
  show: boolean
  progress: number
  currentFile: string
  canClose: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  if (!props.canClose) return
  emit('close')
}
</script>
