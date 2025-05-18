<script setup lang="ts">
import { ref, inject } from 'vue'
import { MenuKey } from './menu'
import { RiArrowRightSLine } from '@remixicon/vue'

interface Props {
  name: string | number
  title: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const menu = inject(MenuKey)
const isExpanded = ref(false)

const toggleExpand = () => {
  if (!props.disabled) {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<template>
  <div class="menu-item">
    <button
      class="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      :disabled="disabled"
      @click="toggleExpand"
    >
      <span class="flex items-center gap-2">
        <slot name="icon" />
        <span>{{ title }}</span>
      </span>
      <RiArrowRightSLine
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-90': isExpanded }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isExpanded"
        class="ml-4 mt-1"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template> 