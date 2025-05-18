<script setup lang="ts">
import { inject } from 'vue'
import { MenuKey } from './menu'

interface Props {
  name: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const menu = inject(MenuKey)

const isActive = () => {
  return menu?.activeValue.value === props.name
}

const handleClick = () => {
  if (!props.disabled && menu) {
    menu.handleSelect(props.name)
  }
}
</script>

<template>
  <button
    class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
    :class="{ 'bg-accent text-accent-foreground': isActive() }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="icon" />
    <slot />
  </button>
</template> 