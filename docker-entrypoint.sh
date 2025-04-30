#!/bin/sh
set -e

# 加载环境变量（如果存在）
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 设置默认端口
export PORT=${PORT:-3000}
export BASE_PATH=${BASE_PATH:-/files}

# 创建必要的目录
echo "Creating necessary directories..."
mkdir -p /app/backend/logs
mkdir -p /app/frontend/dist
mkdir -p /var/log/nginx
mkdir -p /var/cache/nginx

# 设置Nginx目录权限
chown -R nginx:nginx /var/log/nginx /var/cache/nginx

# 启动Nginx
echo "Starting Nginx..."
nginx -t  # 测试Nginx配置
nginx -g "daemon off;" &
NGINX_PID=$!
echo "Nginx started with PID: $NGINX_PID"

# 启动Node.js后端服务
echo "Starting backend server on port ${PORT}..."
cd /app/backend
node src/index.js > /app/backend/logs/app.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

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

# 检查Nginx状态
if ! kill -0 $NGINX_PID 2>/dev/null; then
  echo "Nginx failed to start!"
  exit 1
fi

# 保持容器运行
echo "Services started. Container is now running..."
wait $NGINX_PID $BACKEND_PID
