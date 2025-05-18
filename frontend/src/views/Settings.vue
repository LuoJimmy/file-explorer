<template>
  <div class="container mx-auto max-w-4xl p-6">
    <div class="mb-6 flex items-center">
      <button class="mr-4" @click="goBack">
        <RiArrowLeftSLine class="h-5 w-5" />
      </button>
      <h1 class="text-2xl font-bold">设置</h1>
    </div>

    <div class="space-y-6">
      <!-- 主题设置 -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">主题</h2>
        <div class="flex space-x-4">
          <button
            class="flex items-center rounded-md px-4 py-2"
            :class="theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
            @click="theme = 'light'"
          >
            <RiSunLine class="mr-2 h-4 w-4" />
            <span>浅色</span>
          </button>
          <button
            class="flex items-center rounded-md px-4 py-2"
            :class="theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted'"
            @click="theme = 'dark'"
          >
            <RiMoonLine class="mr-2 h-4 w-4" />
            <span>深色</span>
          </button>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">系统信息</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <RiComputerLine class="h-5 w-5 text-muted-foreground" />
            <span class="ml-2">操作系统：macOS</span>
          </div>
          <div class="flex items-center">
            <RiCpuLine class="h-5 w-5 text-muted-foreground" />
            <span class="ml-2">处理器：Apple M1</span>
          </div>
          <div class="flex items-center">
            <RiHardDriveLine class="h-5 w-5 text-muted-foreground" />
            <span class="ml-2">内存：16GB</span>
          </div>
          <div class="flex items-center">
            <RiHardDrive2Line class="h-5 w-5 text-muted-foreground" />
            <span class="ml-2">存储：512GB SSD</span>
          </div>
        </div>
      </div>

      <!-- 存储位置 -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">存储位置</h2>
        <div class="flex items-center">
          <RiFolderLine class="h-5 w-5 text-muted-foreground" />
          <span class="ml-2">/Users/jimmyluo/Documents</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  RiArrowLeftSLine,
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
  RiCpuLine,
  RiHardDriveLine,
  RiHardDrive2Line,
  RiFolderLine
} from '@remixicon/vue'

const router = useRouter()
const theme = ref('light')

const goBack = () => {
  router.back()
}
</script>
