<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">重命名文件</h2>
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

        <div class="space-y-2">
          <Label>新名称</Label>
          <Input
            v-model="newName"
            placeholder="输入新名称"
            @keyup.enter="handleRename"
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button
            variant="outline"
            @click="$emit('close')"
          >
            取消
          </Button>
          <Button
            @click="handleRename"
            :disabled="!newName"
          >
            重命名
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../../ui/Button.vue'
import Input from '../../ui/Input.vue'
import Label from '../../ui/Label.vue'


interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  isSymbolicLink: boolean
}

const props = defineProps<{
  show: boolean
  file: FileItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'rename', name: string): void
}>()

const newName = ref('')

const handleRename = () => {
  if (!newName.value) return

  emit('rename', newName.value)
  newName.value = ''
  emit('close')
}
</script>
