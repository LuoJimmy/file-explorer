import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false
  }),

  actions: {
    toggle() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark')
    },

    setDark() {
      this.isDark = true
      document.documentElement.classList.add('dark')
    },

    setLight() {
      this.isDark = false
      document.documentElement.classList.remove('dark')
    }
  }
})
