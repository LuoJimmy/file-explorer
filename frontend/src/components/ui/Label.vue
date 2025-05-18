<template>
  <label :class="labelClasses">
    <slot />
    <span v-if="required" class="text-destructive ml-1">*</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive'
  size?: 'sm' | 'default' | 'lg'
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  required: false
})

const labelClasses = computed(() => {
  const baseClasses = 'font-medium'
  const variantClasses = {
    default: 'text-foreground',
    secondary: 'text-muted-foreground',
    destructive: 'text-destructive'
  }
  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  }
  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`
})
</script>
