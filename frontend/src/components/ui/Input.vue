<script setup lang="ts">
import { computed, ref } from 'vue'
import { RiEyeLine, RiEyeOffLine, RiSearchLine, RiCloseLine } from '@remixicon/vue'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  searchable?: boolean
  clearable?: boolean
  password?: boolean
  size?: 'sm' | 'default' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  errorMessage: '',
  searchable: false,
  clearable: false,
  password: false,
  size: 'default'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'clear'): void
  (e: 'search'): void
}>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.password) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 text-xs px-2'
    case 'lg':
      return 'h-12 text-base px-4'
    default:
      return 'h-10 text-sm px-3'
  }
})

const inputClasses = computed(() => {
  const baseClasses =
    'flex w-full rounded-sm border bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorClasses = props.error ? 'border-destructive' : 'border-input'
  return `${baseClasses} ${errorClasses} ${sizeClasses.value}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative">
    <div v-if="searchable" class="absolute left-3 top-1/2 -translate-y-1/2">
      <RiSearchLine class="h-4 w-4 text-muted-foreground" />
    </div>
    <input
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[inputClasses, searchable && 'pl-9', (clearable || password) && 'pr-9']"
      @input="handleInput"
    />
    <div
      v-if="clearable && modelValue"
      class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      @click="handleClear"
    >
      <RiCloseLine class="h-4 w-4 text-muted-foreground" />
    </div>
    <div
      v-if="password"
      class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      @click="togglePassword"
    >
      <component
        :is="showPassword ? RiEyeOffLine : RiEyeLine"
        class="h-4 w-4 text-muted-foreground"
      />
    </div>
    <p v-if="error && errorMessage" class="text-destructive text-sm mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
