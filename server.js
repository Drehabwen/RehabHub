const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// 目录初始化
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
ensureDir(path.join(__dirname, 'uploads'));
ensureDir(path.join(__dirname, 'data'));

// 配置文件上传到磁盘
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.mp4';
    const name = `video_${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// 模拟姿态估计数据
const generateMockKeypoints = () => {
  const keypoints = [
    { name: 'nose', x: 320, y: 120, score: 0.9 },
    { name: 'left_eye', x: 300, y: 110, score: 0.85 },
    { name: 'right_eye', x: 340, y: 110, score: 0.85 },
    { name: 'left_ear', x: 280, y: 120, score: 0.8 },
    { name: 'right_ear', x: 360, y: 120, score: 0.8 },
    { name: 'left_shoulder', x: 250, y: 200, score: 0.85 },
    { name: 'right_shoulder', x: 390, y: 200, score: 0.85 },
    { name: 'left_elbow', x: 220, y: 280, score: 0.8 },
    { name: 'right_elbow', x: 420, y: 280, score: 0.8 },
    { name: 'left_wrist', x: 200, y: 350, score: 0.75 },
    { name: 'right_wrist', x: 440, y: 350, score: 0.75 },
    { name: 'left_hip', x: 270, y: 320, score: 0.85 },
    { name: 'right_hip', x: 370, y: 320, score: 0.85 },
    { name: 'left_knee', x: 260, y: 420, score: 0.8 },
    { name: 'right_knee', x: 380, y: 420, score: 0.8 },
    { name: 'left_ankle', x: 250, y: 500, score: 0.75 },
    { name: 'right_ankle', x: 390, y: 500, score: 0.75 }
  ];

  // 添加一些随机变化，使关键点看起来更自然
  return keypoints.map(kp => ({
    ...kp,
    x: kp.x + (Math.random() - 0.5) * 10,
    y: kp.y + (Math.random() - 0.5) * 10,
    score: Math.max(0.5, Math.min(1.0, kp.score + (Math.random() - 0.5) * 0.2))
  }));
};

// API路由
app.post(['/api/analyze', '/analyze'], upload.single('file'), (req, res) => {
  // 模拟处理延迟
  setTimeout(() => {
    const savedFile = req.file ? req.file.filename : null;
    const mockResponse = {
      score: Math.random() * 0.5 + 0.5, // 0.5-1.0之间的随机分数
      feedback: "动作完成良好，继续保持",
      reason: "关节活动度正常，动作稳定性良好",
      angles: {
        left_elbow: Math.floor(Math.random() * 30 + 150), // 150-180度
        right_elbow: Math.floor(Math.random() * 30 + 150),
        left_knee: Math.floor(Math.random() * 30 + 150),
        right_knee: Math.floor(Math.random() * 30 + 150),
        left_shoulder: Math.floor(Math.random() * 30 + 150),
        right_shoulder: Math.floor(Math.random() * 30 + 150)
      },
      processing_time: "0.5s",
      keypoints_detected: true,
      annotated_image: "",
      details: { file: savedFile },
      timestamp: new Date().toISOString(),
      keypoints: generateMockKeypoints()
    };

    res.json(mockResponse);
  }, 300); // 模拟300ms的处理延迟
});

// 实时姿态流上报（角度与关键点）
app.post('/api/pose/stream', (req, res) => {
  try {
    const payload = req.body || {};
    const id = `result_${Date.now()}`;
    const record = { id, ...payload };
    const resultsFile = path.join(__dirname, 'data', 'results.json');
    let existing = [];
    if (fs.existsSync(resultsFile)) {
      try { existing = JSON.parse(fs.readFileSync(resultsFile, 'utf-8')); } catch { existing = []; }
    }
    existing.push(record);
    fs.writeFileSync(resultsFile, JSON.stringify(existing, null, 2));
    res.json({ status: 'ok', id });
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'failed to store pose telemetry' });
  }
});

// 结果列表与详情
app.get('/api/results', (req, res) => {
  const resultsFile = path.join(__dirname, 'data', 'results.json');
  const page = parseInt(req.query.page || '1', 10);
  const size = parseInt(req.query.size || '20', 10);
  let data = [];
  if (fs.existsSync(resultsFile)) {
    try { data = JSON.parse(fs.readFileSync(resultsFile, 'utf-8')); } catch { data = []; }
  }
  const total = data.length;
  const start = (page - 1) * size;
  const items = data.slice(start, start + size).map((r) => ({
    id: r.id,
    movementType: r.movementType,
    movementName: r.movementName,
    timestamp: r.timestamp,
    scoreSummary: r.overallScore ? `${r.overallScore.value}/${r.overallScore.maxValue}` : undefined,
    anglesSummary: r.angles || {}
  }));
  res.json({ items, total, page, size });
});

app.get('/api/results/:id', (req, res) => {
  const resultsFile = path.join(__dirname, 'data', 'results.json');
  if (!fs.existsSync(resultsFile)) return res.status(404).json({ message: 'not found' });
  try {
    const data = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    const found = data.find((r) => r.id === req.params.id);
    if (!found) return res.status(404).json({ message: 'not found' });
    res.json(found);
  } catch {
    res.status(500).json({ message: 'read error' });
  }
});

app.delete('/api/results/:id', (req, res) => {
  const resultsFile = path.join(__dirname, 'data', 'results.json');
  if (!fs.existsSync(resultsFile)) return res.status(404).json({ message: 'not found' });
  try {
    const data = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    const next = data.filter((r) => r.id !== req.params.id);
    fs.writeFileSync(resultsFile, JSON.stringify(next, null, 2));
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ message: 'write error' });
  }
});

// 创建报告（用于Reports页的快速创建）
app.post('/api/results', (req, res) => {
  try {
    const resultsFile = path.join(__dirname, 'data', 'results.json');
    let data = [];
    if (fs.existsSync(resultsFile)) {
      try { data = JSON.parse(fs.readFileSync(resultsFile, 'utf-8')); } catch { data = []; }
    }
    const id = `report_${Date.now()}`;
    const payload = req.body || {};
    const record = {
      id,
      patientId: payload.patientId || '',
      patientName: payload.patientName || '',
      testId: payload.testId || '',
      testName: payload.testName || '评估报告',
      date: payload.date || new Date().toISOString().split('T')[0],
      score: payload.score || 0,
      status: payload.status || 'draft',
      summary: payload.summary || '',
      details: payload.details || ''
    };
    data.push(record);
    fs.writeFileSync(resultsFile, JSON.stringify(data, null, 2));
    res.json(record);
  } catch (e) {
    res.status(500).json({ message: 'create error' });
  }
});

// 导出报告（Mock）
app.get('/api/results/:id/export', (req, res) => {
  const format = (req.query.format || 'pdf').toString();
  // 直接返回一个提示（真实环境应生成PDF/Excel并返回下载）
  res.json({ status: 'ok', id: req.params.id, format });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 仪表盘统计数据端点
app.get('/dashboard/stats', (req, res) => {
  const stats = [
    {
      title: '今日评估次数',
      value: '12',
      icon: '📊',
      bgColor: '#E1F5FE',
      textColor: '#0288D1',
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: '活跃患者',
      value: '6',
      icon: '👥',
      bgColor: '#E8F5E8',
      textColor: '#388E3C',
      trend: {
        value: 2,
        isPositive: true
      }
    },
    {
      title: '评估完成率',
      value: '85%',
      icon: '✅',
      bgColor: '#FFF3E0',
      textColor: '#F57C00',
      trend: {
        value: 5,
        isPositive: true
      }
    },
    {
      title: '治疗师满意度',
      value: '92%',
      icon: '⭐',
      bgColor: '#F3E5F5',
      textColor: '#7B1FA2',
      trend: {
        value: 3,
        isPositive: true
      }
    }
  ];
  
  res.json(stats);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`模拟API服务器运行在 http://localhost:${PORT}`);
  console.log('健康检查端点: http://localhost:' + PORT + '/health');
  console.log('分析端点: http://localhost:' + PORT + '/api/analyze');
  console.log('姿态流端点: http://localhost:' + PORT + '/api/pose/stream');
});

module.exports = app;
