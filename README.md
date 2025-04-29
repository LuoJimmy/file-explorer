# Linux文件资源管理器

基于Docker的Linux文件资源管理器，提供与Windows资源管理器相似的功能体验，并增强Linux特有的硬链接和软链接功能支持。

## 功能特点

- 基础文件操作（创建、复制、剪切、粘贴、删除、重命名）
- 多视图模式（详细列表、图标、缩略图）
- 文件预览功能
- 搜索功能
- 硬链接和软链接管理
- 文件权限管理
- 压缩/解压缩支持
- 主题和自定义支持

## 技术架构

- 前端：Vue.js
- 后端：Node.js/Express
- 容器化：Docker
- 数据存储：SQLite (用于配置)

## 快速开始

### 使用Docker运行

```bash
# 拉取镜像
docker pull lochito/file-explorer:latest

# 运行容器
docker run -d \
  --name file-explorer \
  -p 8080:8080 \
  -v /path/on/host:/files \
  lochito/file-explorer:latest
```

访问 `http://localhost:8080` 开始使用文件资源管理器。

### 从源码构建

1. 克隆仓库

```bash
git clone https://github.com/LuoJimmy/file-explorer.git
cd file-explorer
```

2. 构建并运行

```bash
docker-compose up -d
```

## 贡献指南

[贡献指南](CONTRIBUTING.md)

## 打包指南

[打包指南](BUILDING.md)

## 更新日志

[更新日志](CHANGELOG.md)


## 许可证

MIT
