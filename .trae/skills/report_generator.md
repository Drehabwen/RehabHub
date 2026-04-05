# Report Generator Skill

## 技能信息
- **技能名称**: report_generator
- **版本**: 1.0.0
- **描述**: 生成康复评估报告、训练方案和进度追踪报告
- **分类**: 报告生成

## 功能特性

### 1. 评估报告生成
- 动作评估结果汇总
- 评分与等级评定
- 详细数据分析
- 问题点标注

### 2. 康复方案生成
- 个性化训练计划
- 阶段性目标设定
- 注意事项提醒
- 训练动作库

### 3. 进度报告生成
- 康复趋势分析
- 周期对比图表
- 目标达成率
- 建议调整方案

### 4. 报告导出
- PDF格式导出
- JSON数据导出
- 打印友好格式
- 多语言支持

## 使用方法

### 基本用法
generate_assessment_report(assessment_data)

### 完整康复报告
generate_rehab_report(patient_id, report_type)

### 进度追踪
generate_progress_report(patient_id, date_range)

## 输入参数

### generate_assessment_report
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| assessment_id | str | 是 | - | 评估记录ID |
| patient_info | dict | 是 | - | 患者基本信息 |
| movement_type | str | 是 | - | 动作类型 |
| score | number | 是 | - | 综合评分 |
| angles | dict | 否 | - | 角度数据 |
| feedback | str | 是 | - | 评估反馈 |
| recommendations | list | 否 | - | 改进建议 |

### generate_rehab_report
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_id | str | 是 | - | 患者ID |
| report_type | str | 否 | 'weekly' | 报告类型 |
| start_date | str | 否 | 7天前 | 开始日期 |
| end_date | str | 否 | 当前日期 | 结束日期 |
| include_exercises | bool | 否 | True | 包含训练方案 |
| include_charts | bool | 否 | True | 包含图表 |

### generate_progress_report
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_id | str | 是 | - | 患者ID |
| period | str | 否 | 'month' | 时间周期 |
| metrics | list | 否 | ['score', 'rom', 'strength'] | 追踪指标 |
| compare_baseline | bool | 否 | True | 基准对比 |

## 输出格式

### 评估报告结构
`	ypescript
interface AssessmentReport {
  report_id: string;
  report_type: 'assessment';
  title: string;
  generated_at: datetime;
  
  patient_info: {
    patient_id: string;
    patient_name: string;
    age?: number;
  };
  
  assessment_summary: {
    movement_type: string;
    assessment_date: string;
    overall_score: number;
    score_grade: 'excellent' | 'good' | 'fair' | 'poor';
    completion_status: 'completed' | 'partial' | 'incomplete';
  };
  
  angle_analysis: {
    left_knee_angle: number;
    right_knee_angle: number;
    hip_angle?: number;
    shoulder_angle?: number;
    comparison_with_normal: {
      joint: string;
      normal_range: [number, number];
      actual: number;
      status: 'normal' | 'abnormal';
    }[];
  };
  
  key_findings: {
    strengths: string[];
    concerns: string[];
    risk_factors: string[];
  };
  
  recommendations: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  
  next_assessment: string;
}
`

### 康复报告结构
`	ypescript
interface RehabReport {
  report_id: string;
  report_type: 'rehab';
  period: {
    start: string;
    end: string;
    total_days: number;
  };
  
  progress_summary: {
    overall_improvement: number;
    current_phase: string;
    goal_achievement_rate: number;
  };
  
  training_summary: {
    total_sessions: number;
    completed_sessions: number;
    compliance_rate: number;
    average_score: number;
  };
  
  phase_plan: {
    current_phase: {
      name: string;
      duration: string;
      goals: string[];
      exercises: Exercise[];
    };
    next_phase?: {
      name: string;
      expected_date: string;
    };
  };
  
  recommendations: {
    training_adjustments: string[];
    lifestyle_modifications: string[];
    follow_up_schedule: string;
  };
}

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  frequency: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  target_muscles: string[];
  precautions: string[];
}
`

### 进度报告结构
`	ypescript
interface ProgressReport {
  report_id: string;
  report_type: 'progress';
  
  period: string;
  generated_at: datetime;
  
  metrics_comparison: {
    metric: string;
    baseline: number;
    current: number;
    change: number;
    change_percentage: number;
    trend: 'improving' | 'stable' | 'declining';
  }[];
  
  trend_analysis: {
    score_trend: 'up' | 'down' | 'flat';
    strength_trend: 'up' | 'down' | 'flat';
    mobility_trend: 'up' | 'down' | 'flat';
  };
  
  achievements: {
    milestones_reached: string[];
    scores_achieved: {
      date: string;
      score: number;
      assessment_type: string;
    }[];
  };
  
  areas_for_improvement: string[];
  
  next_goals: {
    short_term: { metric: string; target: string; deadline: string };
    long_term: { metric: string; target: string; deadline: string };
  };
}
`

## 使用示例

### 示例一：生成单次评估报告
`	ypescript
const report = await generate_assessment_report({
  assessment_id: 'A001',
  patient_info: {
    patient_id: 'P001',
    patient_name: '张三',
    age: 35
  },
  movement_type: 'deep_squat',
  score: 85,
  angles: {
    left_knee_angle: 95,
    right_knee_angle: 98
  },
  feedback: '深蹲动作规范，核心控制良好',
  recommendations: ['继续加强核心稳定性训练', '增加髋关节灵活性练习']
});

console.log('报告标题:', report.title);
console.log('评分等级:', report.assessment_summary.score_grade);
`

### 示例二：生成周康复报告
`	ypescript
const weeklyReport = await generate_rehab_report({
  patient_id: 'P001',
  report_type: 'weekly',
  include_exercises: true,
  include_charts: true
});

console.log('完成训练次数:', weeklyReport.training_summary.compliance_rate);
console.log('当前阶段:', weeklyReport.phase_plan.current_phase.name);
`

### 示例三：生成月进度报告
`	ypescript
const progressReport = await generate_progress_report({
  patient_id: 'P001',
  period: 'month',
  metrics: ['score', 'rom', 'strength']
});

for (const metric of progressReport.metrics_comparison) {
  console.log(metric.metric, ':', metric.change_percentage, '%');
}
`

## 报告类型

### 评估报告 (Assessment Report)
| 场景 | 用途 |
|------|------|
| 单次评估后 | 记录当次评估结果 |
| 阶段评估 | 某一阶段的康复评估 |
| 初始评估 | 患者入组时的基线评估 |

### 康复报告 (Rehab Report)
| 周期 | 用途 |
|------|------|
| 周报告 | 每周训练总结 |
| 月报告 | 每月康复进度总结 |
| 阶段报告 | 每个康复阶段的总结 |

### 进度报告 (Progress Report)
| 类型 | 用途 |
|------|------|
| 趋势分析 | 长期数据趋势展示 |
| 对比报告 | 与基线数据对比 |
| 目标追踪 | 目标达成情况 |

## 评分等级说明

| 等级 | 分数范围 | 说明 |
|------|----------|------|
| 优秀 | 90-100 | 动作标准，无异常 |
| 良好 | 75-89 | 基本达标，轻微偏差 |
| 一般 | 60-74 | 部分偏差，需要改进 |
| 较差 | <60 | 明显问题，需重点训练 |

## 图表生成

### 支持的图表类型
- **折线图**: 进度趋势变化
- **柱状图**: 多维度对比
- **雷达图**: 综合能力评估
- **饼图**: 训练完成率分布

### 图表配置
`	ypescript
const chartConfig = {
  type: 'line',
  title: '康复进度趋势',
  xAxis: 'date',
  yAxis: 'score',
  data: progressData,
  colors: ['#4CAF50', '#2196F3', '#FF9800']
};
`

## 导出格式

### PDF导出
`	ypescript
await exportToPdf({
  report_id: 'R001',
  template: 'standard',
  orientation: 'portrait',
  include_charts: true,
  watermark: 'CONFIDENTIAL'
});
`

### JSON导出
`	ypescript
await exportToJson({
  report_id: 'R001',
  include_raw_data: true,
  anonymize: true
});
`

## 注意事项

### 数据准确性
- 确保评估数据完整
- 校验分数计算逻辑
- 确认患者信息正确
- 审核报告内容

### 隐私保护
- 导出时脱敏处理
- 权限控制导出操作
- 记录导出日志
- 定期清理临时文件

### 性能优化
- 大数据量分批处理
- 图表异步渲染
- 报告缓存机制
- 模板预编译

## 与其他模块的集成

### 评估模块集成
- 自动获取评估数据
- 关联历史评估记录
- 合并多次评估结果

### 病历模块集成
- 报告附加到病历
- 同步患者信息
- 归档历史报告

### 图表模块集成
- 集成数据可视化
- 支持图表定制
- 导出高清图片
