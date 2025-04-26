<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">
        <img src="./assets/logo.svg" alt="Linux 文件资源管理器" />
        <h1>Linux 文件资源管理器</h1>
      </div>
      <nav class="main-nav">
        <router-link to="/" class="nav-item">文件浏览</router-link>
        <router-link to="/settings" class="nav-item">设置</router-link>
      </nav>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <p>Linux 文件资源管理器 &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #42b983;
  --bg-color: #f5f7fa;
  --text-color: #333;
  --border-color: #dcdfe6;
  --header-height: 60px;
  --footer-height: 40px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--primary-color);
  color: white;
  padding: 0 20px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 36px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 18px;
  font-weight: 600;
}

.main-nav {
  display: flex;
}

.nav-item {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 0 15px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  background-color: var(--primary-color);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 10px;
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .logo {
    margin-bottom: 10px;
  }
  
  .main-content {
    padding: 10px;
  }
}
</style> 