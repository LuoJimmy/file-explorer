<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
    <div class="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">搜索文件</h2>
        <Button variant="ghost" size="icon" @click="$emit('close')">
          <i class="ri-close-line h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label>搜索路径</Label>
          <div class="flex gap-2">
            <Input v-model="searchPath" @keyup.enter="handleSearch" />
            <Button @click="handleBrowse">
              <i class="ri-folder-line h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <Label>关键词</Label>
          <Input v-model="keyword" @keyup.enter="handleSearch" />
        </div>

        <div class="space-y-2">
          <Label>选项</Label>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="caseSensitive"
                v-model="options.caseSensitive"
                class="h-4 w-4"
              />
              <label for="caseSensitive">区分大小写</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeHidden"
                v-model="options.includeHidden"
                class="h-4 w-4"
              />
              <label for="includeHidden">包含隐藏文件</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="searchContent"
                v-model="options.searchContent"
                class="h-4 w-4"
              />
              <label for="searchContent">搜索文件内容</label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="$emit('close')">取消</Button>
          <Button @click="handleSearch" :disabled="!searchPath || !keyword">搜索</Button>
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

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'search', params: {
    path: string
    keyword: string
    options: {
      caseSensitive: boolean
      includeHidden: boolean
      searchContent: boolean
    }
  }): void
  (e: 'browse'): void
}>()

const searchPath = ref('')
const keyword = ref('')
const options = ref({
  caseSensitive: false,
  includeHidden: false,
  searchContent: false
})

const handleSearch = () => {
  if (!searchPath.value || !keyword.value) return

  emit('search', {
    path: searchPath.value,
    keyword: keyword.value,
    options: options.value
  })
  searchPath.value = ''
  keyword.value = ''
  options.value = {
    caseSensitive: false,
    includeHidden: false,
    searchContent: false
  }
  emit('close')
}

const handleBrowse = () => {
  emit('browse')
}
</script>
