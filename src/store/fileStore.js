import { defineStore } from 'pinia'
import axios from 'axios'

export const useFileStore = defineStore('file', {
  state: () => ({
    currentPath: '',
    files: [],
    selectedFiles: [],
    loading: false,
    error: null,
    clipboard: {
      items: [],
      action: '' // 'copy' 或 'cut'
    },
    viewMode: 'list', // 'list', 'grid', 'details'
    showHiddenFiles: false,
    sortBy: 'type', // 'name', 'size', 'date', 'type'
    sortOrder: 'asc' // 'asc', 'desc'
  }),
  
  getters: {
    // 获取当前目录
    currentDirectory: (state) => {
      return state.currentPath || '/';
    },
    
    // 计算出当前路径的面包屑
    breadcrumbs: (state) => {
      if (!state.currentPath) return [{ name: '根目录', path: '' }];
      
      const parts = state.currentPath.split('/').filter(Boolean);
      const breadcrumbs = [{ name: '根目录', path: '' }];
      
      let currentPath = '';
      parts.forEach(part => {
        currentPath += '/' + part;
        breadcrumbs.push({
          name: part,
          path: currentPath.slice(1) // 移除开头的斜杠
        });
      });
      
      return breadcrumbs;
    },
    
    // 排序后的文件列表
    sortedFiles: (state) => {
      const sorted = [...state.files];
      
      sorted.sort((a, b) => {
        // 文件和目录分开排序
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        
        // 根据选定的排序字段排序
        switch (state.sortBy) {
          case 'name':
            return state.sortOrder === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          case 'size':
            return state.sortOrder === 'asc' 
              ? a.size - b.size
              : b.size - a.size;
          case 'date':
            return state.sortOrder === 'asc' 
              ? new Date(a.modifiedTime) - new Date(b.modifiedTime)
              : new Date(b.modifiedTime) - new Date(a.modifiedTime);
          case 'type':
            // 同为目录或同为文件，按名称排序
            if (a.isDirectory === b.isDirectory) {
              return state.sortOrder === 'asc' 
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            }
            // 前面已经处理了目录和文件的优先级
            return 0;
          default:
            return 0;
        }
      });
      
      return sorted;
    },
    
    // 是否有选择的文件
    hasSelection: (state) => state.selectedFiles.length > 0,
    
    // 剪贴板是否有内容
    hasClipboard: (state) => state.clipboard.items.length > 0
  },
  
  actions: {
    // 获取目录内容
    async fetchDirectory(path = '') {
      try {
        this.loading = true;
        this.error = null;
        this.selectedFiles = [];
        
        const response = await axios.get('/api/files/list', {
          params: {
            path,
            showHidden: this.showHiddenFiles
          }
        });
        
        this.files = response.data;
        this.currentPath = path;
        this.loading = false;
      } catch (error) {
        this.error = error.response?.data?.error || '获取目录内容失败';
        this.loading = false;
        throw error;
      }
    },
    
    // 创建新文件夹
    async createDirectory(name) {
      try {
        const response = await axios.post('/api/files/directory', {
          path: this.currentPath,
          name
        });
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || '创建文件夹失败';
        throw error;
      }
    },
    
    // 上传文件
    async uploadFiles(files) {
      try {
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        
        const response = await axios.post(`/api/files/upload?path=${this.currentPath}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || '上传文件失败';
        throw error;
      }
    },
    
    // 删除文件或目录
    async deleteItems(items = null) {
      const filesToDelete = items || this.selectedFiles;
      
      if (!filesToDelete.length) return;
      
      try {
        for (const item of filesToDelete) {
          await axios.delete('/api/files', {
            params: {
              path: `${this.currentPath}/${item.name}`.replace(/\/\//g, '/')
            }
          });
        }
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
      } catch (error) {
        this.error = error.response?.data?.error || '删除项目失败';
        throw error;
      }
    },
    
    // 重命名文件或目录
    async renameItem(item, newName) {
      try {
        const currentItemPath = `${this.currentPath}/${item.name}`.replace(/\/\//g, '/');
        
        const response = await axios.put('/api/files/rename', {
          path: currentItemPath,
          newName
        });
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || '重命名失败';
        throw error;
      }
    },
    
    // 复制文件到剪贴板
    copyToClipboard(items = null) {
      const itemsToCopy = items || this.selectedFiles;
      if (!itemsToCopy.length) return;
      
      this.clipboard = {
        items: [...itemsToCopy],
        action: 'copy'
      };
    },
    
    // 剪切文件到剪贴板
    cutToClipboard(items = null) {
      const itemsToCut = items || this.selectedFiles;
      if (!itemsToCut.length) return;
      
      this.clipboard = {
        items: [...itemsToCut],
        action: 'cut'
      };
    },
    
    // 粘贴文件
    async pasteFromClipboard() {
      if (!this.clipboard.items.length) return;
      
      try {
        for (const item of this.clipboard.items) {
          const sourceItemPath = `${item.path}`;
          const destinationPath = `${this.currentPath}/${item.name}`.replace(/\/\//g, '/');
          
          if (this.clipboard.action === 'copy') {
            await axios.post('/api/files/copy', {
              source: sourceItemPath,
              destination: destinationPath
            });
          } else if (this.clipboard.action === 'cut') {
            await axios.post('/api/files/move', {
              source: sourceItemPath,
              destination: destinationPath
            });
          }
        }
        
        // 如果是剪切操作，清空剪贴板
        if (this.clipboard.action === 'cut') {
          this.clipboard = { items: [], action: '' };
        }
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
      } catch (error) {
        this.error = error.response?.data?.error || '粘贴操作失败';
        throw error;
      }
    },
    
    // 创建硬链接
    async createHardLink(source, targetName) {
      try {
        const sourcePath = source.path;
        const targetPath = `${this.currentPath}/${targetName}`.replace(/\/\//g, '/');
        
        const response = await axios.post('/api/links/hardlink', {
          source: sourcePath,
          target: targetPath
        });
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || '创建硬链接失败';
        throw error;
      }
    },
    
    // 创建软链接
    async createSymLink(source, targetName) {
      try {
        const sourcePath = source.path;
        const targetPath = `${this.currentPath}/${targetName}`.replace(/\/\//g, '/');
        
        const response = await axios.post('/api/links/symlink', {
          source: sourcePath,
          target: targetPath
        });
        
        // 刷新当前目录
        await this.fetchDirectory(this.currentPath);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || '创建符号链接失败';
        throw error;
      }
    },
    
    // 选择文件
    selectFile(file, multiSelect = false) {
      if (!multiSelect) {
        this.selectedFiles = [file];
        return;
      }
      
      const index = this.selectedFiles.findIndex(f => f.name === file.name);
      
      if (index === -1) {
        this.selectedFiles.push(file);
      } else {
        this.selectedFiles.splice(index, 1);
      }
    },
    
    // 清除选择
    clearSelection() {
      this.selectedFiles = [];
    },
    
    // 更改视图模式
    setViewMode(mode) {
      this.viewMode = mode;
    },
    
    // 切换显示隐藏文件
    toggleHiddenFiles() {
      this.showHiddenFiles = !this.showHiddenFiles;
      this.fetchDirectory(this.currentPath);
    },
    
    // 设置排序方式
    setSortOptions(by, order = null) {
      if (this.sortBy === by && order === null) {
        // 切换排序顺序
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = by;
        if (order) this.sortOrder = order;
      }
    }
  }
}); 