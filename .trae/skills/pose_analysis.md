# Pose Analysis Skill

## 技能信息
- **技能名称**: pose_analysis
- **版本**: 1.0.0
- **描述**: 姿态估计数据分析、运动评估和康复训练指导
- **分类**: 运动分析

## 功能特性

### 1. 关键点检测分析
- 解析MoveNet、PoseNet等模型的输出数据
- 验证关键点完整性和置信度
- 过滤低质量检测结果
- 支持17关节点标准人体姿态模型

### 2. 关节角度计算
- 计算髋关节、膝关节、肩关节角度
- 支持多点夹角计算（A-B-C模式）
- 提供角度正常范围参考值
- 生成角度偏差分析报告

### 3. 运动类型识别
- 支持FMS功能动作筛查项目
- 识别深蹲、跨栏步、直线弓步蹲等动作
- 自定义运动类型注册机制
- 运动类型与评分标准映射

### 4. 评分与反馈
- 基于规则的动作质量评分
- 实时反馈生成
- 异常姿态预警
- 训练建议推荐

### 5. 历史数据管理
- 评估记录存储与查询
- 进度对比分析
- 趋势图表生成
- 患者康复进度追踪

## 使用方法

### 基本用法
analyze_pose(keypoints, movement_type)

### 完整评估
analyze_pose(
    keypoints=keypoints_data,
    movement_type='deep_squat',
    patient_id='P001',
    strict_mode=True
)

### 角度计算
calculate_angle(
    keypoints,
    joint_a='left_hip',
    joint_b='left_knee',
    joint_c='left_ankle'
)

## 输入参数

### analyze_pose
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| keypoints | List[Keypoint] | 是 | - | 关键点数据数组 |
| movement_type | str | 是 | - | 运动类型标识符 |
| patient_id | str | 否 | 'guest' | 患者唯一标识 |
| timestamp | str | 否 | 当前时间 | 评估时间戳 |
| strict_mode | bool | 否 | False | 严格评分模式 |
| options | dict | 否 | {} | 高级选项 |

### calculate_angle
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| keypoints | List[Keypoint] | 是 | - | 关键点数据 |
| joint_a | str | 是 | - | 起点关节点名称 |
| joint_b | str | 是 | - | 顶点关节点名称 |
| joint_c | str | 是 | - | 终点关节点名称 |

## 输出格式

### 评估响应结构
`	ypescript
interface AssessmentResponse {
  score: number;           // 综合评分（0-100）
  feedback: string;        // 评估反馈
  angles: Record<string, number>;  // 角度数据
  details: {
    movement_type: string;
    keypoints_detected: number;
    confidence: number;
    anomalies: string[];
    recommendations: string[];
  };
}
`

### 关键点数据结构
`	ypescript
interface Keypoint {
  name: string;     // 关节点名称
  x: number;        // X坐标（归一化）
  y: number;        // Y坐标（归一化）
  score: number;    // 置信度（0-1）
  z?: number;       // Z坐标（深度，可选）
}
`

## 支持的运动类型

### FMS功能动作筛查
| 运动类型 | 标识符 | 评分标准 |
|----------|--------|----------|
| 深蹲 | deep_squat | 膝角<100优秀，<130良好 |
| 跨栏步 | hurdle_step | 髋膝踝三点一线 |
| 直线弓步蹲 | inline_lunge | 躯干稳定、步距适当 |
| 肩部灵活性 | shoulder_mobility | 手能否触及对侧肩胛骨 |
| 主动直腿抬 | active_straight_leg_raise | 髋屈角度>70 |
| 躯干稳定性俯卧撑 | trunk_stability_pushup | 躯干无旋转 |
| 旋转稳定性测试 | rotary_stability | 四足平衡能力 |

## 使用示例

### 示例一：深蹲动作评估
`	ypescript
const keypoints = [
  { name: 'left_hip', x: 0.5, y: 0.6, score: 0.95 },
  { name: 'left_knee', x: 0.5, y: 0.8, score: 0.92 },
  { name: 'left_ankle', x: 0.5, y: 0.95, score: 0.88 },
  // ... 其他关节点
];

const result = await analyze_pose({
  keypoints,
  movement_type: 'deep_squat',
  patient_id: 'P001'
});

console.log(result.score);      // 85
console.log(result.feedback);   // '下蹲深度良好，继续保持'
`

### 示例二：计算特定关节角度
`	ypescript
const left_knee_angle = calculate_angle({
  keypoints,
  joint_a: 'left_hip',
  joint_b: 'left_knee',
  joint_c: 'left_ankle'
});

console.log('左膝角度:', left_knee_angle, '');
`

### 示例三：批量评估与历史记录
`	ypescript
// 多次评估
const assessments = [];
for (let i = 0; i < 5; i++) {
  const result = await analyze_pose({
    keypoints: getKeypoints(),
    movement_type: 'deep_squat',
    patient_id: 'P001'
  });
  assessments.push(result);
}

// 查看进度
const progress = assessProgress(assessments);
console.log('康复进度:', progress.trend);  // improving/stable/declining
`

## 注意事项

### 数据质量要求
- 关键点置信度应高于0.8
- 至少检测到15个以上关节点
- 避免严重遮挡或截断姿态
- 光线充足、背景简洁的环境

### 评分局限性
- 当前版本基于规则判断，非机器学习模型
- 个体差异未纳入考量
- 建议结合专业康复师意见
- 不作为唯一诊断依据

### 性能考虑
- 实时分析需控制帧率在30fps以内
- 移动端注意内存占用
- 大批量数据建议分批处理
- 合理使用缓存机制

## 与其他模块的集成

### 后端API集成
- 评估结果可POST到 /api/v1/analyze
- 支持批量评估数据上传
- 获取历史评估记录

### 前端组件集成
- 配合CameraCapture组件使用
- 与SkeletonVisualizer可视化联动
- 支持实时和离线两种模式

### 数据流转
`
摄像头帧  姿态估计  关键点提取  角度计算  评分反馈  数据存储
`
