<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">搜索结果</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>搜索路径</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-folder-line h-4 w-4 text-muted-foreground" />
              <span>{{ path }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>关键词</Label>
          <div class="rounded-md border bg-muted p-2">
            <div class="flex items-center gap-2">
              <i class="ri-search-line h-4 w-4 text-muted-foreground" />
              <span>{{ keyword }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>结果 ({{ results.length }})</Label>
          <div class="h-64 overflow-y-auto rounded-md border">
            <div
              v-for="result in results"
              :key="result.path"
              class="flex cursor-pointer items-center gap-2 border-b p-2 last:border-0 hover:bg-muted"
              @click="handleSelect(result)"
            >
              <i
                :class="[
                  result.isDirectory
                    ? 'ri-folder-line'
                    : result.isSymbolicLink
                    ? 'ri-link'
                    : 'ri-file-line',
                  'h-4 w-4 text-muted-foreground'
                ]"
              />
              <span>{{ result.name }}</span>
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

defineProps<{
  show: boolean
  path: string
  keyword: string
  results: FileItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', file: FileItem): void
}>()

const handleSelect = (file: FileItem) => {
  emit('select', file)
  emit('close')
}
</script>
