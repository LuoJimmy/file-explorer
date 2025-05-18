<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">创建链接</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>源文件</Label>
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
          <Label>链接类型</Label>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <input
                type="radio"
                id="symbolic"
                value="symbolic"
                v-model="linkType"
                class="h-4 w-4"
              />
              <label for="symbolic">符号链接</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="radio"
                id="hard"
                value="hard"
                v-model="linkType"
                class="h-4 w-4"
              />
              <label for="hard">硬链接</label>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>目标路径</Label>
          <div class="flex gap-2">
            <Input v-model="targetPath" @keyup.enter="handleCreate" />
            <Button @click="handleBrowse">
              <i class="ri-folder-line h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="$emit('close')">取消</Button>
          <Button @click="handleCreate" :disabled="!targetPath">创建</Button>
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

defineProps<{
  show: boolean
  file: FileItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', type: 'symbolic' | 'hard', targetPath: string): void
  (e: 'browse'): void
}>()

const linkType = ref<'symbolic' | 'hard'>('symbolic')
const targetPath = ref('')

const handleCreate = () => {
  if (!targetPath.value) return

  emit('create', linkType.value, targetPath.value)
  targetPath.value = ''
  emit('close')
}

const handleBrowse = () => {
  emit('browse')
}
</script>
