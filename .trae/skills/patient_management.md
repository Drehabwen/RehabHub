# Patient Management Skill

## 技能信息
- **技能名称**: patient_management
- **版本**: 1.0.0
- **描述**: 患者信息管理、康复进度追踪和治疗计划管理
- **分类**: 患者管理

## 功能特性

### 1. 患者信息管理
- 患者注册与档案创建
- 基本信息维护
- 病史记录关联
- 标签分类管理

### 2. 康复进度追踪
- 评估记录关联
- 训练完成度统计
- 目标达成分析
- 进度趋势图表

### 3. 治疗计划管理
- 个性化方案制定
- 阶段目标设定
- 训练任务分配
- 复诊提醒设置

### 4. 患者沟通
- 消息通知发送
- 训练提醒推送
- 随访调查收集
- 反馈收集处理

### 5. 数据分析
- 患者统计分析
- 康复效果评估
- 群体特征分析
- 治疗方案优化

## 使用方法

### 基本用法
create_patient(patient_data)

### 获取患者信息
get_patient(patient_id)
search_patients(filters)

### 更新患者状态
update_patient(patient_id, data)
add_patient_tag(patient_id, tag)

### 康复进度
get_rehab_progress(patient_id)
update_rehab_goal(patient_id, goal_data)

## 输入参数

### create_patient
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | str | 是 | - | 患者姓名 |
| gender | str | 否 | - | 性别 |
| age | int | 否 | - | 年龄 |
| phone | str | 否 | - | 联系电话 |
| email | str | 否 | - | 电子邮箱 |
| diagnosis | str | 否 | - | 诊断 |
| injury_date | str | 否 | - | 受伤日期 |
| therapist_id | str | 否 | - | 负责治疗师 |
| tags | List[str] | 否 | [] | 标签 |

### search_patients
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | str | 否 | - | 患者姓名关键词 |
| status | str | 否 | - | 康复状态 |
| therapist_id | str | 否 | - | 治疗师ID |
| tags | List[str] | 否 | - | 标签筛选 |
| date_from | str | 否 | - | 注册起始日期 |
| date_to | str | 否 | - | 注册结束日期 |
| page | int | 否 | 1 | 页码 |
| page_size | int | 否 | 20 | 每页数量 |

### create_rehab_plan
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_id | str | 是 | - | 患者ID |
| plan_name | str | 是 | - | 计划名称 |
| phases | List[Phase] | 是 | - | 阶段列表 |
| start_date | str | 是 | - | 开始日期 |
| end_date | str | 是 | - | 结束日期 |
| goals | List[str] | 否 | - | 康复目标 |
| notes | str | 否 | - | 备注 |

### add_rehab_task
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_id | str | 是 | - | 患者ID |
| plan_id | str | 是 | - | 计划ID |
| task_type | str | 是 | - | 任务类型 |
| task_name | str | 是 | - | 任务名称 |
| exercise_id | str | 否 | - | 训练动作ID |
| sets | int | 否 | - | 组数 |
| reps | int | 否 | - | 次数 |
| frequency | str | 否 | - | 频率 |
| duration | int | 否 | - | 时长（分钟） |

## 输出格式

### 患者档案
`	ypescript
interface PatientProfile {
  patient_id: string;
  name: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  phone?: string;
  email?: string;
  avatar?: string;
  
  medical_info: {
    diagnosis?: string;
    injury_date?: string;
    surgery_history?: string[];
    comorbidities?: string[];
    allergy_history?: string[];
  };
  
  rehab_status: {
    current_phase: string;
    start_date: string;
    total_sessions: number;
    completed_sessions: number;
    overall_score: number;
    progress_trend: 'up' | 'flat' | 'down';
  };
  
  therapist: {
    therapist_id: string;
    name: string;
  };
  
  tags: string[];
  notes?: string;
  created_at: datetime;
  updated_at: datetime;
}
`

### 康复进度
`	ypescript
interface RehabProgress {
  patient_id: string;
  period: {
    start: string;
    end: string;
  };
  
  assessment_summary: {
    total_assessments: number;
    latest_score: number;
    score_change: number;
    strongest_area: string;
    weakest_area: string;
  };
  
  training_summary: {
    total_tasks: number;
    completed_tasks: number;
    compliance_rate: number;
    average_duration: number;
  };
  
  goal_achievement: {
    goals: {
      name: string;
      target: string;
      current: number;
      progress: number;
      status: 'achieved' | 'in_progress' | 'delayed';
    }[];
    overall_progress: number;
  };
  
  progress_charts: {
    score_trend: ChartData;
    compliance_trend: ChartData;
  };
}
`

### 康复计划
`	ypescript
interface RehabPlan {
  plan_id: string;
  patient_id: string;
  plan_name: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  
  phases: {
    phase_id: string;
    name: string;
    duration_weeks: number;
    goals: string[];
    exercises: RehabExercise[];
    assessments: string[];
  }[];
  
  current_phase?: string;
  start_date: string;
  expected_end_date: string;
  actual_end_date?: string;
  
  created_by: string;
  created_at: datetime;
  updated_at: datetime;
}

interface RehabExercise {
  exercise_id: string;
  name: string;
  description: string;
  video_url?: string;
  sets: number;
  reps: number;
  frequency: string;
  rest_seconds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  target_muscles: string[];
  precautions: string[];
}
`

## 使用示例

### 示例一：创建新患者
`	ypescript
const newPatient = await create_patient({
  name: '李四',
  gender: 'male',
  age: 42,
  phone: '13800138000',
  diagnosis: '前交叉韧带重建术后',
  injury_date: '2024-01-15',
  therapist_id: 'T001',
  tags: ['ACL', '运动员']
});

console.log('患者ID:', newPatient.patient_id);
`

### 示例二：搜索患者
`	ypescript
const patients = await search_patients({
  status: 'active',
  therapist_id: 'T001',
  tags: ['ACL'],
  page: 1,
  page_size: 10
});

for (const p of patients.list) {
  console.log(p.name, p.rehab_status.current_phase);
}
`

### 示例三：查看康复进度
`	ypescript
const progress = await get_rehab_progress({
  patient_id: 'P001',
  period: 'month'
});

console.log('整体评分:', progress.assessment_summary.latest_score);
console.log('评分变化:', progress.assessment_summary.score_change);
console.log('训练依从率:', progress.training_summary.compliance_rate);
`

### 示例四：创建康复计划
`	ypescript
const plan = await create_rehab_plan({
  patient_id: 'P001',
  plan_name: 'ACL术后康复计划',
  start_date: '2024-02-01',
  end_date: '2024-08-01',
  goals: ['恢复正常步态', '恢复膝关节活动度', '恢复肌力'],
  phases: [
    {
      name: '保护期',
      duration_weeks: 6,
      goals: ['保护修复组织', '控制肿胀', '早期活动度'],
      exercises: [
        {
          exercise_id: 'E001',
          name: '踝泵练习',
          sets: 3,
          reps: 20,
          frequency: '每日',
          difficulty: 'easy',
          target_muscles: ['小腿肌群']
        }
      ]
    },
    {
      name: '强化期',
      duration_weeks: 8,
      goals: ['恢复正常活动度', '增强肌力'],
      exercises: []
    }
  ]
});
`

## 患者状态

### 康复状态
| 状态 | 标识符 | 说明 |
|------|--------|------|
| 新患者 | new | 刚注册，尚未开始康复 |
| 进行中 | active | 正在积极康复中 |
| 暂停 | paused | 暂时中断康复 |
| 已完成 | completed | 康复目标已达成 |
| 跟进中 | follow_up | 进入随访阶段 |

### 标签系统
| 标签类型 | 示例 |
|----------|------|
| 诊断标签 | 'ACL损伤', '腰椎间盘突出' |
| 训练标签 | '居家训练', '门诊训练' |
| 特殊标签 | 'VIP', '运动员', '老年人' |
| 状态标签 | '高风险', '需关注' |

## 进度追踪指标

### 评估指标
- FMS总分
- 关节活动度（ROM）
- 肌力等级
- 平衡能力
- 动作质量评分

### 训练指标
- 训练完成率
- 训练频率
- 训练时长
- 动作正确率
- 疼痛反馈

### 目标类型
| 类型 | 说明 |
|------|------|
| 短期目标 | 1-4周可达成 |
| 中期目标 | 1-3个月达成 |
| 长期目标 | 3-6个月达成 |
| 最终目标 | 康复毕业标准 |

## 数据分析

### 患者统计
`	ypescript
interface PatientStatistics {
  total_patients: number;
  active_patients: number;
  new_this_month: number;
  completed_this_month: number;
  
  age_distribution: { range: string; count: number }[];
  diagnosis_distribution: { diagnosis: string; count: number }[];
  status_distribution: { status: string; count: number }[];
  
  average_compliance: number;
  average_score_improvement: number;
  average_rehab_duration: number;
}
`

### 效果分析
- 康复达标率
- 平均康复周期
- 各诊断康复效果对比
- 治疗方案效果评估

## 注意事项

### 数据隐私
- 遵守个人信息保护法
- 敏感信息加密存储
- 访问权限严格控制
- 数据访问日志记录

### 数据完整性
- 必填字段完整录入
- 定期更新患者信息
- 及时记录评估结果
- 保持数据一致性

### 沟通规范
- 及时回复患者咨询
- 训练指导清晰准确
- 保护患者隐私
- 建立信任关系

## 与其他模块的集成

### 评估模块
- 自动关联评估记录
- 评估结果更新进度
- 历史数据对比

### 病历模块
- 病历与患者关联
- 评估报告附加
- 治疗记录同步

### 报告模块
- 患者进度报告
- 群体分析报告
- 效果评估报告

### 训练模块
- 训练任务下发
- 完成情况追踪
- 训练效果反馈

## 批量操作

### 批量标签
`	ypescript
await batch_add_tag({
  patient_ids: ['P001', 'P002', 'P003'],
  tag: '需要关注',
  reason: '康复进度滞后'
});
`

### 批量分配
`	ypescript
await batch_assign_therapist({
  patient_ids: ['P001', 'P002'],
  therapist_id: 'T002',
  reason: '原治疗师休假'
});
`

### 数据导出
`	ypescript
await export_patients({
  therapist_id: 'T001',
  status: 'active',
  format: 'csv',
  fields: ['name', 'phone', 'diagnosis', 'current_phase']
});
`
