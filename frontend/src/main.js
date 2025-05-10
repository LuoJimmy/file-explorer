import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 导入样式
import './styles/globals.css'
import 'remixicon/fonts/remixicon.css'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia作为状态管理
app.use(createPinia())

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
