# 贡献指南

感谢您对Linux文件资源管理器的贡献！在提交贡献之前，请仔细阅读以下指南。

## 开发环境设置

1. 克隆仓库
```bash
git clone https://github.com/LuoJimmy/file-explorer.git
cd file-explorer
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

## 代码规范

- 使用TypeScript进行开发
- 遵循ESLint和Prettier的代码规范
- 使用EditorConfig统一编辑器配置
- 提交代码前运行`pnpm lint`检查代码规范

## 提交规范

提交信息应遵循以下格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type类型：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 拉取请求

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 问题报告

使用GitHub Issues报告问题，请包含：
- 问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息

## 许可证

贡献代码即表示您同意根据MIT许可证授权您的贡献。 
