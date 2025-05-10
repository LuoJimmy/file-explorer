import { ref } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export function useFileNavigation(fileStore, {
  pickerLoading,
  pickerCurrentPath,
  pickerFiles,
  pickerBreadcrumbs
}) {
  // 导航到指定路径
  const navigateTo = async (path) => {
    try {
      await fileStore.fetchDirectory(path);
      return true;
    } catch (error) {
      console.error('Failed to navigate:', error);
      return false;
    }
  };

  // 导航到上级目录
  const navigateUp = () => {
    if (!fileStore.currentPath) return false;

    const parts = fileStore.currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.join('/');

    return navigateTo(parentPath);
  };

  // 刷新当前目录
  const refreshDirectory = () => {
    return fileStore.fetchDirectory(fileStore.currentPath);
  };

  // 导航到硬链接
  const navigateToHardLink = async (path) => {
    try {
      await fileStore.fetchDirectory(path);
      return true;
    } catch (error) {
      console.error('Failed to navigate to hard link:', error);
      return false;
    }
  };

  // 目录选择器导航
  const pickerNavigateTo = async (path) => {
    try {
      pickerLoading.value = true;
      const response = await api.get('/files/list', {
        params: {
          path,
          showHidden: fileStore.showHiddenFiles
        }
      });

      pickerCurrentPath.value = path;
      pickerFiles.value = response.data || [];

      // 构建面包屑
      const parts = path.split('/').filter(Boolean);
      const breadcrumbs = [{
        name: '根目录',
        path: ''
      }];
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = index === 0 ? part : `${currentPath}/${part}`;
        breadcrumbs.push({
          name: part,
          path: currentPath
        });
      });

      pickerBreadcrumbs.value = breadcrumbs;
      return true;
    } catch (error) {
      console.error('Failed to navigate in picker:', error);
      return false;
    } finally {
      pickerLoading.value = false;
    }
  };

  // 目录选择器上级导航
  const pickerNavigateUp = () => {
    if (!pickerCurrentPath.value) return false;

    const parts = pickerCurrentPath.value.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.join('/');

    return pickerNavigateTo(parentPath);
  };

  return {
    navigateTo,
    navigateUp,
    refreshDirectory,
    navigateToHardLink,
    pickerNavigateTo,
    pickerNavigateUp
  };
}
