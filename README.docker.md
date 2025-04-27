# Docker部署说明

## 项目简介

该项目是一个文件资源管理器应用，前端使用Vue.js，后端使用Node.js，支持文件浏览、上传、下载等功能。

## 部署方式

### 使用Docker部署

项目已配置为使用单一Docker镜像部署前后端应用，可以通过以下步骤进行部署：

1. 确保安装了Docker和Docker Compose
2. 克隆项目到本地
3. 在项目根目录执行以下命令构建并启动容器：

```bash
docker-compose up -d
```

### 配置文件挂载

默认配置会挂载本地的`/Users/jimmyluo/Downloads`目录到容器的`/files`目录作为可浏览的文件系统。你可以在`docker-compose.yml`文件中修改此配置，将其改为你希望浏览的目录：

```yaml
volumes:
  - /path/to/your/directory:/files
```

### 访问应用

部署完成后，可以通过以下地址访问应用：

- 前端界面：http://localhost:8080
- 后端API：http://localhost:3000

## 手动构建和运行

如果需要手动构建镜像，可以执行：

```bash
docker build -t file-explorer .
docker run -p 8080:8080 -p 3000:3000 -v /path/to/your/directory:/files -d file-explorer
```

## 常见问题

### 如何修改挂载的目录？

编辑`docker-compose.yml`文件中的`volumes`部分，修改为你需要浏览的目录路径。

### 如何查看日志？

```bash
docker logs file-explorer
```

### 如何停止服务？

```bash
docker-compose down
``` 