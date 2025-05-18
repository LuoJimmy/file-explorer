<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface NavItem {
  label: string
  to: string
  icon: any
}

const props = defineProps<{
  items: NavItem[]
  orientation?: 'horizontal' | 'vertical'
}>()

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}

const containerClass = computed(() => {
  return props.orientation === 'vertical'
    ? 'flex flex-col gap-1'
    : 'flex items-center gap-1'
})
</script>

<template>
  <nav :class="containerClass">
    <router-link
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
      :class="{ 'bg-muted': isActive(item.to) }"
    >
      <component :is="item.icon" class="h-4 w-4" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>
