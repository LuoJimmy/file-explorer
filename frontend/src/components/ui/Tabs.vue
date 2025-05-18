<script setup lang="ts">
import { ref, provide, computed, watch, onMounted } from 'vue'
import {
  RiCloseLine
} from '@remixicon/vue'
import { TabsKey, type TabItem } from './tabs'

interface Props {
  modelValue?: string | number
  items?: TabItem[]
  class?: string
  type?: 'line' | 'card'
  closable?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  items: () => [],
  class: '',
  type: 'line',
  closable: false,
  animated: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'close', value: string | number): void
}>()

const activeTab = ref(props.modelValue)

// 监听 props.modelValue 的变化
watch(() => props.modelValue, (newValue) => {
  console.log('Model value changed:', newValue)
  activeTab.value = newValue
})

// 监听 activeTab 的变化
watch(activeTab, (newValue) => {
  console.log('Active tab changed:', newValue)
  emit('update:modelValue', newValue)
}, { immediate: true })

const tabs = ref<TabItem[]>([])

// 监听 props.items 的变化
watch(() => props.items, (newItems) => {
  if (newItems.length > 0) {
    tabs.value = [...newItems]
  }
}, { immediate: true })

const registerTab = (tab: TabItem) => {
  console.log('Registering tab:', tab)
  // 检查是否已存在相同 value 的标签页
  const existingIndex = tabs.value.findIndex(t => t.value === tab.value)
  if (existingIndex === -1) {
    tabs.value.push(tab)
  } else {
    // 如果已存在，则更新该标签页
    tabs.value[existingIndex] = tab
  }
  console.log('Current tabs:', tabs.value)
  
  // 如果没有设置初始值，则使用第一个标签页的值
  if (!activeTab.value && tabs.value.length > 0) {
    activeTab.value = tabs.value[0].value
  }
}

const handleSelect = (item: TabItem) => {
  console.log('Selecting tab:', item)
  if (!item.disabled) {
    activeTab.value = item.value
  }
}

const handleClose = (item: TabItem, event: MouseEvent) => {
  event.stopPropagation()
  console.log('Closing tab:', item)
  // 从 tabs 数组中移除被关闭的标签
  const index = tabs.value.findIndex(t => t.value === item.value)
  if (index !== -1) {
    tabs.value.splice(index, 1)
    // 如果关闭的是当前激活的标签，则切换到第一个标签
    if (item.value === activeTab.value && tabs.value.length > 0) {
      activeTab.value = tabs.value[0].value
    }
  }
  emit('close', item.value)
}

const isActive = (item: TabItem) => {
  return item.value === activeTab.value
}

// 提供 tabs 上下文
provide(TabsKey, {
  activeTab,
  registerTab
})

onMounted(() => {
  console.log('Tabs mounted, current tabs:', tabs.value)
  console.log('Active tab:', activeTab.value)
  // 如果没有设置初始值，则使用第一个标签页的值
  if (!activeTab.value && tabs.value.length > 0) {
    activeTab.value = tabs.value[0].value
  }
})
</script>

<template>
  <div :class="props.class">
    <div class="flex w-full border-b">
      <button
        v-for="item in tabs"
        :key="item.value"
        class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        :class="[
          props.type === 'card' ? 'bg-white border border-b-0 rounded-t-md mr-1' : '',
          isActive(item) ? (props.type === 'card' ? 'border-primary text-foreground' : 'border-primary text-foreground') : (props.type === 'card' ? 'border-gray-200 text-muted-foreground' : 'border-transparent text-muted-foreground')
        ]"
        :disabled="item.disabled"
        @click="handleSelect(item)"
      >
        <component
          v-if="item.icon"
          :is="item.icon"
          class="h-4 w-4"
        />
        <span>{{ item.label }}</span>
        <button
          v-if="props.closable"
          class="ml-2 rounded-full p-1 hover:bg-accent hover:text-accent-foreground"
          @click.stop="(event) => handleClose(item, event)"
        >
          <RiCloseLine class="h-3 w-3" />
        </button>
      </button>
    </div>
    <div class="mt-4">
      <div v-if="props.animated" class="tab-content">
        <Transition
          name="tab-fade"
          mode="out-in"
        >
          <div :key="activeTab" class="tab-pane">
            <slot />
          </div>
        </Transition>
      </div>
      <div v-else class="tab-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  position: relative;
}

.tab-pane {
  position: absolute;
  width: 100%;
}

.tab-fade-enter-active, .tab-fade-leave-active {
  transition: all 0.3s ease;
}
.tab-fade-enter-from, .tab-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.tab-fade-enter-to, .tab-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style> 