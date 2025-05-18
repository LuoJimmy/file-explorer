<template>
  <div class="flex items-center gap-2 px-4 py-2">
    <button
      class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
      @click="handleClick('/')"
    >
      <RiHomeLine class="h-4 w-4" />
      <span>首页</span>
    </button>

    <template v-for="(part, index) in pathParts" :key="part.path">
      <RiArrowRightLine class="h-4 w-4 text-muted" />
      <button
        v-if="index === pathParts.length - 1"
        class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
      >
        <RiFolderLine class="h-4 w-4" />
        <span>{{ part.name }}</span>
      </button>
      <button
        v-else
        class="flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-muted"
        @click="handleClick(part.path)"
      >
        <RiFolderLine class="h-4 w-4" />
        <span>{{ part.name }}</span>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  RiHomeLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiFolderLine
} from '@remixicon/vue'

const props = defineProps<{
  path: string
}>()

const emit = defineEmits<{
  (e: 'click', path: string): void
}>()

const pathParts = computed(() => {
  const parts = props.path.split('/').filter(Boolean)
  return parts.map((part, index) => ({
    name: part,
    path: '/' + parts.slice(0, index + 1).join('/')
  }))
})

const handleClick = (path: string) => {
  emit('click', path)
}
</script>

<style scoped>
.breadcrumbs {
  @apply flex items-center gap-1 overflow-x-auto p-2 border-b bg-background;
}

.breadcrumbs-button {
  @apply flex items-center gap-1 rounded-sm px-2 py-1 text-sm hover:bg-hover transition-colors;
}

.breadcrumbs-button i {
  @apply h-[var(--icon-size-toolbar)] w-[var(--icon-size-toolbar)] text-muted;
}

.breadcrumbs-separator {
  @apply h-4 w-4 text-muted;
}

.breadcrumbs-path {
  @apply flex items-center gap-1;
}
</style>
