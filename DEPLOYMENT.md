# 跨设备部署指南

## 概述

现在项目支持跨设备、跨网络的实时通信。系统会自动检测 API 服务器是否可用，如果可用则使用 API，否则降级到 localStorage。

## 快速开始

### 1. 启动后端服务器

```bash
cd server
npm install
npm start
```

服务器将在 `http://localhost:3001` 启动。

### 2. 配置前端

创建 `.env.local` 文件（在项目根目录）：

```
VITE_API_URL=http://localhost:3001/api
```

### 3. 启动前端

```bash
npm run dev
```

## 部署到生产环境

### 选项 1: 使用 Vercel（推荐）

#### 部署后端：

1. 安装 Vercel CLI: `npm i -g vercel`
2. 在 `server` 目录运行: `vercel`
3. 记下部署的 URL（例如: `https://your-app.vercel.app`）

#### 部署前端：

1. 在项目根目录运行: `vercel`
2. 在 Vercel 项目设置中添加环境变量:
   ```
   VITE_API_URL=https://your-app.vercel.app/api
   ```

### 选项 2: 使用 Railway

#### 部署后端：

1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 设置根目录为 `server`
4. 记下部署的 URL

#### 部署前端：

1. 在 Vercel/Netlify 部署前端
2. 设置环境变量 `VITE_API_URL` 为后端 URL

### 选项 3: 使用自己的服务器

1. 在服务器上安装 Node.js
2. 上传 `server` 目录
3. 运行 `npm install && npm start`
4. 配置 Nginx 反向代理（可选）
5. 更新前端 `.env` 文件中的 `VITE_API_URL`

## 工作原理

- **API 模式**: 当后端服务器可用时，所有数据存储在服务器上，实现跨设备同步
- **降级模式**: 如果 API 不可用，自动降级到 localStorage（仅限单设备）

## 测试跨设备通信

1. 在电脑上创建空间
2. 在手机上使用相同的空间 ID 和密码加入
3. 在任一设备发送消息，另一设备会在 2 秒内自动更新

## 注意事项

- 后端服务器使用内存存储，重启后数据会丢失（生产环境应使用数据库）
- 建议使用 MongoDB、PostgreSQL 或 Firebase 作为持久化存储
- 当前实现每 2 秒轮询一次，可以优化为 WebSocket 实现真正的实时通信

