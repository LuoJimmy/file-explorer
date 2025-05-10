// 获取文件图标
export const getFileIcon = (file) => {
  if (file.isDirectory) return '📁';
  if (file.isSymbolicLink) return '🔗';

  // 根据文件扩展名返回不同图标
  const ext = file.name.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'txt':
    case 'md':
    case 'log':
      return '📄';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return '🖼️';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'ogg':
      return '🎵';
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
      return '🎬';
    case 'pdf':
      return '📕';
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case '7z':
      return '🗜️';
    case 'js':
    case 'py':
    case 'java':
    case 'c':
    case 'cpp':
    case 'php':
      return '💻';
    default:
      return '📄';
  }
};

// 获取文件类型描述
export const getFileType = (file) => {
  if (file.isDirectory) return '文件夹';
  if (file.isSymbolicLink) return '符号链接';

  const ext = file.name.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'txt': return '文本文件';
    case 'md': return 'Markdown 文件';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp': return '图片';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'ogg': return '音频文件';
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov': return '视频文件';
    case 'pdf': return 'PDF 文档';
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case '7z': return '压缩文件';
    case 'js': return 'JavaScript 文件';
    case 'py': return 'Python 文件';
    case 'java': return 'Java 文件';
    case 'c': return 'C 文件';
    case 'cpp': return 'C++ 文件';
    case 'php': return 'PHP 文件';
    default: return `${ext ? ext.toUpperCase() : '未知'} 文件`;
  }
};
