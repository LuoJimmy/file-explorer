import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    showHiddenFiles: false,
    showFileExtensions: true,
    showFilePermissions: true,
    showFileOwner: true,
    showFileGroup: true,
    showFileSize: true,
    showFileModified: true,
    showFileCreated: true,
    showFileAccessed: true,
    defaultViewMode: 'list' as 'list' | 'grid',
    defaultSortBy: 'name' as 'name' | 'size' | 'type' | 'modified',
    defaultSortOrder: 'asc' as 'asc' | 'desc',
    defaultPath: '/',
    defaultSearchPath: '/',
    defaultSearchKeyword: '',
    defaultSearchOptions: {
      caseSensitive: false,
      includeHidden: false,
      searchContent: false
    }
  }),

  actions: {
    setShowHiddenFiles(value: boolean) {
      this.showHiddenFiles = value
    },

    setShowFileExtensions(value: boolean) {
      this.showFileExtensions = value
    },

    setShowFilePermissions(value: boolean) {
      this.showFilePermissions = value
    },

    setShowFileOwner(value: boolean) {
      this.showFileOwner = value
    },

    setShowFileGroup(value: boolean) {
      this.showFileGroup = value
    },

    setShowFileSize(value: boolean) {
      this.showFileSize = value
    },

    setShowFileModified(value: boolean) {
      this.showFileModified = value
    },

    setShowFileCreated(value: boolean) {
      this.showFileCreated = value
    },

    setShowFileAccessed(value: boolean) {
      this.showFileAccessed = value
    },

    setDefaultViewMode(mode: 'list' | 'grid') {
      this.defaultViewMode = mode
    },

    setDefaultSortBy(field: 'name' | 'size' | 'type' | 'modified') {
      this.defaultSortBy = field
    },

    setDefaultSortOrder(order: 'asc' | 'desc') {
      this.defaultSortOrder = order
    },

    setDefaultPath(path: string) {
      this.defaultPath = path
    },

    setDefaultSearchPath(path: string) {
      this.defaultSearchPath = path
    },

    setDefaultSearchKeyword(keyword: string) {
      this.defaultSearchKeyword = keyword
    },

    setDefaultSearchOptions(options: {
      caseSensitive: boolean
      includeHidden: boolean
      searchContent: boolean
    }) {
      this.defaultSearchOptions = options
    }
  }
})
