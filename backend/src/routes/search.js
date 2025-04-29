const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const BASE_PATH = process.env.BASE_PATH || '/mnt/explorer';

// 搜索历史存储
let searchHistory = [];
const MAX_HISTORY = 20;

/**
 * 基本搜索功能
 * query参数:
 * - dir: 基础目录（相对路径）
 * - query: 搜索关键词
 * - recursive: 是否递归搜索子目录 (true/false)
 * - regex: 是否使用正则表达式 (true/false)
 * - fileType: 文件类型筛选 (如: jpg,png,pdf)
 * - modifiedAfter: 在此日期之后修改的文件 (ISO日期字符串)
 * - modifiedBefore: 在此日期之前修改的文件 (ISO日期字符串)
 * - minSize: 最小文件大小 (字节)
 * - maxSize: 最大文件大小 (字节)
 * - limit: 结果数量限制 (默认100)
 */
router.get('/', async (req, res) => {
  try {
    const {
      dir = '',
      query,
      recursive = 'true',
      regex = 'false',
      fileType,
      modifiedAfter,
      modifiedBefore,
      minSize,
      maxSize,
      limit = 100
    } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const baseDir = path.join(BASE_PATH, dir);
    
    // 安全检查
    if (!baseDir.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 检查目录是否存在
    if (!await fs.pathExists(baseDir)) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    // 保存搜索历史
    if (!searchHistory.includes(query)) {
      searchHistory.unshift(query);
      if (searchHistory.length > MAX_HISTORY) {
        searchHistory = searchHistory.slice(0, MAX_HISTORY);
      }
    }
    
    const results = await searchFiles(
      baseDir,
      query,
      recursive === 'true',
      regex === 'true',
      fileType,
      modifiedAfter,
      modifiedBefore,
      minSize ? parseInt(minSize, 10) : undefined,
      maxSize ? parseInt(maxSize, 10) : undefined,
      parseInt(limit, 10)
    );
    
    res.json({
      query,
      baseDir: dir,
      count: results.length,
      results
    });
    
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({ error: 'Failed to search files' });
  }
});

/**
 * 获取搜索历史
 */
router.get('/history', (req, res) => {
  res.json({
    history: searchHistory
  });
});

/**
 * 清除搜索历史
 */
router.delete('/history', (req, res) => {
  searchHistory = [];
  res.json({ success: true });
});

/**
 * 全文搜索（搜索文件内容）
 * query参数:
 * - dir: 基础目录（相对路径）
 * - query: 搜索关键词
 * - filePattern: 要搜索的文件模式 (如: "*.txt,*.md")
 * - caseSensitive: 区分大小写 (true/false)
 * - limit: 结果数量限制
 */
router.get('/content', async (req, res) => {
  try {
    const {
      dir = '',
      query,
      filePattern = '',
      caseSensitive = 'false',
      limit = 100
    } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const baseDir = path.join(BASE_PATH, dir);
    
    // 安全检查
    if (!baseDir.startsWith(BASE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // 构造grep命令进行文本搜索
    // 使用ripgrep (rg) 如果可用，否则使用grep
    const rgExists = await checkCommandExists('rg');
    let command = '';
    let results = [];
    
    if (rgExists) {
      // 使用更快的ripgrep
      command = `cd "${baseDir}" && rg -l ${caseSensitive === 'true' ? '' : '-i'} -e "${escapeShellArg(query)}"`;
      if (filePattern) {
        const patterns = filePattern.split(',').map(p => `-g "${p.trim()}"`).join(' ');
        command += ` ${patterns}`;
      }
      command += ` --max-count=${limit}`;
    } else {
      // 回退到grep
      command = `cd "${baseDir}" && grep -l ${caseSensitive === 'true' ? '' : '-i'} -r "${escapeShellArg(query)}" .`;
      if (filePattern) {
        const patterns = filePattern.split(',').map(p => `--include="${p.trim()}"`).join(' ');
        command += ` ${patterns}`;
      }
      command += ` | head -n ${limit}`;
    }
    
    try {
      const { stdout } = await execPromise(command);
      
      // 解析结果
      const files = stdout.split('\n').filter(Boolean);
      
      // 对于每个文件，获取匹配的上下文
      results = await Promise.all(files.map(async (filePath) => {
        const fileRelPath = filePath.startsWith('./') ? filePath.substring(2) : filePath;
        const fullPath = path.join(baseDir, fileRelPath);
        const relativePath = path.relative(BASE_PATH, fullPath);
        
        try {
          const fileStats = await fs.stat(fullPath);
          
          // 获取匹配行及其上下文
          let contextCommand = '';
          if (rgExists) {
            contextCommand = `rg -C 2 ${caseSensitive === 'true' ? '' : '-i'} -e "${escapeShellArg(query)}" "${fullPath}" --json`;
          } else {
            contextCommand = `grep -${caseSensitive === 'true' ? '' : 'i'}C 2 "${escapeShellArg(query)}" "${fullPath}"`;
          }
          
          const { stdout: contextOutput } = await execPromise(contextCommand);
          let matchesWithContext = [];
          
          if (rgExists) {
            // Parse ripgrep JSON output
            const lines = contextOutput.split('\n').filter(Boolean);
            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                if (json.type === 'match') {
                  matchesWithContext.push({
                    line: json.data.line_number,
                    text: json.data.lines.text,
                    matched: true
                  });
                } else if (json.type === 'context') {
                  matchesWithContext.push({
                    line: json.data.line_number,
                    text: json.data.lines.text,
                    matched: false
                  });
                }
              } catch (e) {
                console.error('Error parsing ripgrep JSON output:', e);
              }
            }
          } else {
            // Parse grep output
            // Format: filename-line-context
            const lines = contextOutput.split('\n').filter(Boolean);
            for (const line of lines) {
              if (line.startsWith('--')) continue; // Separator
              
              if (line.includes(':')) {
                const parts = line.split(':');
                const lineNumber = parseInt(parts[0], 10);
                const text = parts.slice(1).join(':');
                
                // Check if this is a match or context
                const isMatch = new RegExp(query, caseSensitive === 'true' ? '' : 'i').test(text);
                
                matchesWithContext.push({
                  line: lineNumber,
                  text,
                  matched: isMatch
                });
              }
            }
          }
          
          return {
            path: relativePath,
            name: path.basename(filePath),
            isDirectory: fileStats.isDirectory(),
            size: fileStats.size,
            modifiedTime: fileStats.mtime,
            matches: matchesWithContext
          };
        } catch (fileError) {
          console.error(`Error processing file ${filePath}:`, fileError);
          return {
            path: relativePath,
            name: path.basename(filePath),
            error: fileError.message
          };
        }
      }));
      
    } catch (grepError) {
      console.error('Grep command failed:', grepError);
      // If grep fails, this might be due to empty result, so just return empty array
      results = [];
    }
    
    res.json({
      query,
      baseDir: dir,
      count: results.length,
      results
    });
    
  } catch (error) {
    console.error('Error searching file contents:', error);
    res.status(500).json({ error: 'Failed to search file contents' });
  }
});

/**
 * 保存搜索查询
 * body参数:
 * - name: 保存的搜索名称
 * - query: 搜索关键词
 * - params: 搜索参数对象
 */
router.post('/saved', async (req, res) => {
  try {
    const { name, query, params } = req.body;
    
    if (!name || !query) {
      return res.status(400).json({ error: 'Name and query are required' });
    }
    
    // 这里应该将保存的搜索存储到数据库
    // 简化示例中，我们将使用本地文件存储
    const savedSearchesPath = path.join(__dirname, '../../data/saved_searches.json');
    
    let savedSearches = [];
    try {
      // 确保目录存在
      await fs.ensureDir(path.dirname(savedSearchesPath));
      
      // 尝试读取现有文件
      if (await fs.pathExists(savedSearchesPath)) {
        const savedData = await fs.readJson(savedSearchesPath);
        savedSearches = savedData.searches || [];
      }
    } catch (readError) {
      console.error('Error reading saved searches:', readError);
      // 继续使用空数组
    }
    
    // 添加或更新保存的搜索
    const existingIndex = savedSearches.findIndex(s => s.name === name);
    const newSearch = {
      id: existingIndex >= 0 ? savedSearches[existingIndex].id : Date.now(),
      name,
      query,
      params,
      createdAt: existingIndex >= 0 ? savedSearches[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      savedSearches[existingIndex] = newSearch;
    } else {
      savedSearches.push(newSearch);
    }
    
    // 保存到文件
    await fs.writeJson(savedSearchesPath, { searches: savedSearches }, { spaces: 2 });
    
    res.json({
      success: true,
      savedSearch: newSearch
    });
    
  } catch (error) {
    console.error('Error saving search:', error);
    res.status(500).json({ error: 'Failed to save search' });
  }
});

/**
 * 获取保存的搜索查询列表
 */
router.get('/saved', async (req, res) => {
  try {
    const savedSearchesPath = path.join(__dirname, '../../data/saved_searches.json');
    
    if (!await fs.pathExists(savedSearchesPath)) {
      return res.json({ searches: [] });
    }
    
    const savedData = await fs.readJson(savedSearchesPath);
    
    res.json({
      searches: savedData.searches || []
    });
    
  } catch (error) {
    console.error('Error getting saved searches:', error);
    res.status(500).json({ error: 'Failed to get saved searches' });
  }
});

/**
 * 删除保存的搜索查询
 */
router.delete('/saved/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Search ID is required' });
    }
    
    const savedSearchesPath = path.join(__dirname, '../../data/saved_searches.json');
    
    if (!await fs.pathExists(savedSearchesPath)) {
      return res.status(404).json({ error: 'No saved searches found' });
    }
    
    const savedData = await fs.readJson(savedSearchesPath);
    const searches = savedData.searches || [];
    
    const newSearches = searches.filter(s => s.id !== parseInt(id, 10));
    
    if (newSearches.length === searches.length) {
      return res.status(404).json({ error: 'Saved search not found' });
    }
    
    await fs.writeJson(savedSearchesPath, { searches: newSearches }, { spaces: 2 });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting saved search:', error);
    res.status(500).json({ error: 'Failed to delete saved search' });
  }
});

// 工具函数：在给定目录中搜索文件
async function searchFiles(
  baseDir,
  query,
  recursive,
  useRegex,
  fileType,
  modifiedAfter,
  modifiedBefore,
  minSize,
  maxSize,
  limit
) {
  const results = [];
  
  // 查找文件
  async function findInDir(dir, depth = 0) {
    if (results.length >= limit) return;
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (results.length >= limit) break;
        
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(BASE_PATH, fullPath);
        
        try {
          const stats = await fs.stat(fullPath);
          
          // 检查是否是目录
          if (stats.isDirectory()) {
            // 如果是递归搜索，继续搜索子目录
            if (recursive && depth < 20) { // 限制最大深度为20，防止无限递归
              await findInDir(fullPath, depth + 1);
            }
            
            // 检查目录名称是否匹配
            const nameMatches = checkNameMatch(entry.name, query, useRegex);
            
            if (nameMatches) {
              results.push({
                path: relativePath,
                name: entry.name,
                isDirectory: true,
                size: stats.size,
                modifiedTime: stats.mtime
              });
            }
          } else if (stats.isFile()) {
            // 检查文件类型
            if (fileType && !checkFileType(entry.name, fileType)) {
              continue;
            }
            
            // 检查文件修改时间
            if (modifiedAfter && new Date(stats.mtime) < new Date(modifiedAfter)) {
              continue;
            }
            
            if (modifiedBefore && new Date(stats.mtime) > new Date(modifiedBefore)) {
              continue;
            }
            
            // 检查文件大小
            if (minSize !== undefined && stats.size < minSize) {
              continue;
            }
            
            if (maxSize !== undefined && stats.size > maxSize) {
              continue;
            }
            
            // 检查文件名称是否匹配
            const nameMatches = checkNameMatch(entry.name, query, useRegex);
            
            if (nameMatches) {
              results.push({
                path: relativePath,
                name: entry.name,
                isDirectory: false,
                size: stats.size,
                modifiedTime: stats.mtime
              });
            }
          }
        } catch (itemError) {
          console.error(`Error processing item ${fullPath}:`, itemError);
          // 跳过此项并继续
        }
      }
    } catch (dirError) {
      console.error(`Error reading directory ${dir}:`, dirError);
      // 跳过此目录并继续
    }
  }
  
  await findInDir(baseDir);
  return results;
}

// 检查文件名是否匹配搜索关键词
function checkNameMatch(filename, query, useRegex) {
  if (useRegex) {
    try {
      const regex = new RegExp(query, 'i');
      return regex.test(filename);
    } catch (error) {
      console.error('Invalid regex:', error);
      // 如果正则表达式无效，回退到普通搜索
      return filename.toLowerCase().includes(query.toLowerCase());
    }
  }
  
  return filename.toLowerCase().includes(query.toLowerCase());
}

// 检查文件类型是否匹配
function checkFileType(filename, fileType) {
  const ext = path.extname(filename).toLowerCase().substring(1); // 删除点号
  return fileType.split(',')
    .map(type => type.trim().toLowerCase())
    .some(type => type === ext || type === '*');
}

// 检查命令是否存在
async function checkCommandExists(command) {
  try {
    await execPromise(`which ${command}`);
    return true;
  } catch (error) {
    return false;
  }
}

// 转义shell参数，防止命令注入
function escapeShellArg(arg) {
  return arg.replace(/[^\w\s.-]/g, '\\$&');
}

module.exports = router; 