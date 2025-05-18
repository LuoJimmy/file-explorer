import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    type: 'success' as 'error' | 'warning' | 'success',
    message: '',
    timeout: 3000
  }),

  actions: {
    showToast(type: 'error' | 'warning' | 'success', message: string) {
      this.type = type
      this.message = message
      this.show = true

      setTimeout(() => {
        this.show = false
      }, this.timeout)
    },

    hideToast() {
      this.show = false
    }
  }
})
