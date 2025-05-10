import { ref } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export function useFileOperations(fileStore) {
  // 创建文件夹
  const createFolder = async (folderName) => {
    if (!folderName) return;

    try {
      await fileStore.createDirectory(folderName);
      return true;
    } catch (error) {
      console.error('Failed to create folder:', error);
      return false;
    }
  };

  // 上传文件
  const uploadFiles = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('path', fileStore.currentPath);

    try {
      await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fileStore.fetchDirectory(fileStore.currentPath);
      event.target.value = '';
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  // 删除文件/文件夹
  const deleteSelected = async () => {
    try {
      await fileStore.deleteItems();
      await fileStore.fetchDirectory(fileStore.currentPath);
      return true;
    } catch (error) {
      console.error('Failed to delete items:', error);
      return false;
    }
  };

  // 创建链接
  const createLink = async (params) => {
    console.log('useFileOperations - createLink called with params:', params);
    console.log('useFileOperations - fileStore.selectedFiles:', fileStore.selectedFiles);

    if (!params.linkName) {
      console.log('useFileOperations - Missing linkName');
      return {
        success: false,
        message: '请输入链接名称'
      };
    }

    try {
      // 获取源文件路径
      const sourcePath = params.sourcePath;
      if (!sourcePath) {
        console.log('useFileOperations - Missing sourcePath');
        return {
          success: false,
          message: '缺少源文件路径'
        };
      }

      const targetPath = params.linkTargetDir
        ? `${params.linkTargetDir}/${params.linkName}`
        : `${fileStore.currentPath}/${params.linkName}`;

      console.log('useFileOperations - Creating link:', {
        type: params.linkType,
        source: sourcePath,
        target: targetPath
      });

      if (params.linkType === 'hard') {
        await fileStore.createHardLink({ path: sourcePath }, targetPath);
      } else {
        await fileStore.createSymLink({ path: sourcePath }, targetPath);
      }

      // 刷新当前目录
      await fileStore.fetchDirectory(fileStore.currentPath);

      // 返回成功状态和消息
      return {
        success: true,
        message: '链接创建成功'
      };
    } catch (error) {
      console.error('Failed to create link:', error);
      return {
        success: false,
        message: `创建链接失败: ${error.message}`
      };
    }
  };

  // 打开文件
  const openFile = async (file) => {
    try {
      // 获取文件扩展名
      const ext = file.name.split('.').pop().toLowerCase();

      // 根据文件类型直接打开
      const fileType = {
        // 文本文件
        text: ['txt', 'md', 'json', 'js', 'css', 'html', 'xml', 'yaml', 'yml', 'ini', 'conf', 'log'],
        // 图片文件
        image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
        // PDF文件
        pdf: ['pdf']
      };

      // 构建文件URL
      const fileUrl = `/api/files/content?path=${encodeURIComponent(file.path)}`;

      // 根据文件类型处理
      if (fileType.text.includes(ext) || fileType.image.includes(ext) || fileType.pdf.includes(ext)) {
        // 文本、图片、PDF文件：在新标签页中打开
        window.open(fileUrl, '_blank');
      } else {
        // 其他文件：下载
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to open file:', error);
      throw error;
    }
  };

  return {
    createFolder,
    uploadFiles,
    deleteSelected,
    createLink,
    openFile
  };
}
