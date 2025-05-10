<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const navClasses = computed(() => {
  const baseClasses = 'flex items-center space-x-4'
  return `${baseClasses} ${props.orientation === 'vertical' ? 'flex-col space-x-0 space-y-4' : ''}`
})

const itemClasses = computed(() => {
  return 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
})
</script>

<template>
  <nav :class="navClasses">
    <template v-for="(item, index) in items" :key="index">
      <router-link
        v-if="item.to"
        :to="item.to"
        :class="itemClasses"
      >
        <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
        {{ item.label }}
      </router-link>
      <a
        v-else-if="item.href"
        :href="item.href"
        :class="itemClasses"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
        {{ item.label }}
      </a>
    </template>
  </nav>
</template>
