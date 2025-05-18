<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { RiArrowRightSLine } from '@remixicon/vue'
import { MenuKey } from './menu'

interface MenuItem {
  label: string
  value: string | number
  icon?: any
  disabled?: boolean
  children?: MenuItem[]
}

interface Props {
  items: MenuItem[]
  modelValue?: string | number
  mode?: 'vertical' | 'horizontal'
  collapse?: boolean
  theme?: 'light' | 'dark'
  defaultActive?: string
  uniqueOpened?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  modelValue: '',
  mode: 'vertical',
  collapse: false,
  theme: 'light',
  defaultActive: '',
  uniqueOpened: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'select', value: string | number): void
}>()

const expandedItems = ref<Set<string | number>>(new Set())

const activeValue = ref(props.modelValue)

const isExpanded = (item: MenuItem) => {
  return expandedItems.value.has(item.value)
}

const hasChildren = (item: MenuItem) => {
  return item.children && item.children.length > 0
}

const toggleExpand = (item: MenuItem) => {
  if (hasChildren(item)) {
    if (expandedItems.value.has(item.value)) {
      expandedItems.value.delete(item.value)
    } else {
      expandedItems.value.add(item.value)
    }
  }
}

const handleSelect = (value: string | number) => {
  activeValue.value = value
  emit('update:modelValue', value)
  emit('select', value)
}

const isActive = (item: MenuItem) => {
  return item.value === props.modelValue
}

const activeIndex = ref(props.defaultActive)
const openedMenus = ref<string[]>([])

const handleOpen = (index: string) => {
  const indexOf = openedMenus.value.indexOf(index)
  if (indexOf === -1) {
    if (props.uniqueOpened) {
      openedMenus.value = [index]
    } else {
      openedMenus.value.push(index)
    }
  } else {
    openedMenus.value.splice(indexOf, 1)
  }
}

provide(MenuKey, {
  activeValue,
  handleSelect,
  mode: props.mode,
  collapse: props.collapse,
  activeIndex,
  openedMenus,
  handleOpen
})

const menuClasses = computed(() => {
  return [
    'w-full',
    props.mode === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-1',
    props.collapse ? 'w-16' : '',
    props.theme === 'dark' ? 'text-white' : ''
  ]
})

defineOptions({
  name: 'MenuComponent'
})
</script>

<template>
  <div :class="menuClasses">
    <div v-for="item in items" :key="item.value" class="menu-item">
      <button
        class="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        :class="{ 'bg-accent text-accent-foreground': isActive(item) }"
        :disabled="item.disabled"
        @click="handleSelect(item.value)"
      >
        <span class="flex items-center gap-2">
          <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </span>
        <RiArrowRightSLine
          v-if="hasChildren(item)"
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-90': isExpanded(item) }"
          @click.stop="toggleExpand(item)"
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
        <div v-if="hasChildren(item) && isExpanded(item)" class="ml-4 mt-1">
          <button
            v-for="child in item.children"
            :key="child.value"
            class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            :class="{ 'bg-accent text-accent-foreground': isActive(child) }"
            :disabled="child.disabled"
            @click="handleSelect(child.value)"
          >
            <component :is="child.icon" v-if="child.icon" class="h-4 w-4" />
            <span>{{ child.label }}</span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
export const __code = `// ... existing code ...`
</script>

<style scoped>
.menu {
  margin: 0;
  padding: 0;
  list-style: none;
  border-right: 1px solid #e8e8e8;
}

.menu--horizontal {
  display: flex;
  border-right: none;
  border-bottom: 1px solid #e8e8e8;
}

.menu--vertical {
  display: block;
}

.menu--collapse {
  width: 64px;
}

.menu--collapse :deep(.menu-item) {
  padding: 0 20px;
}

.menu--collapse :deep(.menu-item-text) {
  display: none;
}

.menu--collapse :deep(.menu-submenu-title) {
  padding: 0 20px;
}

.menu--collapse :deep(.menu-submenu-title-text) {
  display: none;
}

.menu--collapse :deep(.menu-submenu-arrow) {
  display: none;
}
</style>
