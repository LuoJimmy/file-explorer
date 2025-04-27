# 构建前端
FROM node:16-alpine as frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci
COPY . .
RUN npm run build

# 构建后端
FROM node:16-alpine as backend-build
WORKDIR /app
COPY server/ ./
# 安装后端依赖，使用主项目的依赖（由于后端没有单独的package.json）
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --production

# 生产镜像
FROM node:16-alpine
WORKDIR /app

# 创建文件存储目录
RUN mkdir -p /files && chmod 755 /files

# 复制前端构建结果
COPY --from=frontend-build /app/dist /app/dist

# 复制后端代码和依赖
COPY --from=backend-build /app /app/server
COPY --from=backend-build /app/node_modules /app/node_modules

# 复制启动脚本
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# 暴露端口
EXPOSE 3000

# 设置启动命令
CMD ["/app/docker-entrypoint.sh"] 