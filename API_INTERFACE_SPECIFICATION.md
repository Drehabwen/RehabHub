# 前后端接口规范文档

## 概述
本文档定义了前端（React + TypeScript）与Python后端之间的API接口规范，确保前后端开发团队能够高效协作。

## 基础约定

### 1. 通用规则
- **API版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时区**: UTC
- **日期格式**: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

### 2. HTTP状态码
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `422` - 业务逻辑错误
- `500` - 服务器内部错误

### 3. 响应格式
```typescript
interface BaseResponse<T> {
  code: number;      // 业务状态码
  message: string;   // 消息描述
  data: T;          // 业务数据
  timestamp: string; // 响应时间戳
}

interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;    // 当前页码
    pageSize: number; // 每页数量
    total: number;   // 总记录数
    totalPages: number; // 总页数
  };
}
```

## 认证与授权

### 1. 用户认证
```typescript
// 登录请求
interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'therapist' | 'patient';
  };
}
```

**API端点**:
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新令牌
- `POST /api/v1/auth/logout` - 用户登出

## 视频分析模块

### 1. 视频上传与分析
```typescript
// 请求接口
interface VideoAnalysisRequest {
  video: File;                    // 视频文件
  movement_type: string;          // 动作类型
  patient_id?: string;            // 患者ID（可选）
  session_id?: string;            // 会话ID（可选）
  analysis_config?: {
    quality_threshold?: number;   // 质量阈值
    frame_rate?: number;          // 帧率设置
    // 其他分析配置
  };
}

// 响应接口
interface VideoAnalysisResponse {
  analysis_id: string;           // 分析ID
  status: 'processing' | 'completed' | 'failed';
  score: number;                 // 评分
  feedback: string;              // 反馈信息
  reason: string;               // 评分原因
  angles: Record<string, number>; // 角度数据
  processing_time: string;       // 处理时间
  keypoints_detected: boolean;   // 关键点检测状态
  annotated_image?: string;       // 标注图像（base64）
  details: Record<string, unknown>; // 详细数据
  timestamp: string;            // 分析时间
  keypoints?: Keypoint[];       // 关键点数据
}
```

**API端点**:
- `POST /api/v1/video/analyze` - 视频分析
- `GET /api/v1/video/analysis/{analysis_id}` - 获取分析结果
- `GET /api/v1/video/analysis/{analysis_id}/progress` - 获取分析进度

### 2. 分析历史记录
```typescript
interface AnalysisHistoryItem {
  id: string;
  patient_name: string;
  movement_type: string;
  score: number;
  analysis_date: string;
  video_thumbnail?: string;      // 视频缩略图
  status: 'completed' | 'failed';
}

interface AnalysisHistoryRequest {
  page?: number;
  pageSize?: number;
  patient_id?: string;
  movement_type?: string;
  date_from?: string;
  date_to?: string;
}
```

**API端点**:
- `GET /api/v1/video/history` - 获取分析历史（分页）
- `GET /api/v1/video/history/{record_id}` - 获取历史记录详情
- `DELETE /api/v1/video/history/{record_id}` - 删除历史记录

## 患者管理模块

### 1. 患者信息
```typescript
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  contact_info: {
    phone?: string;
    email?: string;
    address?: string;
  };
  medical_history?: string;
  created_at: string;
  updated_at: string;
}

interface CreatePatientRequest {
  name: string;
  age: number;
  gender: 'male' | 'female';
  contact_info?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  medical_history?: string;
}
```

**API端点**:
- `GET /api/v1/patients` - 获取患者列表（分页）
- `POST /api/v1/patients` - 创建患者
- `GET /api/v1/patients/{patient_id}` - 获取患者详情
- `PUT /api/v1/patients/{patient_id}` - 更新患者信息
- `DELETE /api/v1/patients/{patient_id}` - 删除患者

### 2. 患者评估记录
```typescript
interface PatientAssessment {
  id: string;
  patient_id: string;
  movement_type: string;
  assessment_date: string;
  score: number;
  details: Record<string, unknown>;
  video_url?: string;           // 视频文件URL
  therapist_notes?: string;     // 治疗师备注
}
```

**API端点**:
- `GET /api/v1/patients/{patient_id}/assessments` - 获取患者评估记录
- `POST /api/v1/patients/{patient_id}/assessments` - 添加评估记录

## 动作评估模块

### 1. 支持的动作类型
```typescript
interface MovementType {
  id: string;
  name: string;           // 动作名称（中文）
  english_name: string;  // 动作英文名称
  description: string;   // 动作描述
  scoring_criteria: string[]; // 评分标准
  difficulty: 'easy' | 'medium' | 'hard';
  body_parts: string[]; // 涉及的身体部位
}
```

**API端点**:
- `GET /api/v1/movements` - 获取所有支持的动作类型
- `GET /api/v1/movements/{movement_id}` - 获取特定动作详情

### 2. 实时分析（WebSocket）
```typescript
// WebSocket消息格式
interface RealTimeAnalysisMessage {
  type: 'start' | 'frame' | 'result' | 'error';
  session_id: string;
  data: {
    frame_data?: string;        // 帧数据
    keypoints?: Keypoint[];     // 实时关键点
    score?: number;             // 实时评分
    feedback?: string;          // 实时反馈
  };
}
```

**WebSocket端点**:
- `ws://localhost:8000/api/v1/realtime/analysis` - 实时分析连接

## 系统管理模块

### 1. 系统配置
```typescript
interface SystemConfig {
  video_quality: 'low' | 'medium' | 'high';
  analysis_speed: 'fast' | 'balanced' | 'accurate';
  auto_save: boolean;
  language: 'zh' | 'en';
  theme: 'light' | 'dark';
}
```

**API端点**:
- `GET /api/v1/system/config` - 获取系统配置
- `PUT /api/v1/system/config` - 更新系统配置

### 2. 数据统计
```typescript
interface SystemStats {
  total_patients: number;
  total_assessments: number;
  average_score: number;
  assessments_by_movement: Record<string, number>;
  recent_activity: {
    date: string;
    count: number;
  }[];
}
```

**API端点**:
- `GET /api/v1/system/stats` - 获取系统统计

## 错误处理规范

### 1. 错误响应格式
```typescript
interface ErrorResponse {
  code: number;
  message: string;
  details?: {
    field?: string;      // 错误字段
    reason?: string;    // 具体原因
    suggestion?: string; // 解决建议
  }[];
  timestamp: string;
}
```

### 2. 常见错误码
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 1001 | 视频文件格式不支持 | 请上传MP4、MOV或AVI格式 |
| 1002 | 视频文件过大 | 文件大小不能超过100MB |
| 1003 | 视频质量过低 | 请上传更高分辨率的视频 |
| 2001 | 患者不存在 | 检查患者ID是否正确 |
| 3001 | 动作类型不支持 | 检查动作类型参数 |

## 前端适配建议

### 1. API客户端配置
```typescript
// 环境配置
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retryCount: 3,
  retryDelay: 1000
};

// 请求拦截器（添加认证token）
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器（统一错误处理）
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. 类型定义同步
建议将接口规范中的TypeScript类型定义同步到前端项目中，确保类型安全。

## 测试与验证

### 1. API测试清单
- [ ] 视频上传功能测试
- [ ] 分析结果获取测试
- [ ] 患者管理CRUD测试
- [ ] 认证授权测试
- [ ] 错误处理测试
- [ ] 性能压力测试

### 2. 集成测试
建议使用Postman或类似的API测试工具创建测试集合，确保所有接口正常工作。

## 版本管理

### 1. API版本策略
- 主版本号：重大不兼容变更
- 次版本号：新增功能，向后兼容
- 修订版本号：Bug修复

### 2. 弃用策略
- 旧版本API至少保留6个月
- 提前3个月通知客户端升级
- 提供详细的迁移指南

## 部署与监控

### 1. 健康检查
- `GET /health` - 服务健康状态
- `GET /metrics` - 服务指标监控

### 2. 日志规范
- 记录所有API请求和响应
- 记录错误和异常信息
- 记录性能指标

---

**文档版本**: v1.0  
**最后更新**: 2024-12-19  
**维护团队**: 前后端开发团队