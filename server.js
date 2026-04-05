const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8001;

const ok = (res, data, message = 'ok') => {
  res.json({ code: 200, message, data, timestamp: new Date().toISOString() });
};

const fail = (res, httpStatus, message, code = httpStatus, details) => {
  res.status(httpStatus).json({
    code,
    message,
    data: details ?? null,
    timestamp: new Date().toISOString()
  });
};

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(__dirname, 'uploads'));
ensureDir(path.join(__dirname, 'data'));

const assessmentResultsFile = path.join(__dirname, 'data', 'assessment-results.json');
const reportsFile = path.join(__dirname, 'data', 'reports.json');
const poseTelemetryFile = path.join(__dirname, 'data', 'pose-telemetry.json');

const readJsonArray = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeJsonArray = (filePath, value) => {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
};

const getPaging = (req) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const pageSize = Math.max(1, parseInt(String(req.query.pageSize ?? req.query.size ?? '20'), 10) || 20);
  return { page, pageSize };
};

const paginate = (items, page, pageSize) => {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
    },
  };
};

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

  return keypoints.map((kp) => ({
    ...kp,
    x: kp.x + (Math.random() - 0.5) * 10,
    y: kp.y + (Math.random() - 0.5) * 10,
    score: Math.max(0.5, Math.min(1.0, kp.score + (Math.random() - 0.5) * 0.2))
  }));
};

const normalizeAssessmentResult = (record) => ({
  id: record.id,
  movementType: record.movementType || 'unknown',
  movementName: record.movementName || record.movementType || 'Unknown Movement',
  timestamp: record.timestamp || new Date().toISOString(),
  overallScore: record.overallScore || undefined,
  mobilityScore: record.mobilityScore || undefined,
  stabilityScore: record.stabilityScore || undefined,
  angles: record.angles || {},
  recommendations: Array.isArray(record.recommendations) ? record.recommendations : [],
});

const normalizeReport = (record) => ({
  id: record.id,
  patientId: record.patientId || '',
  patientName: record.patientName || '',
  testId: record.testId || '',
  testName: record.testName || '',
  date: record.date || new Date().toISOString().split('T')[0],
  score: Number(record.score || 0),
  status: record.status || 'draft',
  summary: record.summary || '',
  details: record.details || ''
});

app.post(['/api/analyze', '/analyze'], upload.single('file'), (req, res) => {
  setTimeout(() => {
    const savedFile = req.file ? req.file.filename : null;
    const mockResponse = {
      score: Math.random() * 0.5 + 0.5,
      feedback: '动作完成良好，请继续保持',
      reason: '关节活动度正常，动作稳定性良好',
      angles: {
        left_elbow: Math.floor(Math.random() * 30 + 150),
        right_elbow: Math.floor(Math.random() * 30 + 150),
        left_knee: Math.floor(Math.random() * 30 + 150),
        right_knee: Math.floor(Math.random() * 30 + 150),
        left_shoulder: Math.floor(Math.random() * 30 + 150),
        right_shoulder: Math.floor(Math.random() * 30 + 150)
      },
      processing_time: '0.5s',
      keypoints_detected: true,
      annotated_image: '',
      details: { file: savedFile },
      timestamp: new Date().toISOString(),
      keypoints: generateMockKeypoints()
    };

    ok(res, mockResponse);
  }, 300);
});

app.post('/api/pose/stream', (req, res) => {
  try {
    const payload = req.body || {};
    const telemetry = readJsonArray(poseTelemetryFile);
    const id = `telemetry_${Date.now()}`;
    telemetry.push({
      id,
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    });
    writeJsonArray(poseTelemetryFile, telemetry);
    ok(res, { status: 'ok', id });
  } catch {
    fail(res, 500, 'failed to store pose telemetry');
  }
});

app.get('/api/assessment-results', (req, res) => {
  const { page, pageSize } = getPaging(req);
  const records = readJsonArray(assessmentResultsFile)
    .map(normalizeAssessmentResult)
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

  ok(res, paginate(records, page, pageSize));
});

app.post('/api/assessment-results', (req, res) => {
  try {
    const records = readJsonArray(assessmentResultsFile);
    const payload = req.body || {};
    const record = normalizeAssessmentResult({
      id: `result_${Date.now()}`,
      movementType: payload.movementType,
      movementName: payload.movementName,
      timestamp: payload.timestamp,
      overallScore: payload.overallScore,
      mobilityScore: payload.mobilityScore,
      stabilityScore: payload.stabilityScore,
      angles: payload.angles,
      recommendations: payload.recommendations,
    });

    records.push(record);
    writeJsonArray(assessmentResultsFile, records);
    ok(res, record);
  } catch {
    fail(res, 500, 'create error');
  }
});

app.get('/api/assessment-results/:id', (req, res) => {
  const records = readJsonArray(assessmentResultsFile);
  const found = records.find((item) => item.id === req.params.id);
  if (!found) {
    return fail(res, 404, 'not found');
  }

  ok(res, normalizeAssessmentResult(found));
});

app.delete('/api/assessment-results/:id', (req, res) => {
  const records = readJsonArray(assessmentResultsFile);
  const next = records.filter((item) => item.id !== req.params.id);
  if (next.length === records.length) {
    return fail(res, 404, 'not found');
  }

  writeJsonArray(assessmentResultsFile, next);
  ok(res, { status: 'ok' });
});

app.get('/api/results', (req, res) => {
  const { page, pageSize } = getPaging(req);
  const records = readJsonArray(assessmentResultsFile)
    .map(normalizeAssessmentResult)
    .map((item) => ({
      id: item.id,
      movementType: item.movementType,
      movementName: item.movementName,
      timestamp: item.timestamp,
      scoreSummary: item.overallScore ? `${item.overallScore.value}/${item.overallScore.maxValue}` : undefined,
      anglesSummary: item.angles || {}
    }))
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

  const paged = paginate(records, page, pageSize);
  ok(res, {
    items: paged.items,
    total: paged.pagination.total,
    page: paged.pagination.page,
    size: paged.pagination.pageSize,
  });
});

app.get('/api/results/:id', (req, res) => {
  const records = readJsonArray(assessmentResultsFile);
  const found = records.find((item) => item.id === req.params.id);
  if (!found) {
    return fail(res, 404, 'not found');
  }

  ok(res, normalizeAssessmentResult(found));
});

app.delete('/api/results/:id', (req, res) => {
  const records = readJsonArray(assessmentResultsFile);
  const next = records.filter((item) => item.id !== req.params.id);
  if (next.length === records.length) {
    return fail(res, 404, 'not found');
  }

  writeJsonArray(assessmentResultsFile, next);
  ok(res, { status: 'ok' });
});

app.get('/api/reports', (req, res) => {
  const { page, pageSize } = getPaging(req);
  const records = readJsonArray(reportsFile)
    .map(normalizeReport)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  ok(res, paginate(records, page, pageSize));
});

app.post('/api/reports', (req, res) => {
  try {
    const records = readJsonArray(reportsFile);
    const payload = req.body || {};
    const record = normalizeReport({
      id: `report_${Date.now()}`,
      patientId: payload.patientId,
      patientName: payload.patientName,
      testId: payload.testId,
      testName: payload.testName || '评估报告',
      date: payload.date,
      score: payload.score,
      status: payload.status,
      summary: payload.summary,
      details: payload.details,
    });

    records.push(record);
    writeJsonArray(reportsFile, records);
    ok(res, record);
  } catch {
    fail(res, 500, 'create error');
  }
});

app.get('/api/reports/:id', (req, res) => {
  const records = readJsonArray(reportsFile);
  const found = records.find((item) => item.id === req.params.id);
  if (!found) {
    return fail(res, 404, 'not found');
  }

  ok(res, normalizeReport(found));
});

app.delete('/api/reports/:id', (req, res) => {
  const records = readJsonArray(reportsFile);
  const next = records.filter((item) => item.id !== req.params.id);
  if (next.length === records.length) {
    return fail(res, 404, 'not found');
  }

  writeJsonArray(reportsFile, next);
  ok(res, { status: 'ok' });
});

app.get('/api/reports/:id/export', (req, res) => {
  const format = String(req.query.format || 'pdf');
  ok(res, { status: 'ok', id: req.params.id, format });
});

app.post('/api/results', (req, res) => {
  try {
    const records = readJsonArray(reportsFile);
    const payload = req.body || {};
    const record = normalizeReport({
      id: `report_${Date.now()}`,
      patientId: payload.patientId,
      patientName: payload.patientName,
      testId: payload.testId,
      testName: payload.testName,
      date: payload.date,
      score: payload.score,
      status: payload.status,
      summary: payload.summary,
      details: payload.details,
    });

    records.push(record);
    writeJsonArray(reportsFile, records);
    ok(res, record);
  } catch {
    fail(res, 500, 'create error');
  }
});

app.get('/api/results/:id/export', (req, res) => {
  const format = String(req.query.format || 'pdf');
  ok(res, { status: 'ok', id: req.params.id, format });
});

app.get('/health', (req, res) => {
  ok(res, { status: 'ok' });
});

app.get('/api/system/stats', (req, res) => {
  const results = readJsonArray(assessmentResultsFile);
  const reports = readJsonArray(reportsFile);
  ok(res, {
    totalAssessmentResults: results.length,
    totalReports: reports.length,
  });
});

app.get('/dashboard/stats', (req, res) => {
  const results = readJsonArray(assessmentResultsFile);
  const reports = readJsonArray(reportsFile);
  const stats = [
    {
      title: '今日评估次数',
      value: String(results.length),
      icon: 'activity',
      bgColor: '#E1F5FE',
      textColor: '#0288D1',
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: '已生成报告',
      value: String(reports.length),
      icon: 'file-text',
      bgColor: '#E8F5E8',
      textColor: '#388E3C',
      trend: {
        value: 2,
        isPositive: true
      }
    },
    {
      title: '完成率',
      value: '85%',
      icon: 'check-circle',
      bgColor: '#FFF3E0',
      textColor: '#F57C00',
      trend: {
        value: 5,
        isPositive: true
      }
    },
    {
      title: '待处理',
      value: '3',
      icon: 'clock',
      bgColor: '#F3E5F5',
      textColor: '#7B1FA2',
      trend: {
        value: 3,
        isPositive: true
      }
    }
  ];

  ok(res, stats);
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Video analysis: http://localhost:${PORT}/api/analyze`);
  console.log(`Assessment results: http://localhost:${PORT}/api/assessment-results`);
  console.log(`Reports: http://localhost:${PORT}/api/reports`);
});

module.exports = app;
