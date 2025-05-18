<script setup lang="ts">
import { computed } from 'vue'

import { RiLoaderFill } from '@remixicon/vue'
import { RiAddLine } from '@remixicon/vue'
import { RiLoader4Line } from '@remixicon/vue'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  block?: boolean
  round?: boolean
  plain?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
  type: 'button',
  icon: '',
  block: false,
  round: false,
  plain: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const baseClasses =
  'inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    case 'outline':
      return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    case 'secondary':
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    case 'ghost':
      return 'hover:bg-accent hover:text-accent-foreground'
    case 'link':
      return 'text-primary underline-offset-4 hover:underline'
    default:
      return 'bg-primary text-primary-foreground hover:bg-primary/90'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3 text-xs'
    case 'lg':
      return 'h-11 px-8 text-base'
    case 'icon':
      return 'h-10 w-10'
    default:
      return 'h-10 px-4 py-2 text-sm'
  }
})

const buttonClasses = computed(() => {
  return `${baseClasses} ${variantClasses.value} ${sizeClasses.value}`
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClass = computed(() => {
  return [
    'button',
    `button--${props.variant}`,
    `button--${props.size}`,
    {
      'button--disabled': props.disabled,
      'button--loading': props.loading,
      'button--block': props.block,
      'button--icon': props.icon,
      'button--round': props.round,
      'button--plain': props.plain
    }
  ]
})

defineOptions({
  name: 'ButtonComponent'
})
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled || loading" @click="handleClick">
    <RiLoader4Line v-if="loading" class="button-loading-icon" />
    <RiAddLine
      v-if="icon === 'i-heroicons-plus'"
      :class="[size === 'icon' ? 'h-5 w-5' : 'mr-2 h-4 w-4']"
    />
    <i v-else-if="icon" :class="[icon, size === 'icon' ? 'h-5 w-5' : 'mr-2 h-4 w-4']" />
    <slot />
  </button>
</template>

<script lang="ts">
export const __code = `// ... existing code ...`
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.button--primary {
  background-color: #1890ff;
  color: white;
}

.button--primary:hover {
  background-color: #40a9ff;
}

.button--secondary {
  background-color: #f5f5f5;
  color: #333;
}

.button--secondary:hover {
  background-color: #e8e8e8;
}

.button--outline {
  background-color: transparent;
  border-color: #1890ff;
  color: #1890ff;
}

.button--outline:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.button--ghost {
  background-color: transparent;
  color: #1890ff;
}

.button--ghost:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.button--link {
  background-color: transparent;
  color: #1890ff;
  padding: 0;
}

.button--link:hover {
  text-decoration: underline;
}

.button--danger {
  background-color: #ff4d4f;
  color: white;
}

.button--danger:hover {
  background-color: #ff7875;
}

.button--sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.button--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--loading {
  cursor: wait;
}

.button--block {
  width: 100%;
}

.button--icon {
  padding: 0.5rem;
}

.button--round {
  border-radius: 9999px;
}

.button--plain {
  background-color: transparent;
}

.button--plain.button--primary {
  color: #1890ff;
}

.button--plain.button--primary:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.button--plain.button--secondary {
  color: #666;
}

.button--plain.button--secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.button--plain.button--danger {
  color: #ff4d4f;
}

.button--plain.button--danger:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

.button-loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
