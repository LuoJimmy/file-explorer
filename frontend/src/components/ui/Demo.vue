<script setup lang="ts">
import { type Component, h } from 'vue'
import { Card, CodeBlock } from '@/components/ui'

interface Props {
  title: string
  description?: string
  code: string | Component
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  language: 'vue'
})

// 从组件中提取代码字符串
const getCodeString = () => {
  if (typeof props.code === 'string') {
    return props.code
  }
  
  // 如果是组件，尝试从组件的 __code 属性中获取代码
  const component = props.code as any
  if (component.__code) {
    return component.__code
  }
  
  // 如果是 JSX 组件，尝试渲染并获取代码
  if (typeof component === 'function') {
    try {
      // 渲染组件
      const vnode = h(component)
      // 将组件转换为字符串
      const code = vnode.type?.toString() || ''
      return code
    } catch (error) {
      console.error('Failed to extract code from JSX component:', error)
      return ''
    }
  }
  
  // 如果无法获取代码，返回空字符串
  return ''
}
</script>

<template>
  <section class="demo-section">
    <div class="mb-4">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <p v-if="description" class="text-muted-foreground mt-1">{{ description }}</p>
    </div>

    <Card class="mb-4">
      <div class="demo-content">
        <slot />
      </div>
    </Card>

    <CodeBlock :code="getCodeString()" :language="language" />
  </section>
</template>

<style scoped>
.demo-section {
  @apply mb-8;
}

.demo-content {
  @apply min-h-[100px] p-4;
}
</style> 