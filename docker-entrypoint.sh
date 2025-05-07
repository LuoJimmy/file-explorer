#!/bin/sh
set -e

# 加载环境变量（如果存在）
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 设置默认端口
export PORT=${PORT:-3000}
export BASE_PATH=${BASE_PATH:-/files}

# 显示调试信息
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "PNPM version: $(pnpm -v)"
echo "Backend directory contents:"
ls -la /app/backend
echo "Node modules directory contents:"
ls -la /app/backend/node_modules

# 启动Nginx - 后台运行
echo "Starting Nginx..."
nginx

# 启动Node.js后端服务
echo "Starting backend server on port ${PORT}..."
cd /app/backend
node src/index.js > /app/backend/logs/app.log 2>&1 &
BACKEND_PID=$!

# 更高效的健康检查
echo "Waiting for backend service to be ready..."
MAX_ATTEMPTS=15
for i in $(seq 1 $MAX_ATTEMPTS); do
  if curl -s http://localhost:${PORT}/api/health > /dev/null; then
    echo "Backend service is ready!"
    break
  fi

  # 检查进程是否还在运行
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend service failed to start!"
    echo "Backend logs:"
    cat /app/backend/logs/app.log
    exit 1
  fi

  # 只在前几次尝试时输出详细信息
  if [ "$i" -le 5 ] || [ "$i" -eq $MAX_ATTEMPTS ]; then
    echo "Attempt $i/$MAX_ATTEMPTS: Checking backend health..."
  fi

  if [ "$i" -eq $MAX_ATTEMPTS ]; then
    echo "Backend service failed to start after $MAX_ATTEMPTS attempts!"
    echo "Backend logs:"
    cat /app/backend/logs/app.log
    exit 1
  fi

  sleep 1
done

# 保持容器运行
echo "Services started. Container is now running..."
exec tail -f /dev/null
