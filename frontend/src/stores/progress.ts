import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', {
  state: () => ({
    copy: {
      show: false,
      progress: 0,
      currentFile: ''
    },
    move: {
      show: false,
      progress: 0,
      currentFile: ''
    },
    delete: {
      show: false,
      progress: 0,
      currentFile: ''
    },
    compress: {
      show: false,
      progress: 0,
      currentFile: ''
    },
    extract: {
      show: false,
      progress: 0,
      currentFile: ''
    }
  }),

  actions: {
    setCopyProgress(progress: number, currentFile: string) {
      this.copy.progress = progress
      this.copy.currentFile = currentFile
    },

    showCopyProgress() {
      this.copy.show = true
    },

    hideCopyProgress() {
      this.copy.show = false
      this.copy.progress = 0
      this.copy.currentFile = ''
    },

    setMoveProgress(progress: number, currentFile: string) {
      this.move.progress = progress
      this.move.currentFile = currentFile
    },

    showMoveProgress() {
      this.move.show = true
    },

    hideMoveProgress() {
      this.move.show = false
      this.move.progress = 0
      this.move.currentFile = ''
    },

    setDeleteProgress(progress: number, currentFile: string) {
      this.delete.progress = progress
      this.delete.currentFile = currentFile
    },

    showDeleteProgress() {
      this.delete.show = true
    },

    hideDeleteProgress() {
      this.delete.show = false
      this.delete.progress = 0
      this.delete.currentFile = ''
    },

    setCompressProgress(progress: number, currentFile: string) {
      this.compress.progress = progress
      this.compress.currentFile = currentFile
    },

    showCompressProgress() {
      this.compress.show = true
    },

    hideCompressProgress() {
      this.compress.show = false
      this.compress.progress = 0
      this.compress.currentFile = ''
    },

    setExtractProgress(progress: number, currentFile: string) {
      this.extract.progress = progress
      this.extract.currentFile = currentFile
    },

    showExtractProgress() {
      this.extract.show = true
    },

    hideExtractProgress() {
      this.extract.show = false
      this.extract.progress = 0
      this.extract.currentFile = ''
    }
  }
})
