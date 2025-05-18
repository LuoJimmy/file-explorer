<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  RiArrowDownSLine
} from '@remixicon/vue'

interface DropdownItem {
  label: string
  value: string | number
  icon?: any
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  items: DropdownItem[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  items: () => [],
  placeholder: '请选择',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isOpen = ref(false)

const selectedItem = computed(() => {
  return props.items.find((item) => item.value === props.modelValue)
})

const dropdownClasses = computed(() => {
  const baseClasses = 'relative inline-flex w-full items-center justify-between rounded-sm border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorClasses = props.error ? 'border-destructive' : 'border-input'
  return `${baseClasses} ${errorClasses}`
})

const handleSelect = (item: DropdownItem) => {
  if (!item.disabled) {
    emit('update:modelValue', item.value)
    isOpen.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="dropdown relative">
    <button
      :class="dropdownClasses"
      :disabled="disabled"
      @click="isOpen = !isOpen"
    >
      <span class="flex items-center gap-2">
        <component
          v-if="selectedItem?.icon"
          :is="selectedItem.icon"
          class="h-4 w-4"
        />
        <span>{{ selectedItem?.label || placeholder }}</span>
      </span>
      <RiArrowDownSLine
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
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
        v-if="isOpen"
        class="absolute left-0 top-full z-50 mt-1 w-full rounded-sm border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <div class="max-h-[300px] overflow-auto">
          <button
            v-for="item in items"
            :key="item.value"
            class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            :disabled="item.disabled"
            @click="handleSelect(item)"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              class="h-4 w-4"
            />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template> 