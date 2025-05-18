import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    paths: [] as string[],
    index: -1
  }),

  getters: {
    canGoBack: (state) => state.index > 0,
    canGoForward: (state) => state.index < state.paths.length - 1,
    currentPath: (state) => state.paths[state.index] || '/'
  },

  actions: {
    push(path: string) {
      this.paths = this.paths.slice(0, this.index + 1)
      this.paths.push(path)
      this.index = this.paths.length - 1
    },

    goBack() {
      if (this.canGoBack) {
        this.index--
      }
    },

    goForward() {
      if (this.canGoForward) {
        this.index++
      }
    },

    clear() {
      this.paths = []
      this.index = -1
    }
  }
})
