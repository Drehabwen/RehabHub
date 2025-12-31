# 量表评估模块API接口规范文档

## 概述
本文档定义了量表评估模块的API接口规范，包括VAS疼痛量表、Oswestry功能障碍指数、SF-36健康调查问卷和TUG行走测试等常用康复评估量表。

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
- `404` - 资表不存在
- `422` - 业务逻辑错误
- `500` - 服务器内部错误

### 3. 响应格式
``typescript
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

## 量表评估模块

### 1. 量表类型定义
``typescript
// 量表类型枚举
type ScaleType = 'VAS' | 'OSWESTRY' | 'SF36' | 'TUG';

// 量表基本信息
interface ScaleInfo {
  id: string;              // 量表ID
  type: ScaleType;         // 量表类型
  name: string;            // 量表名称
  description: string;     // 量表描述
  version: string;         // 量表版本
  questions_count: number; // 题目数量
  completion_time: string; // 预计完成时间
  scoring_method: string;  // 计分方法说明
}

// 量表题目
interface ScaleQuestion {
  id: string;              // 题目ID
  scale_id: string;        // 所属量表ID
  question_number: number; // 题号
  content: string;         // 题目内容
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text_input' | 'numerical'; // 题目类型
  options?: Array<{
    value: string | number; // 选项值
    label: string;          // 选项标签
    score?: number;         // 选项得分
  }>;
  required: boolean;       // 是否必答
  help_text?: string;      // 帮助文本
}
```

**API端点**:
- `GET /api/v1/scales` - 获取所有支持的量表类型
- `GET /api/v1/scales/{scale_id}` - 获取特定量表详情
- `GET /api/v1/scales/{scale_id}/questions` - 获取量表的所有题目

### 2. 量表评估记录
``typescript
// 量表评估记录
interface ScaleAssessment {
  id: string;                     // 评估ID
  patient_id: string;             // 患者ID
  scale_type: ScaleType;          // 量表类型
  scale_id: string;               // 量表ID
  assessment_date: string;        // 评估日期
  assessor_id: string;            // 评估人员ID
  scores: Array<{
    question_id: string;          // 题目ID
    answer: string | number | Array<string | number>; // 回答
    score?: number;               // 得分（如适用）
  }>;
  total_score?: number;           // 总分（如适用）
  interpretation?: string;        // 结果解释
  recommendations?: string[];     // 建议
  notes?: string;                 // 备注
  status: 'draft' | 'completed' | 'cancelled'; // 状态
  created_at: string;             // 创建时间
  updated_at: string;             // 更新时间
}

// 创建量表评估请求
interface CreateScaleAssessmentRequest {
  patient_id: string;             // 患者ID
  scale_type: ScaleType;          // 量表类型
  scale_id: string;               // 量表ID
  scores: Array<{
    question_id: string;          // 题目ID
    answer: string | number | Array<string | number>; // 回答
  }>;
  notes?: string;                 // 备注
}

// 更新量表评估请求
interface UpdateScaleAssessmentRequest {
  scores?: Array<{
    question_id: string;          // 题目ID
    answer: string | number | Array<string | number>; // 回答
  }>;
  notes?: string;                 // 备注
  status?: 'draft' | 'completed' | 'cancelled'; // 状态
}
```

**API端点**:
- `GET /api/v1/scale-assessments` - 获取量表评估记录列表（分页）
- `POST /api/v1/scale-assessments` - 创建新的量表评估记录
- `GET /api/v1/scale-assessments/{assessment_id}` - 获取特定评估记录详情
- `PUT /api/v1/scale-assessments/{assessment_id}` - 更新评估记录
- `DELETE /api/v1/scale-assessments/{assessment_id}` - 删除评估记录

### 3. 量表评估历史记录
``typescript
// 量表评估历史记录项
interface ScaleAssessmentHistoryItem {
  id: string;                     // 评估ID
  patient_id: string;             // 患者ID
  patient_name: string;           // 患者姓名
  scale_type: ScaleType;          // 量表类型
  scale_name: string;             // 量表名称
  assessment_date: string;        // 评估日期
  total_score?: number;           // 总分
  status: 'draft' | 'completed' | 'cancelled'; // 状态
}

// 量表评估历史记录查询请求
interface ScaleAssessmentHistoryRequest {
  page?: number;
  pageSize?: number;
  patient_id?: string;
  scale_type?: ScaleType;
  date_from?: string;
  date_to?: string;
  status?: 'draft' | 'completed' | 'cancelled';
}
```

**API端点**:
- `GET /api/v1/scale-assessments/history` - 获取量表评估历史记录（分页）
- `GET /api/v1/patients/{patient_id}/scale-assessments` - 获取特定患者的量表评估记录

## 各类量表详细定义

### 1. VAS疼痛量表 (Visual Analog Scale)
``typescript
// VAS量表定义
interface VASScale extends ScaleInfo {
  type: 'VAS';
  min_value: number;  // 最小值（默认0）
  max_value: number;  // 最大值（默认10）
  labels: {
    min: string;      // 最小值标签（如"无痛"）
    max: string;      // 最大值标签（如"剧痛"）
  };
}

// VAS评估记录
interface VASAssessment extends ScaleAssessment {
  scale_type: 'VAS';
  scores: [{
    question_id: string;
    answer: number;    // 0-10之间的数值
    score: number;     // 与answer相同
  }];
  total_score: number; // 与answer相同
}
```

### 2. Oswestry功能障碍指数 (Oswestry Disability Index)
``typescript
// Oswestry量表定义
interface OswestryScale extends ScaleInfo {
  type: 'OSWESTRY';
  sections: Array<{
    id: string;
    title: string;
    questions: ScaleQuestion[];
  }>;
}

// Oswestry评估记录
interface OswestryAssessment extends ScaleAssessment {
  scale_type: 'OSWESTRY';
  total_score: number;      // 总分（0-100）
  disability_level: 'minimal' | 'moderate' | 'severe' | 'crippled'; // 障碍等级
}
```

### 3. SF-36健康调查问卷 (Short Form 36 Health Survey)
``typescript
// SF-36量表定义
interface SF36Scale extends ScaleInfo {
  type: 'SF36';
  dimensions: Array<{
    id: string;
    name: string;
    description: string;
    questions: ScaleQuestion[];
  }>;
}

// SF-36评估记录
interface SF36Assessment extends ScaleAssessment {
  scale_type: 'SF36';
  dimension_scores: Record<string, number>; // 各维度得分
  total_score: number;                     // 总分
  health_status: 'excellent' | 'very_good' | 'good' | 'fair' | 'poor'; // 健康状况评价
}
```

### 4. TUG行走测试 (Timed Up and Go Test)
``typescript
// TUG量表定义
interface TUGScale extends ScaleInfo {
  type: 'TUG';
  instructions: string[];        // 测试说明
  safety_requirements: string[]; // 安全要求
}

// TUG评估记录
interface TUGAssessment extends ScaleAssessment {
  scale_type: 'TUG';
  scores: [{
    question_id: string;
    answer: number;              // 完成时间（秒）
    score: number;               // 与answer相同
  }];
  total_score: number;           // 完成时间（秒）
  risk_level: 'normal' | 'moderate_risk' | 'high_risk'; // 跌倒风险等级
  assistance_required: boolean;  // 是否需要协助
}
```

## 错误处理规范

### 1. 错误响应格式
``typescript
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
| 5001 | 量表不存在 | 检查量表ID是否正确 |
| 5002 | 量表评估记录不存在 | 检查评估记录ID是否正确 |
| 5003 | 量表题目回答不完整 | 确保所有必答题都已回答 |
| 5004 | 数值超出有效范围 | 检查输入数值是否在允许范围内 |
| 5005 | 患者不存在 | 检查患者ID是否正确 |

## 前端适配建议

### 1. API客户端配置
``typescript
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
- [ ] 量表列表获取测试
- [ ] 量表题目获取测试
- [ ] 量表评估创建测试
- [ ] 量表评估更新测试
- [ ] 量表评估历史记录查询测试
- [ ] 各类量表特殊字段验证测试
- [ ] 错误处理测试
- [ ] 性能压力测试

### 2. 集成测试
建议使用Postman或类似的API测试工具创建测试集合，确保所有接口正常工作。

---
**文档版本**: v1.0  
**最后更新**: 2024-12-19  
**维护团队**: 前后端开发团队