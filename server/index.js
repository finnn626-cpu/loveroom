// 简单的 Node.js 后端服务器
// 运行: node server/index.js
// 或: npm run server

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// 内存存储（生产环境应使用数据库）
const spaces = new Map();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use('/api', express.static('public'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 创建空间
app.post('/api/spaces', (req, res) => {
  const { name, password } = req.body;
  
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  const id = Math.random().toString(36).substring(2, 11);
  const space = {
    id,
    name: name.trim(),
    password: password.trim(),
    created: Date.now(),
    messages: [
      {
        id: 'init',
        senderId: 'system',
        senderName: '系统',
        content: `欢迎来到属于你们的"${name.trim()}"空间！开始分享你们的日常吧。`,
        timestamp: Date.now(),
        type: 'system'
      }
    ]
  };

  spaces.set(id, space);
  res.json({ id, name: space.name, password: space.password, created: space.created });
});

// 获取空间
app.get('/api/spaces/:id', (req, res) => {
  const { id } = req.params;
  const space = spaces.get(id);

  if (!space) {
    return res.status(404).json({ error: 'Space not found' });
  }

  // 不返回密码
  const { password, ...spaceData } = space;
  res.json(spaceData);
});

// 验证空间
app.post('/api/spaces/:id/validate', (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const space = spaces.get(id);

  if (!space) {
    return res.json({ valid: false });
  }

  const storedPassword = (space.password || '').trim();
  const inputPassword = (password || '').trim();
  const valid = storedPassword === inputPassword && storedPassword.length > 0;

  res.json({ valid });
});

// 添加消息
app.post('/api/spaces/:id/messages', (req, res) => {
  const { id } = req.params;
  const message = req.body;
  const space = spaces.get(id);

  if (!space) {
    return res.status(404).json({ error: 'Space not found' });
  }

  space.messages.push(message);
  spaces.set(id, space);

  res.json(space.messages);
});

// 获取消息
app.get('/api/spaces/:id/messages', (req, res) => {
  const { id } = req.params;
  const space = spaces.get(id);

  if (!space) {
    return res.json([]);
  }

  res.json(space.messages);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

