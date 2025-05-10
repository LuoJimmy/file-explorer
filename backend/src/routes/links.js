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
    let filePath = req.query.path || '';
    console.log('Requested path:', filePath);

    // 如果路径以/开头，去掉开头的/
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1);
    }

    console.log('Normalized path:', filePath);

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const fullPath = path.join(BASE_PATH, filePath);
    console.log('Full path:', fullPath);
    console.log('BASE_PATH:', BASE_PATH);

    // 安全检查
    if (!fullPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied', details: 'Path is outside of base directory' });
    }

    // 检查文件是否存在
    const exists = await fs.pathExists(fullPath);
    if (!exists) {
      return res.status(404).json({ error: 'File not found', details: `File does not exist: ${fullPath}` });
    }

    // 检查是否是文件
    const stats = await fs.stat(fullPath);
    console.log('File stats:', {
      isFile: stats.isFile(),
      size: stats.size,
      ino: stats.ino,
      nlink: stats.nlink
    });

    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Not a file', details: 'The path points to a directory or special file' });
    }

    // 检查同一目录下是否有硬链接
    try {
      // 获取当前文件所在目录
      const dirPath = path.dirname(fullPath);
      const fileName = path.basename(fullPath);
      console.log(`检查目录 ${dirPath} 中的硬链接`);

      // 读取目录内容
      const files = await fs.readdir(dirPath);
      const hardlinks = [];

      // 检查每个文件
      for (const file of files) {
        if (file === fileName) continue; // 跳过原文件

        const filePath = path.join(dirPath, file);
        try {
          const fileStats = await fs.stat(filePath);

          // 如果inode相同，则是硬链接
          if (fileStats.isFile() && fileStats.ino === stats.ino) {
            hardlinks.push({
              path: filePath.replace(BASE_PATH, '').replace(/^\//g, ''),
              absolutePath: filePath
            });
          }
        } catch (err) {
          console.log(`跳过文件 ${filePath}: ${err.message}`);
        }
      }

      // 检查其他目录，如果有其他硬链接存在
      if (stats.nlink > hardlinks.length + 1) { // +1 是原文件自己
        console.log(`当前目录找到 ${hardlinks.length} 个硬链接，但总链接数为 ${stats.nlink}，尝试搜索其他目录...`);

        // 递归查找函数
        const findAllHardLinks = async (directory) => {
          const result = [];
          try {
            const items = await fs.readdir(directory);

            for (const item of items) {
              const itemPath = path.join(directory, item);

              try {
                const itemStat = await fs.stat(itemPath);

                if (itemStat.isDirectory()) {
                  // 如果是目录并且不是当前文件所在目录，则递归查找
                  if (itemPath !== dirPath) {
                    const subResults = await findAllHardLinks(itemPath);
                    result.push(...subResults);
                  }
                } else if (itemStat.isFile() && itemPath !== fullPath && itemStat.ino === stats.ino) {
                  // 找到硬链接
                  result.push({
                    path: itemPath.replace(BASE_PATH, '').replace(/^\//g, ''),
                    absolutePath: itemPath
                  });
                }
              } catch (err) {
                console.log(`跳过项目 ${itemPath}: ${err.message}`);
              }
            }
          } catch (err) {
            console.log(`跳过目录 ${directory}: ${err.message}`);
          }

          return result;
        };

        // 从根目录开始搜索
        const additionalLinks = await findAllHardLinks(BASE_PATH);
        console.log(`在其他目录找到 ${additionalLinks.length} 个硬链接`);

        // 合并结果，避免重复
        const allPaths = new Set(hardlinks.map(link => link.absolutePath));
        for (const link of additionalLinks) {
          if (!allPaths.has(link.absolutePath)) {
            hardlinks.push(link);
            allPaths.add(link.absolutePath);
          }
        }
      }

      // 返回结果
      res.json({
        sourcePath: filePath,
        inode: stats.ino,
        linkCount: stats.nlink,
        hardlinks
      });
    } catch (error) {
      console.error('Error finding hardlinks:', error);
      res.status(500).json({
        error: 'Failed to find hard links',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error finding hard links:', error);
    res.status(500).json({
      error: 'Failed to find hard links',
      details: error.message
    });
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

// 删除硬链接
router.delete('/delete-hardlink', async (req, res) => {
  try {
    const { path: linkPath } = req.query;

    if (!linkPath) {
      return res.status(400).json({ error: 'Link path is required' });
    }

    const fullPath = path.join(BASE_PATH, linkPath);

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

    // 删除硬链接
    await fs.unlink(fullPath);

    res.json({
      success: true,
      path: linkPath
    });
  } catch (error) {
    console.error('Error deleting hard link:', error);
    res.status(500).json({ error: 'Failed to delete hard link' });
  }
});

// 删除所有硬链接
router.delete('/delete-all-hardlinks', async (req, res) => {
  try {
    const { path: filePath } = req.query;

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

    // 查找所有硬链接
    const hardlinks = await findHardLinks(fullPath);

    // 删除所有硬链接（除了源文件）
    for (const link of hardlinks) {
      if (link.path !== filePath) {
        await fs.unlink(path.join(BASE_PATH, link.path));
      }
    }

    res.json({
      success: true,
      deletedCount: hardlinks.length - 1
    });
  } catch (error) {
    console.error('Error deleting all hard links:', error);
    res.status(500).json({ error: 'Failed to delete all hard links' });
  }
});

// 辅助函数：查找硬链接
async function findHardLinks(filePath) {
  const stats = await fs.stat(filePath);
  const hardlinks = [];

  // 获取当前文件所在目录
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);

  // 读取目录内容
  const files = await fs.readdir(dirPath);

  // 检查每个文件
  for (const file of files) {
    if (file === fileName) continue; // 跳过原文件

    const currentPath = path.join(dirPath, file);
    try {
      const fileStats = await fs.stat(currentPath);

      // 如果inode相同，则是硬链接
      if (fileStats.isFile() && fileStats.ino === stats.ino) {
        hardlinks.push({
          path: currentPath.replace(BASE_PATH, '').replace(/^\//g, ''),
          absolutePath: currentPath
        });
      }
    } catch (err) {
      console.log(`跳过文件 ${currentPath}: ${err.message}`);
    }
  }

  // 检查其他目录，如果有其他硬链接存在
  if (stats.nlink > hardlinks.length + 1) { // +1 是原文件自己
    // 递归查找函数
    const findAllHardLinks = async (directory) => {
      const result = [];
      try {
        const items = await fs.readdir(directory);

        for (const item of items) {
          const itemPath = path.join(directory, item);

          try {
            const itemStat = await fs.stat(itemPath);

            if (itemStat.isDirectory()) {
              // 如果是目录并且不是当前文件所在目录，则递归查找
              if (itemPath !== dirPath) {
                const subResults = await findAllHardLinks(itemPath);
                result.push(...subResults);
              }
            } else if (itemStat.isFile() && itemPath !== filePath && itemStat.ino === stats.ino) {
              // 找到硬链接
              result.push({
                path: itemPath.replace(BASE_PATH, '').replace(/^\//g, ''),
                absolutePath: itemPath
              });
            }
          } catch (err) {
            console.log(`跳过项目 ${itemPath}: ${err.message}`);
          }
        }
      } catch (err) {
        console.log(`跳过目录 ${directory}: ${err.message}`);
      }

      return result;
    };

    // 从根目录开始搜索
    const additionalLinks = await findAllHardLinks(BASE_PATH);

    // 合并结果，避免重复
    const allPaths = new Set(hardlinks.map(link => link.absolutePath));
    for (const link of additionalLinks) {
      if (!allPaths.has(link.absolutePath)) {
        hardlinks.push(link);
        allPaths.add(link.absolutePath);
      }
    }
  }

  return hardlinks;
}

module.exports = router;