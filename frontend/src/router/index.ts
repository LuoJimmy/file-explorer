import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import SecurityDemo from '../components/SecurityDemo.vue'
import componentRoutes from './components'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Explorer',
    component: () => import('@/views/Explorer.vue'),
    meta: {
      title: '文件浏览器',
      keepAlive: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '设置',
      keepAlive: true
    }
  },
  ...componentRoutes,
  {
    path: '/security-demo',
    name: 'SecurityDemo',
    component: SecurityDemo
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - 文件浏览器`
  next()
})

export default router
