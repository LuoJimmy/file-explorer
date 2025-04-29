const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const extractZip = require('extract-zip');
const { exec } = require('child_process');
const util = require('util');
const multer = require('multer');

const execPromise = util.promisify(exec);
const BASE_PATH = process.env.BASE_PATH || '/mnt/explorer';

// 配置临时文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, '../../temp');
    fs.ensureDirSync(tempDir);
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/**
 * 创建压缩文件
 * body参数:
 * - files: 要压缩的文件/文件夹路径数组
 * - targetPath: 目标压缩文件路径
 * - format: 压缩格式 (zip, tar, tgz)
 * - level: 压缩级别 (1-9)
 */
router.post('/compress', async (req, res) => {
  try {
    const { files, targetPath, format = 'zip', level = 6 } = req.body;
    
    if (!files || !files.length || !targetPath) {
      return res.status(400).json({ error: 'Files and target path are required' });
    }
    
    const fullTargetPath = path.join(BASE_PATH, targetPath);
    
    // 安全检查
    if (!fullTargetPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 确保输出目录存在
    const targetDir = path.dirname(fullTargetPath);
    await fs.ensureDir(targetDir);
    
    // 创建写入流
    const output = fs.createWriteStream(fullTargetPath);
    let archive;
    
    // 根据格式创建不同类型的归档
    switch(format.toLowerCase()) {
      case 'zip':
        archive = archiver('zip', {
          zlib: { level }
        });
        break;
      case 'tar':
        archive = archiver('tar');
        break;
      case 'tgz':
      case 'tar.gz':
        archive = archiver('tar', {
          gzip: true,
          gzipOptions: { level }
        });
        break;
      default:
        return res.status(400).json({ error: 'Unsupported archive format' });
    }
    
    // 监听关闭事件
    output.on('close', () => {
      res.json({
        success: true,
        path: targetPath,
        size: archive.pointer(),
        format
      });
    });
    
    // 捕获错误
    archive.on('error', (err) => {
      throw err;
    });
    
    // 管道连接
    archive.pipe(output);
    
    // 添加文件到压缩包
    for (const filePath of files) {
      const fullPath = path.join(BASE_PATH, filePath);
      
      // 安全检查
      if (!fullPath.startsWith(BASE_PATH)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // 检查文件是否存在
      if (!await fs.pathExists(fullPath)) {
        return res.status(404).json({ error: `File not found: ${filePath}` });
      }
      
      const stats = await fs.stat(fullPath);
      const name = path.basename(filePath);
      
      if (stats.isDirectory()) {
        // 添加目录及其内容
        archive.directory(fullPath, name);
      } else if (stats.isFile()) {
        // 添加单个文件
        archive.file(fullPath, { name });
      }
    }
    
    // 完成归档
    await archive.finalize();
    
  } catch (error) {
    console.error('Error compressing files:', error);
    res.status(500).json({ error: 'Failed to compress files' });
  }
});

/**
 * 解压文件
 * body参数:
 * - archivePath: 压缩文件路径
 * - targetPath: 解压目标目录
 * - password: (可选) 解压密码
 */
router.post('/extract', async (req, res) => {
  try {
    const { archivePath, targetPath, password } = req.body;
    
    if (!archivePath || !targetPath) {
      return res.status(400).json({ error: 'Archive path and target path are required' });
    }
    
    const fullArchivePath = path.join(BASE_PATH, archivePath);
    const fullTargetPath = path.join(BASE_PATH, targetPath);
    
    // 安全检查
    if (!fullArchivePath.startsWith(BASE_PATH) || !fullTargetPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查压缩文件是否存在
    if (!await fs.pathExists(fullArchivePath)) {
      return res.status(404).json({ error: 'Archive file not found' });
    }
    
    // 确保目标目录存在
    await fs.ensureDir(fullTargetPath);
    
    // 获取文件扩展名来确定类型
    const ext = path.extname(fullArchivePath).toLowerCase();
    
    // 解压文件
    if (ext === '.zip') {
      await extractZip(fullArchivePath, { dir: fullTargetPath });
    } else if (ext === '.tar' || ext === '.tgz' || ext === '.gz' || fullArchivePath.endsWith('.tar.gz')) {
      // 使用tar命令解压
      const tarCommand = `tar -xf "${fullArchivePath}" -C "${fullTargetPath}"`;
      await execPromise(tarCommand);
    } else if (ext === '.rar') {
      // 需要安装unrar
      const options = password ? `-p${password}` : '';
      const rarCommand = `unrar x ${options} "${fullArchivePath}" "${fullTargetPath}"`;
      await execPromise(rarCommand);
    } else if (ext === '.7z') {
      // 需要安装p7zip
      const options = password ? `-p${password}` : '';
      const sevenzCommand = `7z x ${options} "${fullArchivePath}" -o"${fullTargetPath}"`;
      await execPromise(sevenzCommand);
    } else {
      return res.status(400).json({ error: 'Unsupported archive format' });
    }
    
    res.json({
      success: true,
      source: archivePath,
      destination: targetPath
    });
    
  } catch (error) {
    console.error('Error extracting archive:', error);
    res.status(500).json({ error: 'Failed to extract archive' });
  }
});

/**
 * 获取压缩文件内容列表
 * query参数:
 * - path: 压缩文件路径
 */
router.get('/list', async (req, res) => {
  try {
    const archivePath = req.query.path;
    
    if (!archivePath) {
      return res.status(400).json({ error: 'Archive path is required' });
    }
    
    const fullArchivePath = path.join(BASE_PATH, archivePath);
    
    // 安全检查
    if (!fullArchivePath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查压缩文件是否存在
    if (!await fs.pathExists(fullArchivePath)) {
      return res.status(404).json({ error: 'Archive file not found' });
    }
    
    // 获取文件扩展名来确定类型
    const ext = path.extname(fullArchivePath).toLowerCase();
    let command = '';
    
    if (ext === '.zip') {
      command = `unzip -l "${fullArchivePath}"`;
    } else if (ext === '.tar' || ext === '.tgz' || ext === '.gz' || fullArchivePath.endsWith('.tar.gz')) {
      command = `tar -tf "${fullArchivePath}"`;
    } else if (ext === '.rar') {
      command = `unrar l "${fullArchivePath}"`;
    } else if (ext === '.7z') {
      command = `7z l "${fullArchivePath}"`;
    } else {
      return res.status(400).json({ error: 'Unsupported archive format' });
    }
    
    const { stdout } = await execPromise(command);
    
    // 解析输出并提取文件列表
    let files = [];
    
    if (ext === '.zip') {
      // 解析unzip输出
      const lines = stdout.split('\n');
      // 跳过表头和摘要行
      const contentLines = lines.slice(3, lines.length - 3);
      
      files = contentLines.map(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 4) {
          const length = parseInt(parts[0], 10);
          const method = parts[1];
          const size = parseInt(parts[2], 10);
          const ratio = parts[3];
          const datetime = `${parts[4]} ${parts[5]}`;
          const name = parts.slice(6).join(' ');
          
          return {
            name,
            size,
            compressedSize: length,
            ratio,
            datetime,
            method
          };
        }
        return null;
      }).filter(Boolean);
    } else if (ext === '.tar' || ext === '.tgz' || ext === '.gz' || fullArchivePath.endsWith('.tar.gz')) {
      // 解析tar输出
      files = stdout.split('\n')
        .filter(line => line.trim())
        .map(line => ({
          name: line.trim(),
          isDirectory: line.endsWith('/')
        }));
    } else {
      // 对于其他格式，仅返回原始输出
      files = stdout.split('\n').filter(line => line.trim());
    }
    
    res.json({
      path: archivePath,
      format: ext.replace('.', ''),
      files
    });
    
  } catch (error) {
    console.error('Error listing archive contents:', error);
    res.status(500).json({ error: 'Failed to list archive contents' });
  }
});

/**
 * 为支持压缩包密码的上传文件创建新压缩包
 */
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const { targetPath, format = 'zip', level = 6, password } = req.body;
    
    if (!req.files || !req.files.length || !targetPath) {
      return res.status(400).json({ error: 'Files and target path are required' });
    }
    
    const fullTargetPath = path.join(BASE_PATH, targetPath);
    
    // 安全检查
    if (!fullTargetPath.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 确保输出目录存在
    const targetDir = path.dirname(fullTargetPath);
    await fs.ensureDir(targetDir);
    
    let command = '';
    const tempFiles = req.files.map(file => file.path);
    
    // 根据格式和是否有密码选择命令
    if (format === 'zip' && password) {
      // 使用zip命令行工具支持密码
      const fileArgs = tempFiles.map(file => `"${path.basename(file)}"`).join(' ');
      command = `cd ${path.dirname(tempFiles[0])} && zip -r ${password ? `-P "${password}"` : ''} "${fullTargetPath}" ${fileArgs}`;
    } else if (format === '7z' && password) {
      // 使用7z命令行工具支持密码
      const fileArgs = tempFiles.map(file => `"${file}"`).join(' ');
      command = `7z a ${password ? `-p"${password}"` : ''} "${fullTargetPath}" ${fileArgs}`;
    } else {
      // 使用archiver
      const output = fs.createWriteStream(fullTargetPath);
      let archive;
      
      switch(format.toLowerCase()) {
        case 'zip':
          archive = archiver('zip', {
            zlib: { level: parseInt(level, 10) }
          });
          break;
        case 'tar':
          archive = archiver('tar');
          break;
        case 'tgz':
        case 'tar.gz':
          archive = archiver('tar', {
            gzip: true,
            gzipOptions: { level: parseInt(level, 10) }
          });
          break;
        default:
          return res.status(400).json({ error: 'Unsupported archive format' });
      }
      
      // 管道连接
      archive.pipe(output);
      
      // 添加文件到压缩包
      for (const file of req.files) {
        const name = file.originalname;
        archive.file(file.path, { name });
      }
      
      // 完成归档
      await archive.finalize();
      
      // 删除临时文件
      for (const file of req.files) {
        await fs.remove(file.path);
      }
      
      return res.json({
        success: true,
        path: targetPath,
        format,
        files: req.files.map(file => file.originalname)
      });
    }
    
    // 执行命令行压缩
    if (command) {
      await execPromise(command);
      
      // 删除临时文件
      for (const file of tempFiles) {
        await fs.remove(file);
      }
      
      return res.json({
        success: true,
        path: targetPath,
        format,
        files: req.files.map(file => file.originalname)
      });
    }
    
  } catch (error) {
    console.error('Error creating archive from uploads:', error);
    
    // 清理临时文件
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.remove(file.path);
        } catch (e) {
          console.error('Error cleaning up temp file:', e);
        }
      }
    }
    
    res.status(500).json({ error: 'Failed to create archive' });
  }
});

module.exports = router; 