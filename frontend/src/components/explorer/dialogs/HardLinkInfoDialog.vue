<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">硬链接信息</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>文件</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-file-line h-4 w-4 text-muted-foreground" />
              <span>{{ file.name }}</span>
            </div>
            <div class="mt-1 text-sm text-muted-foreground">{{ file.path }}</div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>硬链接数</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-link h-4 w-4 text-muted-foreground" />
              <span>{{ hardLinks }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>inode</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-hashtag h-4 w-4 text-muted-foreground" />
              <span>{{ inode }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>设备</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-hard-drive-line h-4 w-4 text-muted-foreground" />
              <span>{{ device }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <Button @click="$emit('close')">关闭</Button>
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
}

const props = withDefaults(defineProps<{
  show: boolean
  file: FileItem
  hardLinks?: number
  inode?: number
  device?: string
}>(), {
  hardLinks: 0,
  inode: 0,
  device: '未知'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
