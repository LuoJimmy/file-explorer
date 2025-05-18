<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">选择目录</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <!-- 面包屑导航 -->
        <div class="flex items-center gap-1 overflow-x-auto">
          <button
            v-for="(crumb, index) in breadcrumbs"
            :key="crumb.path"
            class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
            @click="handleNavigate(crumb.path)"
          >
            <i
              :class="[
                index === 0 ? 'ri-home-line' : 'ri-folder-line',
                'h-4 w-4 text-muted-foreground'
              ]"
            />
            <span>{{ crumb.name }}</span>
            <i
              v-if="index < breadcrumbs.length - 1"
              class="ri-arrow-right-s-line h-4 w-4 text-muted-foreground"
            />
          </button>
        </div>

        <div class="space-y-2">
          <Label>当前路径</Label>
          <div class="flex gap-2">
            <Input :value="localPath" @input="handleInput" @keyup.enter="handlePathChange" />
            <Button @click="handlePathChange">
              <i class="ri-arrow-right-line h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="h-64 overflow-y-auto rounded-md border">
          <div v-if="loading" class="flex h-full items-center justify-center">
            <i class="ri-loader-4-line h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div
            v-else
            v-for="file in files"
            :key="file.path"
            class="flex cursor-pointer items-center gap-2 p-2 hover:bg-muted"
            @click="handleItemClick(file)"
          >
            <i
              :class="[
                file.isDirectory ? 'ri-folder-line' : 'ri-file-line',
                'h-4 w-4 text-muted-foreground'
              ]"
            />
            <span>{{ file.name }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="$emit('close')">取消</Button>
          <Button @click="handleSelect">选择</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '../../ui/Button.vue'
import Input from '../../ui/Input.vue'
import Label from '../../ui/Label.vue'

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
}

interface Breadcrumb {
  name: string
  path: string
}

const props = defineProps<{
  show: boolean
  currentPath: string
  files: FileItem[]
  breadcrumbs: Breadcrumb[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', path: string): void
  (e: 'navigate', path: string): void
  (e: 'navigate-up'): void
}>()

const localPath = ref(props.currentPath)

// 监听 currentPath prop 的变化
watch(() => props.currentPath, (newPath) => {
  localPath.value = newPath
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  localPath.value = target.value
}

const handlePathChange = () => {
  emit('navigate', localPath.value)
}

const handleItemClick = (file: FileItem) => {
  if (file.isDirectory) {
    emit('navigate', file.path)
  }
}

const handleNavigate = (path: string) => {
  emit('navigate', path)
}

const handleSelect = () => {
  emit('select', localPath.value)
  emit('close')
}
</script>
