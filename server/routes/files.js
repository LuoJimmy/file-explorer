const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');

const BASE_PATH = process.env.BASE_PATH || '/mnt/explorer';

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(BASE_PATH, req.query.path || '');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// 获取目录内容
router.get('/list', async (req, res) => {
  try {
    const requestPath = req.query.path || '';
    const fullPath = path.join(BASE_PATH, requestPath);
    
    // 安全检查：确保路径在BASE_PATH内
    if (!fullPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查路径是否存在
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Path not found' });
    }
    
    // 读取目录内容
    const items = await fs.readdir(fullPath);
    const result = [];
    
    // 获取每个项目的详细信息
    for (const item of items) {
      try {
        const itemPath = path.join(fullPath, item);
        const stats = await fs.stat(itemPath);
        
        // 排除隐藏文件（可通过前端参数控制）
        if (req.query.showHidden !== 'true' && item.startsWith('.')) {
          continue;
        }
        
        // 构建文件/文件夹信息
        result.push({
          name: item,
          path: path.join(requestPath, item),
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          isSymbolicLink: stats.isSymbolicLink(),
          size: stats.size,
          modifiedTime: stats.mtime,
          createdTime: stats.birthtime,
          permissions: {
            readable: await fs.access(itemPath, fs.constants.R_OK).then(() => true).catch(() => false),
            writable: await fs.access(itemPath, fs.constants.W_OK).then(() => true).catch(() => false),
            executable: await fs.access(itemPath, fs.constants.X_OK).then(() => true).catch(() => false)
          }
        });
      } catch (itemError) {
        console.error(`Error reading item ${item}:`, itemError);
        // 继续处理其他文件
      }
    }
    
    // 根据类型和名称排序：文件夹优先
    result.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error listing directory:', error);
    res.status(500).json({ error: 'Failed to list directory' });
  }
});

// 获取文件内容
router.get('/content', async (req, res) => {
  try {
    const requestPath = req.query.path || '';
    const fullPath = path.join(BASE_PATH, requestPath);
    
    // 安全检查
    if (!fullPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查文件是否存在
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // 检查是否是文件
    const stats = await fs.stat(fullPath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Not a file' });
    }
    
    // 发送文件
    res.sendFile(fullPath);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// 创建目录
router.post('/directory', async (req, res) => {
  try {
    const { path: dirPath, name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Directory name is required' });
    }
    
    const fullPath = path.join(BASE_PATH, dirPath || '', name);
    
    // 安全检查
    if (!fullPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 创建目录
    await fs.ensureDir(fullPath);
    res.json({ success: true, path: fullPath.replace(BASE_PATH, '') });
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).json({ error: 'Failed to create directory' });
  }
});

// 上传文件
router.post('/upload', upload.array('files'), (req, res) => {
  try {
    res.json({ 
      success: true, 
      files: req.files.map(file => ({
        name: file.filename,
        path: path.join(req.query.path || '', file.filename).replace(/\\/g, '/'),
        size: file.size
      }))
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// 删除文件或目录
router.delete('/', async (req, res) => {
  try {
    const requestPath = req.query.path || '';
    const fullPath = path.join(BASE_PATH, requestPath);
    
    // 安全检查
    if (!fullPath.startsWith(BASE_PATH) || fullPath === BASE_PATH) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查文件是否存在
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Path not found' });
    }
    
    // 删除文件或目录
    await fs.remove(fullPath);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// 重命名文件或目录
router.put('/rename', async (req, res) => {
  try {
    const { path: itemPath, newName } = req.body;
    
    if (!itemPath || !newName) {
      return res.status(400).json({ error: 'Path and new name are required' });
    }
    
    const fullPath = path.join(BASE_PATH, itemPath);
    const dirName = path.dirname(fullPath);
    const newPath = path.join(dirName, newName);
    
    // 安全检查
    if (!fullPath.startsWith(BASE_PATH) || !newPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Source path not found' });
    }
    
    // 检查目标文件是否已存在
    if (await fs.pathExists(newPath)) {
      return res.status(409).json({ error: 'Destination already exists' });
    }
    
    // 重命名
    await fs.move(fullPath, newPath);
    res.json({ 
      success: true,
      newPath: newPath.replace(BASE_PATH, '').replace(/\\/g, '/')
    });
  } catch (error) {
    console.error('Error renaming item:', error);
    res.status(500).json({ error: 'Failed to rename item' });
  }
});

// 复制文件或目录
router.post('/copy', async (req, res) => {
  try {
    const { source, destination } = req.body;
    
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }
    
    const sourcePath = path.join(BASE_PATH, source);
    const destPath = path.join(BASE_PATH, destination);
    
    // 安全检查
    if (!sourcePath.startsWith(BASE_PATH) || !destPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(sourcePath)) {
      return res.status(404).json({ error: 'Source path not found' });
    }
    
    // 复制
    await fs.copy(sourcePath, destPath, { overwrite: false });
    res.json({ success: true });
  } catch (error) {
    console.error('Error copying item:', error);
    res.status(500).json({ error: 'Failed to copy item' });
  }
});

// 移动文件或目录
router.post('/move', async (req, res) => {
  try {
    const { source, destination } = req.body;
    
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }
    
    const sourcePath = path.join(BASE_PATH, source);
    const destPath = path.join(BASE_PATH, destination);
    
    // 安全检查
    if (!sourcePath.startsWith(BASE_PATH) || !destPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(sourcePath)) {
      return res.status(404).json({ error: 'Source path not found' });
    }
    
    // 移动
    await fs.move(sourcePath, destPath, { overwrite: false });
    res.json({ success: true });
  } catch (error) {
    console.error('Error moving item:', error);
    res.status(500).json({ error: 'Failed to move item' });
  }
});

// 获取文件/目录信息
router.get('/info', async (req, res) => {
  try {
    const requestPath = req.query.path || '';
    const fullPath = path.join(BASE_PATH, requestPath);
    
    // 安全检查
    if (!fullPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查路径是否存在
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Path not found' });
    }
    
    const stats = await fs.stat(fullPath);
    const info = {
      name: path.basename(fullPath),
      path: requestPath,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      isSymbolicLink: stats.isSymbolicLink(),
      size: stats.size,
      modifiedTime: stats.mtime,
      createdTime: stats.birthtime,
      permissions: {
        readable: await fs.access(fullPath, fs.constants.R_OK).then(() => true).catch(() => false),
        writable: await fs.access(fullPath, fs.constants.W_OK).then(() => true).catch(() => false),
        executable: await fs.access(fullPath, fs.constants.X_OK).then(() => true).catch(() => false)
      }
    };
    
    // 如果是目录，计算内容数量
    if (stats.isDirectory()) {
      try {
        const items = await fs.readdir(fullPath);
        info.itemCount = items.length;
      } catch (error) {
        info.itemCount = 0;
      }
    }
    
    res.json(info);
  } catch (error) {
    console.error('Error getting item info:', error);
    res.status(500).json({ error: 'Failed to get item info' });
  }
});

module.exports = router; 