import { defineStore } from 'pinia'
import type { FileInfo } from '@/types'

export const useClipboardStore = defineStore('clipboard', {
  state: () => ({
    files: [] as FileInfo[],
    operation: 'copy' as 'copy' | 'cut'
  }),

  getters: {
    isEmpty: (state) => state.files.length === 0,
    isCopy: (state) => state.operation === 'copy',
    isCut: (state) => state.operation === 'cut'
  },

  actions: {
    copy(files: FileInfo[]) {
      this.files = files
      this.operation = 'copy'
    },

    cut(files: FileInfo[]) {
      this.files = files
      this.operation = 'cut'
    },

    clear() {
      this.files = []
      this.operation = 'copy'
    }
  }
})
