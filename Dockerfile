FROM node:18-alpine

WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    bash \
    sudo \
    zip \
    unzip \
    p7zip \
    tar \
    gzip \
    file \
    coreutils \
    curl

# 复制项目文件
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 配置容器环境
EXPOSE 8080
ENV NODE_ENV=production

# 设置挂载点
VOLUME /mnt/explorer

# 启动应用
CMD ["npm", "run", "server:start"] 