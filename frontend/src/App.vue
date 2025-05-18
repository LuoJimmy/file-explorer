<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toast } from '@/components/ui'
</script>

<template>
  <RouterView />
  <Toast />
</template>

<style>
:root {
  --background: #ffffff;
  --text: #333333;
  --text-secondary: #666666;
  --hover: #f5f5f5;
  --selected: #e3f2fd;
  --border: #e0e0e0;
  --primary: #2196f3;
  --error: #f44336;
  --success: #4caf50;
  --warning: #ff9800;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background);
  color: var(--text);
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
