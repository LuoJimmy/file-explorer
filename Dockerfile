# 构建阶段 - 依赖安装
FROM node:18-alpine AS deps
WORKDIR /app

# 安装pnpm并设置镜像
RUN npm install -g pnpm@8.15.3 && \
    pnpm config set registry https://registry.npmmirror.com

# 仅复制依赖相关文件
COPY package.json pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# 安装所有依赖
RUN pnpm install

# 构建阶段 - 前端构建
FROM deps AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# 复制源代码
COPY . .

# 构建前端
RUN cd frontend && pnpm run build

# 生产阶段
FROM node:18-alpine AS production
WORKDIR /app

# 设置默认环境变量
ENV PORT=3000 \
    BASE_PATH=/files \
    NODE_ENV=production

# 安装pnpm
RUN npm install -g pnpm@8.15.3 && \
    pnpm config set registry https://registry.npmmirror.com

# 复制Nginx配置
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 复制前端构建结果
COPY --from=builder /app/frontend/dist /app/frontend/dist

# 复制后端代码和依赖
COPY --from=builder /app/backend/src /app/backend/src
COPY --from=builder /app/backend/package.json /app/backend/

# 安装后端依赖
RUN cd /app/backend && \
    pnpm install --prod && \
    mkdir -p /files /app/backend/logs && \
    chmod -R 755 /files /app/backend && \
    chown -R node:node /app/backend

# 安装Nginx
RUN apk add --no-cache nginx curl && \
    chown -R nginx:nginx /app/frontend/dist

# 复制启动脚本并设置权限
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# 暴露端口
EXPOSE 8080

# 设置启动命令
CMD ["/app/docker-entrypoint.sh"]
