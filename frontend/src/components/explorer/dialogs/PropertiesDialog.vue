<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">文件属性</h2>
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
          <Label>大小</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-hard-drive-line h-4 w-4 text-muted-foreground" />
              <span>{{ size }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>类型</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-file-type-line h-4 w-4 text-muted-foreground" />
              <span>{{ type }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>权限</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-lock-line h-4 w-4 text-muted-foreground" />
              <span>{{ permissions }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>所有者</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-user-line h-4 w-4 text-muted-foreground" />
              <span>{{ owner }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>组</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-group-line h-4 w-4 text-muted-foreground" />
              <span>{{ group }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>创建时间</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-time-line h-4 w-4 text-muted-foreground" />
              <span>{{ createdAt }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>修改时间</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-time-line h-4 w-4 text-muted-foreground" />
              <span>{{ modifiedAt }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>访问时间</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-time-line h-4 w-4 text-muted-foreground" />
              <span>{{ accessedAt }}</span>
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
  isDirectory: boolean
  isSymbolicLink: boolean
}

const props = withDefaults(defineProps<{
  show: boolean
  file: FileItem
  size?: string
  type?: string
  permissions?: string
  owner?: string
  group?: string
  createdAt?: string
  modifiedAt?: string
  accessedAt?: string
}>(), {
  size: '0 B',
  type: '未知',
  permissions: '未知',
  owner: '未知',
  group: '未知',
  createdAt: '未知',
  modifiedAt: '未知',
  accessedAt: '未知'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
