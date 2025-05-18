<template>
  <div class="flex h-full flex-col items-center justify-center">
    <h1 class="text-4xl font-bold">404</h1>
    <p class="mt-4 text-lg">页面未找到</p>
    <router-link to="/" class="mt-8 flex items-center text-primary hover:underline">
      <RiHomeLine class="h-4 w-4" />
      <span class="ml-2">返回首页</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { RiHomeLine } from '@remixicon/vue'
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--header-height) - var(--footer-height) - 40px);
}

.content {
  text-align: center;
  padding: 20px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 20px;
}

h1 {
  font-size: 32px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

p {
  color: #666;
  font-size: 18px;
  margin-bottom: 30px;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--secondary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #3aa876;
}
</style>
