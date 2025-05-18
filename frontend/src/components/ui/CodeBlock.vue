<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui'
import {
  RiFileCopyLine,
  RiFileCopyFill,
  RiEyeLine,
  RiEyeOffLine
} from '@remixicon/vue'

const props = defineProps<{
  code: string
  language?: string
}>()

const isExpanded = ref(false)
const isCopied = ref(false)

const toggleCode = () => {
  isExpanded.value = !isExpanded.value
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<template>
  <div class="code-block">
    <div class="flex justify-end gap-1 mb-2">
      <Button
        variant="ghost"
        size="icon"
        @click="copyCode"
        class="text-muted-foreground hover:text-foreground"
        :class="{ 'text-green-500': isCopied }"
      >
        <component
          :is="isCopied ? RiFileCopyFill : RiFileCopyLine"
          class="h-4 w-4"
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        @click="toggleCode"
        class="text-muted-foreground hover:text-foreground"
      >
        <component
          :is="isExpanded ? RiEyeOffLine : RiEyeLine"
          class="h-4 w-4"
        />
      </Button>
    </div>
    <div
      v-show="isExpanded"
      class="relative rounded-lg bg-muted p-4 overflow-x-auto"
    >
      <pre><code :class="language">{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  @apply mt-4;
}

.code-block pre {
  @apply m-0 p-0;
}

.code-block code {
  @apply text-sm;
}
</style> 