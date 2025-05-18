import { ref } from 'vue'

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'loading'

export interface ToastOptions {
  duration?: number
  position?: 'top' | 'bottom'
  icon?: string
  class?: string
}

export interface ToastItem {
  id: number
  type: ToastType
  message: string
  options: ToastOptions
}

const toasts = ref<ToastItem[]>([])
let toastId = 0

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top',
}

const createToast = (message: string, type: ToastType = 'default', options: ToastOptions = {}) => {
  const id = toastId++
  const toast: ToastItem = {
    id,
    type,
    message,
    options: { ...defaultOptions, ...options },
  }

  toasts.value.push(toast)

  if (toast.options.duration && toast.options.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.options.duration)
  }

  return id
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

export const useToast = () => {
  const toast = (message: string, options?: ToastOptions) => {
    return createToast(message, 'default', options)
  }

  toast.success = (message: string, options?: ToastOptions) => {
    return createToast(message, 'success', options)
  }

  toast.error = (message: string, options?: ToastOptions) => {
    return createToast(message, 'error', options)
  }

  toast.warning = (message: string, options?: ToastOptions) => {
    return createToast(message, 'warning', options)
  }

  toast.loading = (message: string, options?: ToastOptions) => {
    return createToast(message, 'loading', options)
  }

  return {
    toasts,
    toast,
    removeToast,
  }
} 