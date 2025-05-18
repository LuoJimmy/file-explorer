import { defineStore } from 'pinia'
import type { FileInfo } from '@/types'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    showContextMenu: false,
    contextMenuPosition: { x: 0, y: 0 },
    selectedFile: null as FileInfo | null,
    showSearchDialog: false,
    showSettingsDialog: false,
    showPropertiesDialog: false,
    showCreateLinkDialog: false,
    showCompressDialog: false,
    showExtractDialog: false,
    showDeleteDialog: false,
    showRenameDialog: false,
    showCopyProgressDialog: false,
    showMoveProgressDialog: false,
    showDeleteProgressDialog: false,
    showCompressProgressDialog: false,
    showExtractProgressDialog: false
  }),

  actions: {
    showContextMenuAt(x: number, y: number, file: FileInfo) {
      this.contextMenuPosition = { x, y }
      this.selectedFile = file
      this.showContextMenu = true
    },

    hideContextMenu() {
      this.showContextMenu = false
    },

    showSearch() {
      this.showSearchDialog = true
    },

    hideSearch() {
      this.showSearchDialog = false
    },

    showSettings() {
      this.showSettingsDialog = true
    },

    hideSettings() {
      this.showSettingsDialog = false
    },

    showProperties(file: FileInfo) {
      this.selectedFile = file
      this.showPropertiesDialog = true
    },

    hideProperties() {
      this.showPropertiesDialog = false
    },

    showCreateLink(file: FileInfo) {
      this.selectedFile = file
      this.showCreateLinkDialog = true
    },

    hideCreateLink() {
      this.showCreateLinkDialog = false
    },

    showCompress(file: FileInfo) {
      this.selectedFile = file
      this.showCompressDialog = true
    },

    hideCompress() {
      this.showCompressDialog = false
    },

    showExtract(file: FileInfo) {
      this.selectedFile = file
      this.showExtractDialog = true
    },

    hideExtract() {
      this.showExtractDialog = false
    },

    showDelete(file: FileInfo) {
      this.selectedFile = file
      this.showDeleteDialog = true
    },

    hideDelete() {
      this.showDeleteDialog = false
    },

    showRename(file: FileInfo) {
      this.selectedFile = file
      this.showRenameDialog = true
    },

    hideRename() {
      this.showRenameDialog = false
    },

    showCopyProgress() {
      this.showCopyProgressDialog = true
    },

    hideCopyProgress() {
      this.showCopyProgressDialog = false
    },

    showMoveProgress() {
      this.showMoveProgressDialog = true
    },

    hideMoveProgress() {
      this.showMoveProgressDialog = false
    },

    showDeleteProgress() {
      this.showDeleteProgressDialog = true
    },

    hideDeleteProgress() {
      this.showDeleteProgressDialog = false
    },

    showCompressProgress() {
      this.showCompressProgressDialog = true
    },

    hideCompressProgress() {
      this.showCompressProgressDialog = false
    },

    showExtractProgress() {
      this.showExtractProgressDialog = true
    },

    hideExtractProgress() {
      this.showExtractProgressDialog = false
    }
  }
})
