import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import routes from './router'
import lazyLoad from './directives/lazyLoad'
import './assets/main.css'
import {
  vXss,
  vSanitize,
  vExternalLink,
  vSafeImage,
  vNoCopy,
  vNoContextMenu
} from './directives/security'

// 创建应用实例
const app = createApp(App)

// 注册全局指令
app.directive('lazy', lazyLoad)
app.directive('xss', vXss)
app.directive('sanitize', vSanitize)
app.directive('external-link', vExternalLink)
app.directive('safe-image', vSafeImage)
app.directive('no-copy', vNoCopy)
app.directive('no-context-menu', vNoContextMenu)

// 注册 Pinia
app.use(createPinia())

// 注册路由
app.use(routes)

// 挂载应用
app.mount('#app')

// 添加全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
}

// 添加全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Vue Warning:', msg)
  console.warn('Warning Trace:', trace)
}
