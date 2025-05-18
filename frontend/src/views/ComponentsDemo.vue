<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 组件分组
const componentGroups = [
  {
    title: '基础组件',
    items: [
      { id: 'button', name: 'Button 按钮', path: '/components/button' },
      { id: 'input', name: 'Input 输入框', path: '/components/input' },
      { id: 'label', name: 'Label 标签', path: '/components/label' }
    ]
  },
  {
    title: '反馈组件',
    items: [
      { id: 'toast', name: 'Toast 提示', path: '/components/toast' },
      { id: 'dialog', name: 'Dialog 对话框', path: '/components/dialog' }
    ]
  },
  {
    title: '导航组件',
    items: [
      { id: 'tabs', name: 'Tabs 标签页', path: '/components/tabs' },
      { id: 'menu', name: 'Menu 菜单', path: '/components/menu' },
      { id: 'navigation', name: 'Navigation 导航', path: '/components/navigation' }
    ]
  },
  {
    title: '数据录入',
    items: [
      { id: 'upload', name: 'Upload 上传', path: '/components/upload' },
      { id: 'dropdown', name: 'Dropdown 下拉菜单', path: '/components/dropdown' }
    ]
  },
  {
    title: '展示组件',
    items: [
      { id: 'card', name: 'Card 卡片', path: '/components/card' },
      { id: 'tooltip', name: 'Tooltip 文字提示', path: '/components/tooltip' }
    ]
  }
]

const router = useRouter()
const route = useRoute()

// 当前激活的组件
const activeComponent = computed(() => {
  return route.path.split('/').pop() || ''
})

// 导航到指定组件
const navigateToComponent = (path: string) => {
  router.push(path)
}

// 获取面包屑导航
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((_, index) => {
    const fullPath = '/' + paths.slice(0, index + 1).join('/')
    const group = componentGroups.find((group) =>
      group.items.some((item) => item.path === fullPath)
    )
    const item = group?.items.find((item) => item.path === fullPath)
    return {
      path: fullPath,
      title: item?.name || '组件库'
    }
  })
})
</script>

<template>
  <div class="components-demo">
    <!-- 左侧菜单 -->
    <div
      class="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background p-4 overflow-y-auto"
    >
      <h2 class="text-lg font-semibold mb-4">组件导航</h2>
      <div class="space-y-6">
        <div v-for="group in componentGroups" :key="group.title" class="space-y-2">
          <h3 class="text-sm font-medium text-muted-foreground">{{ group.title }}</h3>
          <div class="space-y-1">
            <button
              v-for="item in group.items"
              :key="item.id"
              class="w-full text-left px-2 py-1 rounded-md text-sm transition-colors"
              :class="[
                activeComponent === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-hover'
              ]"
              @click="navigateToComponent(item.path)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="ml-64 min-h-screen bg-background">
      <!-- 面包屑导航 -->
      <div class="sticky top-0 z-10 bg-background border-b border-border">
        <div class="flex items-center space-x-2 p-6">
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
            <span v-if="index > 0" class="text-muted-foreground">/</span>
            <router-link
              :to="crumb.path"
              class="text-sm transition-colors hover:text-primary"
              :class="[
                index === breadcrumbs.length - 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              ]"
            >
              {{ crumb.title }}
            </router-link>
          </template>
        </div>
      </div>

      <!-- 组件内容 -->
      <div class="p-6 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.components-demo {
  @apply min-h-screen bg-background;
}
</style>
