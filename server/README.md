# Love Room 后端服务器

这个服务器用于实现跨设备、跨网络的实时通信。

## 安装

```bash
cd server
npm install
```

## 运行

```bash
npm start
```

服务器将在 `http://localhost:3001` 启动。

## 部署

### 选项 1: 使用 Vercel

1. 安装 Vercel CLI: `npm i -g vercel`
2. 在 server 目录运行: `vercel`
3. 更新前端 `.env` 文件中的 `VITE_API_URL`

### 选项 2: 使用 Railway

1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 设置根目录为 `server`
4. 更新前端 `.env` 文件中的 `VITE_API_URL`

### 选项 3: 使用 Heroku

1. 在 Heroku 创建新应用
2. 设置构建包为 Node.js
3. 部署代码
4. 更新前端 `.env` 文件中的 `VITE_API_URL`

## 环境变量

- `PORT`: 服务器端口（默认: 3001）

## API 端点

- `GET /api/health` - 健康检查
- `POST /api/spaces` - 创建空间
- `GET /api/spaces/:id` - 获取空间
- `POST /api/spaces/:id/validate` - 验证空间密码
- `POST /api/spaces/:id/messages` - 添加消息
- `GET /api/spaces/:id/messages` - 获取消息列表

