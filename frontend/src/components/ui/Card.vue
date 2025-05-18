<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'bordered'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const cardClasses = computed(() => {
  const baseClasses = 'rounded-lg bg-card text-card-foreground shadow-sm'
  const variantClasses = props.variant === 'bordered' ? 'border' : ''
  return `${baseClasses} ${variantClasses}`
})
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
