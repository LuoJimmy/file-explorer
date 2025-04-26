const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs-extra');

// 导入路由
const filesRouter = require('./routes/files');
const linksRouter = require('./routes/links');

const app = express();
const PORT = process.env.PORT || 8080;
const BASE_PATH = process.env.BASE_PATH || '/mnt/explorer';

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist')));

// API路由
app.use('/api/files', filesRouter);
app.use('/api/links', linksRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 系统信息
app.get('/api/system', (req, res) => {
  const info = {
    basePath: BASE_PATH,
    platform: process.platform,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  res.json(info);
});

// 当请求不存在的API路由时
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// 所有其他请求都发送到Vue应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 确保基础目录存在
fs.ensureDirSync(BASE_PATH);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Base file system path: ${BASE_PATH}`);
}); 