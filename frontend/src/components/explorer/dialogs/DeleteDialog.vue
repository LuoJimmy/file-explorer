<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">删除文件</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>文件</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i
                :class="[
                  file.isDirectory
                    ? 'ri-folder-line'
                    : file.isSymbolicLink
                    ? 'ri-link'
                    : 'ri-file-line',
                  'h-4 w-4 text-muted-foreground'
                ]"
              />
              <span>{{ file.name }}</span>
            </div>
            <div class="mt-1 text-sm text-muted-foreground">{{ file.path }}</div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button
            variant="outline"
            @click="$emit('close')"
          >
            取消
          </Button>
          <Button
            variant="destructive"
            @click="handleDelete"
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '../../ui/Button.vue'
import Label from '../../ui/Label.vue'

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  isSymbolicLink: boolean
}

defineProps<{
  show: boolean
  file: FileItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete'): void
}>()

const handleDelete = () => {
  emit('delete')
  emit('close')
}
</script>
