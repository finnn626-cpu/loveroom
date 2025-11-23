# 调试指南

## 快速开始

### 方法 1: 使用 VS Code 调试器（推荐）

1. **确保开发服务器正在运行**：
   - 在终端运行 `npm run dev`
   - 或者按 F5 选择 "启动 Chrome 调试"（会自动启动服务器）

2. **设置断点**：
   - 在代码中点击行号左侧设置断点
   - 红色圆点表示断点已设置

3. **开始调试**：
   - 按 `F5` 或点击调试面板的绿色播放按钮
   - 选择 "启动 Chrome 调试" 配置
   - Chrome 浏览器会自动打开并连接到调试器

### 方法 2: 手动启动

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **在浏览器中打开**：
   - 访问 `http://localhost:3000`
   - 打开浏览器开发者工具（F12）
   - 在 Sources 标签页中设置断点

### 方法 3: 使用 Chrome DevTools

1. 启动开发服务器：`npm run dev`
2. 在 Chrome 中打开 `http://localhost:3000`
3. 按 F12 打开开发者工具
4. 在 Sources 标签页中找到你的源文件
5. 设置断点并调试

## 调试配置说明

### VS Code 调试配置

- **启动 Chrome 调试**: 自动启动 Chrome 并连接到调试器
- **附加到 Chrome**: 附加到已运行的 Chrome 实例
- **调试后端服务器**: 调试 Node.js 后端服务器

### 常见问题

1. **端口被占用**：
   - 修改 `vite.config.ts` 中的 `port` 配置
   - 或关闭占用端口的程序

2. **断点不生效**：
   - 确保 `sourcemap: true` 在 `vite.config.ts` 中
   - 清除浏览器缓存
   - 重新启动开发服务器

3. **无法连接到调试器**：
   - 确保开发服务器正在运行
   - 检查端口是否正确（默认 3000）
   - 尝试重启 VS Code

## 调试技巧

1. **使用 console.log**：
   ```typescript
   console.log('变量值:', variable);
   ```

2. **使用 debugger 语句**：
   ```typescript
   debugger; // 代码会在这里暂停
   ```

3. **查看网络请求**：
   - 在 Chrome DevTools 的 Network 标签页查看 API 请求
   - 检查请求和响应数据

4. **查看 React 组件状态**：
   - 安装 React DevTools 浏览器扩展
   - 在 Components 标签页查看组件状态

