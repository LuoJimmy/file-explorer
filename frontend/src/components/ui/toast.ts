import { createVNode, render } from 'vue'
import ToastComponent from './Toast.vue'

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
  showClose?: boolean
}

let toastContainer: HTMLDivElement | null = null

const createContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.className = 'toast-container'
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

const showToast = (options: ToastOptions) => {
  const container = createContainer()
  const vnode = createVNode(ToastComponent, {
    ...options,
    onClose: () => {
      render(null, container)
    }
  })
  render(vnode, container)
}

const Toast = {
  success: (message: string, duration?: number) => {
    showToast({ type: 'success', message, duration })
  },
  error: (message: string, duration?: number) => {
    showToast({ type: 'error', message, duration })
  },
  warning: (message: string, duration?: number) => {
    showToast({ type: 'warning', message, duration })
  },
  info: (message: string, duration?: number) => {
    showToast({ type: 'info', message, duration })
  }
}

export default Toast 