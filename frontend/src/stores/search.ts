import { defineStore } from 'pinia'
import type { FileInfo } from '@/types'

export const useSearchStore = defineStore('search', {
  state: () => ({
    path: '/',
    keyword: '',
    options: {
      caseSensitive: false,
      includeHidden: false,
      searchContent: false
    },
    results: [] as FileInfo[],
    isSearching: false,
    progress: 0,
    currentFile: ''
  }),

  actions: {
    setPath(path: string) {
      this.path = path
    },

    setKeyword(keyword: string) {
      this.keyword = keyword
    },

    setOptions(options: {
      caseSensitive: boolean
      includeHidden: boolean
      searchContent: boolean
    }) {
      this.options = options
    },

    setResults(results: FileInfo[]) {
      this.results = results
    },

    setIsSearching(isSearching: boolean) {
      this.isSearching = isSearching
    },

    setProgress(progress: number) {
      this.progress = progress
    },

    setCurrentFile(file: string) {
      this.currentFile = file
    },

    clear() {
      this.path = '/'
      this.keyword = ''
      this.options = {
        caseSensitive: false,
        includeHidden: false,
        searchContent: false
      }
      this.results = []
      this.isSearching = false
      this.progress = 0
      this.currentFile = ''
    }
  }
})
