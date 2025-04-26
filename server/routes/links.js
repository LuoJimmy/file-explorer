const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const BASE_PATH = process.env.BASE_PATH || '/mnt/explorer';

// 创建软链接
router.post('/symlink', async (req, res) => {
  try {
    const { source, target } = req.body;
    
    if (!source || !target) {
      return res.status(400).json({ error: 'Source and target paths are required' });
    }
    
    const sourcePath = path.join(BASE_PATH, source);
    const targetPath = path.join(BASE_PATH, target);
    
    // 安全检查
    if (!sourcePath.startsWith(BASE_PATH) || !targetPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(sourcePath)) {
      return res.status(404).json({ error: 'Source path not found' });
    }
    
    // 创建软链接（符号链接）
    await fs.ensureSymlink(sourcePath, targetPath);
    
    res.json({ 
      success: true,
      source,
      target,
      type: 'symbolic'
    });
  } catch (error) {
    console.error('Error creating symbolic link:', error);
    res.status(500).json({ error: 'Failed to create symbolic link' });
  }
});

// 创建硬链接
router.post('/hardlink', async (req, res) => {
  try {
    const { source, target } = req.body;
    
    if (!source || !target) {
      return res.status(400).json({ error: 'Source and target paths are required' });
    }
    
    const sourcePath = path.join(BASE_PATH, source);
    const targetPath = path.join(BASE_PATH, target);
    
    // 安全检查
    if (!sourcePath.startsWith(BASE_PATH) || !targetPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(sourcePath)) {
      return res.status(404).json({ error: 'Source path not found' });
    }
    
    // 检查源是否是文件（硬链接只能用于文件）
    const stats = await fs.stat(sourcePath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Hard links can only be created for files' });
    }
    
    // 创建硬链接
    await fs.ensureLink(sourcePath, targetPath);
    
    res.json({ 
      success: true,
      source,
      target,
      type: 'hard'
    });
  } catch (error) {
    console.error('Error creating hard link:', error);
    res.status(500).json({ error: 'Failed to create hard link' });
  }
});

// 获取符号链接目标
router.get('/symlink-target', async (req, res) => {
  try {
    const linkPath = req.query.path;
    
    if (!linkPath) {
      return res.status(400).json({ error: 'Link path is required' });
    }
    
    const fullPath = path.join(BASE_PATH, linkPath);
    
    // 安全检查
    if (!fullPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查路径是否存在
    if (!await fs.pathExists(fullPath)) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // 检查是否是符号链接
    const stats = await fs.lstat(fullPath);
    if (!stats.isSymbolicLink()) {
      return res.status(400).json({ error: 'Not a symbolic link' });
    }
    
    // 读取链接目标
    const target = await fs.readlink(fullPath);
    const relativePath = path.relative(BASE_PATH, target);
    
    res.json({
      source: linkPath,
      target: relativePath,
      absoluteTarget: target,
      broken: !(await fs.pathExists(target))
    });
  } catch (error) {
    console.error('Error getting symbolic link target:', error);
    res.status(500).json({ error: 'Failed to get symbolic link target' });
  }
});

// 查找硬链接
router.get('/find-hardlinks', async (req, res) => {
  try {
    const filePath = req.query.path;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const fullPath = path.join(BASE_PATH, filePath);
    
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
    
    // 使用find命令查找相同inode的硬链接
    const { stdout } = await execPromise(`find ${BASE_PATH} -samefile "${fullPath}" -not -path "${fullPath}"`);
    
    // 处理结果
    const hardlinks = stdout.trim().split('\n')
      .filter(link => link) // 过滤空行
      .map(link => ({
        path: link.replace(BASE_PATH, ''),
        absolutePath: link
      }));
    
    res.json({
      sourcePath: filePath,
      inode: stats.ino,
      linkCount: stats.nlink,
      hardlinks
    });
  } catch (error) {
    console.error('Error finding hard links:', error);
    res.status(500).json({ error: 'Failed to find hard links' });
  }
});

// 更新符号链接目标
router.put('/update-symlink', async (req, res) => {
  try {
    const { link, newTarget } = req.body;
    
    if (!link || !newTarget) {
      return res.status(400).json({ error: 'Link path and new target are required' });
    }
    
    const linkPath = path.join(BASE_PATH, link);
    const newTargetPath = path.join(BASE_PATH, newTarget);
    
    // 安全检查
    if (!linkPath.startsWith(BASE_PATH) || !newTargetPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查链接是否存在
    if (!await fs.pathExists(linkPath)) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // 检查是否是符号链接
    const stats = await fs.lstat(linkPath);
    if (!stats.isSymbolicLink()) {
      return res.status(400).json({ error: 'Not a symbolic link' });
    }
    
    // 删除旧链接并创建新链接
    await fs.unlink(linkPath);
    await fs.ensureSymlink(newTargetPath, linkPath);
    
    res.json({ 
      success: true,
      link,
      newTarget
    });
  } catch (error) {
    console.error('Error updating symbolic link:', error);
    res.status(500).json({ error: 'Failed to update symbolic link' });
  }
});

module.exports = router; 