# 构建前端
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci
COPY frontend/ .
RUN npm run build

# 构建后端
FROM node:18-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --production
COPY backend/ .

# 生产镜像
FROM node:18-alpine
WORKDIR /app

# 创建文件存储目录
RUN mkdir -p /files && chmod 755 /files

# 复制前端构建结果
COPY --from=frontend-build /app/dist /app/frontend/dist

# 复制后端代码和依赖
COPY --from=backend-build /app /app/backend
COPY --from=backend-build /app/node_modules /app/backend/node_modules

# 复制启动脚本
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# 暴露端口
EXPOSE 3000

# 设置启动命令
CMD ["/app/docker-entrypoint.sh"] 