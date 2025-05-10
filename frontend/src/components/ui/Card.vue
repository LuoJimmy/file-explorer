<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered'].includes(value)
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm'
  return `${baseClasses} ${props.variant === 'bordered' ? 'border-border' : ''}`
})
</script>

<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>
