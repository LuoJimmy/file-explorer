#!/bin/sh
set -e

# 启动后端服务
echo "Starting backend server..."
cd /app/backend
node src/index.js &

# 等待后端启动
sleep 3

# 安装一个简单的静态文件服务器
echo "Installing static file server..."
npm install -g serve

# 启动前端静态文件服务器
echo "Starting frontend server..."
cd /app/frontend
serve -s dist -l 8080 &

# 保持容器运行
echo "Services started. Container is now running..."
tail -f /dev/null 