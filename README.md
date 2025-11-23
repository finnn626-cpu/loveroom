<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16gdBHFdESUvJaC_nbgAKK0iDPhOlVlNX

## Run Locally

**Prerequisites:**  Node.js

### 前端

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (可选):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Set the API server URL in `.env.local` (如果使用跨设备功能):
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

### 后端服务器（跨设备功能）

1. 进入 server 目录:
   ```bash
   cd server
   npm install
   ```

2. 启动服务器:
   ```bash
   npm start
   ```

服务器将在 `http://localhost:3001` 启动。

**注意**: 如果不启动后端服务器，应用会自动降级到 localStorage 模式（仅限单设备使用）。

详细部署说明请查看 [DEPLOYMENT.md](DEPLOYMENT.md)
