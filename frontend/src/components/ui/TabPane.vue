<script setup lang="ts">
import { inject, onMounted, watch, computed } from 'vue'
import { TabsKey, type TabItem, type TabsContext } from './tabs'

interface Props {
  label: string
  name: string | number
  icon?: any
  disabled?: boolean
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  name: '',
  disabled: false,
  closable: false
})

const tabs = inject<TabsContext>(TabsKey)

const isActive = computed(() => {
  if (!tabs) return false
  return tabs.activeTab.value === props.name
})

// 监听 activeTab 的变化
watch(() => tabs?.activeTab.value, (newValue) => {
  console.log('TabPane activeTab changed:', {
    newValue,
    name: props.name,
    isActive: newValue === props.name
  })
}, { immediate: true })

onMounted(() => {
  if (tabs) {
    const tab = {
      label: props.label,
      value: props.name,
      icon: props.icon,
      disabled: props.disabled,
      closable: props.closable
    }
    console.log('Registering tab:', tab)
    tabs.registerTab(tab)
  } else {
    console.error('TabPane: No tabs context found')
  }
})

// 监听 props 的变化
watch(() => props, (newProps) => {
  if (tabs) {
    const tab = {
      label: newProps.label,
      value: newProps.name,
      icon: newProps.icon,
      disabled: newProps.disabled,
      closable: newProps.closable
    }
    console.log('Updating tab:', tab)
    tabs.registerTab(tab)
  }
}, { deep: true })
</script>

<template>
  <div v-if="isActive" class="tab-pane">
    <slot />
  </div>
</template> 