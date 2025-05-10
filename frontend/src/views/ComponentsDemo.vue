<script setup>
import { ref } from 'vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Card from '../components/ui/Card.vue'
import Navigation from '../components/ui/Navigation.vue'

const navItems = [
  { label: '首页', to: '/', icon: 'ri-home-line' },
  { label: '文件', to: '/files', icon: 'ri-folder-line' },
  { label: '设置', to: '/settings', icon: 'ri-settings-line' }
]

const inputValue = ref('')
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">组件展示</h1>

    <!-- 按钮展示 -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">按钮组件</h2>
      <div class="flex flex-wrap gap-4">
        <Button>默认按钮</Button>
        <Button variant="destructive">危险按钮</Button>
        <Button variant="outline">轮廓按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
        <Button variant="link">链接按钮</Button>
      </div>
    </section>

    <!-- 输入框展示 -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">输入框组件</h2>
      <div class="max-w-md space-y-4">
        <Input v-model="inputValue" placeholder="请输入内容" />
        <Input type="password" placeholder="请输入密码" />
        <Input disabled placeholder="禁用状态" />
        <Input error placeholder="错误状态" />
      </div>
    </section>

    <!-- 卡片展示 -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">卡片组件</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">默认卡片</h3>
            <p class="text-muted-foreground">这是一个默认样式的卡片组件示例。</p>
          </div>
        </Card>
        <Card variant="bordered">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">带边框卡片</h3>
            <p class="text-muted-foreground">这是一个带边框样式的卡片组件示例。</p>
          </div>
        </Card>
      </div>
    </section>

    <!-- 导航展示 -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">导航组件</h2>
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-2">水平导航</h3>
          <Navigation :items="navItems" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-2">垂直导航</h3>
          <Navigation :items="navItems" orientation="vertical" />
        </div>
      </div>
    </section>
  </div>
</template>
