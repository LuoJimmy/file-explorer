<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-white p-6 shadow-lg dark:bg-gray-900">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">新建文件夹</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>文件夹名称</Label>
          <Input
            v-model="folderName"
            placeholder="输入文件夹名称"
            @keyup.enter="handleCreate"
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
            @click="handleCreate"
            :disabled="!folderName"
          >
            创建
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

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', name: string): void
}>()

const folderName = ref('')

const handleCreate = () => {
  if (!folderName.value) return

  emit('create', folderName.value)
  folderName.value = ''
  emit('close')
}
</script>
