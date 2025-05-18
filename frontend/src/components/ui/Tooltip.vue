<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  RiInformationLine
} from '@remixicon/vue'

interface Props {
  content: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  trigger?: 'hover' | 'click'
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  icon: false
})

const visible = ref(false)
let timer: number | null = null

const placementClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
  right: 'left-full top-1/2 -translate-y-1/2 translate-x-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
  left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2'
}

const handleMouseEnter = () => {
  if (props.trigger === 'hover') {
    if (timer) {
      clearTimeout(timer)
    }
    visible.value = true
  }
}

const handleMouseLeave = () => {
  if (props.trigger === 'hover') {
    timer = window.setTimeout(() => {
      visible.value = false
    }, 100)
  }
}

const handleClick = () => {
  if (props.trigger === 'click') {
    visible.value = !visible.value
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.tooltip')) {
    visible.value = false
  }
}

onMounted(() => {
  if (props.trigger === 'click') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
  if (props.trigger === 'click') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div
    class="tooltip relative inline-block"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <slot>
      <RiInformationLine
        v-if="icon"
        class="h-4 w-4 text-muted-foreground"
      />
    </slot>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="visible"
        class="absolute z-50 rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground shadow-md"
        :class="placementClasses[placement]"
      >
        {{ content }}
      </div>
    </Transition>
  </div>
</template> 