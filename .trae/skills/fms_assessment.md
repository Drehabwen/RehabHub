# FMS Assessment Skill

## 技能信息
- **技能名称**: fms_assessment
- **版本**: 1.0.0
- **描述**: 功能动作筛查（FMS）评估、评分规则管理和训练建议生成
- **分类**: 运动评估

## 功能特性

### 1. FMS七项评估
- 深蹲（Squat）
- 跨栏步（Hurdle Step）
- 直线弓步蹲（Inline Lunge）
- 肩部灵活性（Shoulder Mobility）
- 主动直腿抬（Active Straight Leg Raise）
- 躯干稳定性俯卧撑（Trunk Stability Pushup）
- 旋转稳定性测试（Rotary Stability）

### 2. 评分系统
- 三分制评分（0-1-2-3）
- 疼痛检测与处理
- 不对称性记录
- 总分计算与等级划分

### 3. 动作分析
- 关键点检测
- 角度计算
- 规范性判断
- 异常姿态识别

### 4. 训练建议
- 基于评分的个性化建议
- 针对性训练动作推荐
- 进阶与降阶指导
- 康复周期规划

### 5. 历史追踪
- 历史评分对比
- 进步趋势分析
- 训练效果评估
- 目标达成追踪

## 使用方法

### 基本用法
assess_fms(movement_type, keypoints)

### 完整FMS评估
run_fms_assessment(patient_id, options)

### 评分查询
get_fms_score(assessment_id)
get_fms_history(patient_id)

## 输入参数

### assess_fms
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| movement_type | str | 是 | - | FMS动作类型 |
| keypoints | List[Keypoint] | 是 | - | 姿态关键点数据 |
| side | str | 否 | 'both' | 测试侧（left/right/both） |
| strict_mode | bool | 否 | False | 严格评分模式 |
| detect_pain | bool | 否 | True | 启用疼痛检测 |

### run_fms_assessment
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_id | str | 是 | - | 患者ID |
| assessment_items | List[str] | 否 | 全部七项 | 评估项目列表 |
| record_video | bool | 否 | False | 录制视频 |
| save_to_history | bool | 否 | True | 保存到历史记录 |

### get_fms_history
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_id | str | 是 | - | 患者ID |
| start_date | str | 否 | 30天前 | 开始日期 |
| end_date | str | 否 | 当前日期 | 结束日期 |
| include_details | bool | 否 | False | 包含详细数据 |

## 输出格式

### FMS评估响应
`	ypescript
interface FMSAssessmentResponse {
  assessment_id: string;
  patient_id: string;
  assessment_date: string;
  total_score: number;           // 总分（0-21）
  total_possible: number;        // 满分（21）
  score_grade: 'excellent' | 'good' | 'fair' | 'poor' | 'risk';
  risk_level: 'low' | 'medium' | 'high';
  
  items: {
    movement_type: string;
    movement_name: string;
    score: number;               // 0-3分
    left_score?: number;         // 左侧评分
    right_score?: number;        // 右侧评分
    asymmetric: boolean;         // 是否不对称
    pain_detected: boolean;      // 是否疼痛
    compensation: string[];      // 代偿动作
    angle_analysis?: {
      joint: string;
      angle: number;
      normal_range: [number, number];
      status: 'normal' | 'abnormal';
    }[];
    feedback: string;            // 即时反馈
    recommendations: string[];   // 改进建议
  }[];
  
  summary: {
    strongest_movement: string;
    weakest_movement: string;
    asymmetries: string[];
    focus_areas: string[];
  };
  
  next_assessment: string;
}
`

### 评分等级定义
`	ypescript
interface ScoreGrade {
  grade: 'excellent' | 'good' | 'fair' | 'poor' | 'risk';
  score_range: [number, number];
  description: string;
  recommendation: string;
}
`

## FMS七项详解

### 1. 深蹲（Squat）
| 评分 | 标准 |
|------|------|
| 3分 | 髋关节低于膝关节，躯干平行小腿，杠铃片过杆 |
| 2分 | 髋关节低于膝关节，或躯干平行小腿，或杠铃片不过杆 |
| 1分 | 髋关节不低于膝关节 |
| 0分 | 疼痛 |

**关键角度**：
- 髋关节角度：<90为优秀
- 膝关节角度：<100为优秀
- 躯干与小腿角度：平行或接近

### 2. 跨栏步（Hurdle Step）
| 评分 | 标准 |
|------|------|
| 3分 | 髋膝踝三点保持水平，躯干稳定，无支撑 |
| 2分 | 髋膝踝轻微偏移，或躯干轻微晃动 |
| 1分 | 明显失去平衡，支撑脚移动 |
| 0分 | 疼痛 |

**测试要点**：
- 左右侧分别测试
- 栏架高度：胫骨粗隆高度
- 记录两侧最低分

### 3. 直线弓步蹲（Inline Lunge）
| 评分 | 标准 |
|------|------|
| 3分 | 后膝触地，前膝<90，躯干稳定 |
| 2分 | 后膝不触地，前膝<90，或躯干晃动 |
| 1分 | 失去平衡，无法完成动作 |
| 0分 | 疼痛 |

**步距测量**：
- 前后脚距离等于胫骨长度
- 脚跟连成直线

### 4. 肩部灵活性（Shoulder Mobility）
| 评分 | 标准 |
|------|------|
| 3分 | 拳头过中线，且手腕超过肩关节线 |
| 2分 | 拳头过中线，或手腕超过肩关节线 |
| 1分 | 拳头不过中线 |
| 0分 | 疼痛 |

**测量方法**：
- 测量拳头与肩关节线的距离
- 记录两侧分数

### 5. 主动直腿抬（Active Straight Leg Raise）
| 评分 | 标准 |
|------|------|
| 3分 | 膝关节超过髂骨上棘与膝关节水平线 |
| 2分 | 膝关节低于水平线，但超过腘窝 |
| 1分 | 膝关节不超过腘窝 |
| 0分 | 疼痛 |

**参考值**：
- 正常活动度：髋屈曲70-80
- 优秀：>70
- 及格：50-70

### 6. 躯干稳定性俯卧撑（Trunk Stability Pushup）
| 评分 | 标准 |
|------|------|
| 3分 | 完成标准俯卧撑，无躯干旋转或晃动 |
| 2分 | 能完成男（10个）或女（20个）俯卧撑 |
| 1分 | 无法完成上述动作，但能推起身体 |
| 0分 | 疼痛 |

**降阶测试**：
- 降阶1：手触对侧肩
- 降阶2：双手推起身体

### 7. 旋转稳定性测试（Rotary Stability）
| 评分 | 标准 |
|------|------|
| 3分 | 同侧手脚同时离地，身体保持水平 |
| 2分 | 对侧手脚同时离地，身体保持水平 |
| 1分 | 无法完成上述动作 |
| 0分 | 疼痛 |

**降阶测试**：
- 降阶：四点跪姿，异侧手脚离地

## 使用示例

### 示例一：深蹲评估
`	ypescript
const squatResult = await assess_fms({
  movement_type: 'squat',
  keypoints: keypointsData,
  strict_mode: false
});

console.log('深蹲评分:', squatResult.items[0].score);  // 2
console.log('左膝角度:', squatResult.items[0].angle_analysis?.find(a => a.joint === 'left_knee')?.angle);
`

### 示例二：完整FMS评估
`	ypescript
const fmsResult = await run_fms_assessment({
  patient_id: 'P001',
  assessment_items: ['squat', 'hurdle_step', 'inline_lunge'],
  save_to_history: true
});

console.log('FMS总分:', fmsResult.total_score);  // 例如：15
console.log('风险等级:', fmsResult.risk_level);  // 'low'
console.log('最弱项:', fmsResult.summary.weakest_movement);  // 'shoulder_mobility'
`

### 示例三：查看历史记录
`	ypescript
const history = await get_fms_history({
  patient_id: 'P001',
  start_date: '2024-01-01',
  include_details: true
});

for (const assessment of history) {
  console.log(assessment.assessment_date, '总分:', assessment.total_score);
}
`

## 评分标准速查表

| 分数 | 含义 | 建议 |
|------|------|------|
| 3分 | 完美完成 | 保持当前训练 |
| 2分 | 完成但有限制 | 针对性改进 |
| 1分 | 无法完成 | 降阶训练，重点突破 |
| 0分 | 疼痛 | 医疗转介 |

## 总分等级划分

| 总分范围 | 等级 | 风险 |
|----------|------|------|
| 18-21 | 优秀 | 低风险 |
| 13-17 | 良好 | 低风险 |
| 10-12 | 一般 | 中风险 |
| 7-9 | 较差 | 高风险 |
| 0-6 | 高风险 | 需医疗介入 |

## 代偿动作识别

### 常见代偿模式
| 动作 | 常见代偿 | 识别方法 |
|------|----------|----------|
| 深蹲 | 躯干前倾、膝外翻、腰椎屈曲 | 关键点角度异常 |
| 跨栏步 | 骨盆倾斜、躯干侧屈 | 髋关节高度不对称 |
| 弓步蹲 | 躯干前倾、前膝过伸 | 角度超出正常范围 |
| 肩部灵活性 | 抬肩、旋转不足 | 关键点位置偏移 |

### 代偿处理策略
- 记录代偿类型
- 降阶到可控制的动作
- 优先纠正代偿模式
- 逐步进阶到标准动作

## 训练建议生成

### 基于评分的建议
`	ypescript
function generateRecommendations(itemResult) {
  const recommendations = [];
  
  if (itemResult.score < 2) {
    recommendations.push('建议从降阶动作开始训练');
    recommendations.push('每次训练前进行热身');
  }
  
  if (itemResult.asymmetric) {
    recommendations.push('加强弱侧的训练');
    recommendations.push('增加弱侧的活动度练习');
  }
  
  if (itemResult.compensation.length > 0) {
    recommendations.push('注意纠正代偿动作');
    recommendations.push('放慢动作速度，专注于控制');
  }
  
  return recommendations;
}
`

### 针对性训练动作库
| 弱项 | 推荐动作 | 目标 |
|------|----------|------|
| 深蹲 | 箱式深蹲、TRX深蹲 | 髋关节灵活性 |
| 跨栏步 | 登阶、髋关节灵活性训练 | 髋关节控制 |
| 弓步蹲 | 静态弓步、登阶 | 下肢力量 |
| 肩部灵活性 | 肩关节活动度训练、胸椎灵活性 | 肩部活动度 |
| 主动直腿抬 | 髋屈肌拉伸、腘绳肌训练 | 髋关节活动度 |
| 躯干稳定性 | 平板支撑、死虫式 | 核心稳定性 |
| 旋转稳定性 | 四点跪姿平衡、鸟狗式 | 核心控制 |

## 注意事项

### 测试环境
- 确保足够空间进行动作
- 地面平整，无滑倒风险
- 室温适宜，着装舒适
- 测试前充分热身

### 安全考虑
- 询问疼痛史和伤病史
- 测试中出现疼痛立即停止
- 有旧伤者需医疗许可
- 必要时提供保护

### 评分一致性
- 标准化评分标准
- 培训测试人员
- 建立评分校准机制
- 记录特殊情况

## 与其他模块的集成

### 姿态分析模块
- 关键点数据自动传入
- 角度计算结果共享
- 代偿动作识别联动

### 报告生成模块
- 自动生成FMS报告
- 历史趋势图表
- 康复进度对比

### 病历模块
- 评估结果存入病历
- 关联患者基本信息
- 生成康复计划

### 训练计划模块
- 根据评估结果推荐训练
- 动态调整训练难度
- 追踪训练完成情况

## 数据模型

### 评估记录
`	ypescript
interface FMSRecord {
  id: string;
  patient_id: string;
  assessor_id: string;
  assessment_date: datetime;
  items: FMSItemRecord[];
  total_score: number;
  notes: string;
  video_url?: string;
  created_at: datetime;
}

interface FMSItemRecord {
  movement_type: string;
  left_score: number;
  right_score: number;
  final_score: number;
  pain_present: boolean;
  compensation_observed: string[];
  keypoints_snapshot: Keypoint[];
  angle_measurements: Record<string, number>;
}
`
