# Medical Record Skill

## 技能信息
- **技能名称**: medical_record
- **版本**: 1.0.0
- **描述**: 病历创建、编辑、查询和管理，支持语音录入和结构化存储
- **分类**: 医疗数据管理

## 功能特性

### 1. 病例管理
- 创建新病例（患者基本信息、病史、主诉等）
- 更新病例信息
- 病例状态管理（草稿/进行中/已完成/归档）
- 病例搜索与筛选

### 2. 语音病历录入
- 音频录制与上传
- 语音转文字（讯飞/其他ASR服务）
- 医疗实体识别（症状、诊断、用药等）
- 术语规范化处理

### 3. 病历记录
- 诊断记录
- 治疗方案
- 随访记录
- 处方信息
- 附加附件

### 4. 数据验证
- 必填字段验证
- 数据格式校验
- 逻辑一致性检查
- 隐私数据脱敏

### 5. 导出与报告
- 病历导出（PDF/JSON）
- 评估报告生成
- 康复进度报告

## 使用方法

### 基本用法
create_case(patient_data)

### 语音录入
process_voice_intake(audio_data, case_id)

### 病历查询
get_case(case_id)
search_cases(filters)

### 添加记录
add_medical_record(case_id, record_data)

## 输入参数

### create_case
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| patient_name | str | 是 | - | 患者姓名 |
| patient_gender | str | 否 | - | 性别（male/female/other） |
| patient_age | int | 否 | - | 年龄 |
| patient_id | str | 否 | - | 病历号 |
| chief_complaint | str | 否 | - | 主诉 |
| present_illness | str | 否 | - | 现病史 |
| past_history | str | 否 | - | 既往史 |
| allergy_history | str | 否 | - | 过敏史 |
| tags | List[str] | 否 | [] | 标签 |

### process_voice_intake
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| audio_data | str | 是 | - | Base64编码音频 |
| case_id | str | 否 | - | 关联病例ID |
| language | str | 否 | 'zh-CN' | 语言 |
| enable_ner | bool | 否 | True | 启用医疗实体识别 |
| enable_normalization | bool | 否 | True | 启用术语规范化 |

### add_medical_record
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| case_id | str | 是 | - | 病例ID |
| record_type | str | 是 | - | 记录类型 |
| content | str | 是 | - | 记录内容 |
| is_voice_generated | bool | 否 | False | 是否由语音生成 |
| attachments | List[str] | 否 | [] | 附件URL |

## 输出格式

### 病例响应结构
`	ypescript
interface CaseResponse {
  id: string;
  patient_name: string;
  patient_gender?: Gender;
  patient_age?: number;
  patient_id?: string;
  chief_complaint?: string;
  present_illness?: string;
  status: CaseStatus;
  tags: string[];
  voice_intake_id?: string;
  created_at: datetime;
  updated_at: datetime;
}
`

### 语音录入响应
`	ypescript
interface VoiceIntakeResponse {
  id: string;
  case_id?: string;
  transcript: string;
  normalized_transcript?: string;
  medical_entities: {
    symptoms: string[];
    diagnoses: string[];
    medications: string[];
    body_parts: string[];
  };
  confidence: number;
  duration_seconds?: number;
}
`

### 病历记录响应
`	ypescript
interface MedicalRecordResponse {
  id: string;
  case_id: string;
  record_type: 'diagnosis' | 'treatment' | 'follow_up' | 'prescription' | 'note';
  content: string;
  attachments: string[];
  is_voice_generated: boolean;
  voice_intake_id?: string;
  created_at: datetime;
}
`

## 使用示例

### 示例一：创建新病例
`	ypescript
const newCase = await create_case({
  patient_name: '张三',
  patient_gender: 'male',
  patient_age: 45,
  chief_complaint: '腰背部疼痛3个月',
  present_illness: '久坐后加重，休息后缓解',
  past_history: '无特殊',
  tags: ['腰痛', '上班族']
});

console.log('病例ID:', newCase.id);
`

### 示例二：语音录入病历
`	ypescript
const audioBase64 = await recordAudio();
const voiceResult = await process_voice_intake({
  audio_data: audioBase64,
  case_id: 'case_001',
  enable_ner: true
});

console.log('转写结果:', voiceResult.transcript);
console.log('医疗实体:', voiceResult.medical_entities);
`

### 示例三：添加诊断记录
`	ypescript
await add_medical_record({
  case_id: 'case_001',
  record_type: 'diagnosis',
  content: '腰椎间盘突出症（L4-L5）',
  attachments: ['/reports/mri_001.pdf']
});
`

### 示例四：搜索病例
`	ypescript
const cases = await search_cases({
  status: 'active',
  tags: ['腰痛'],
  date_range: {
    start: '2024-01-01',
    end: '2024-12-31'
  }
});

for (const case of cases) {
  console.log(case.patient_name, case.chief_complaint);
}
`

## 记录类型说明

| 类型 | 标识符 | 说明 |
|------|--------|------|
| 诊断 | diagnosis | 医学诊断结果 |
| 治疗 | treatment | 治疗方案和过程 |
| 随访 | follow_up | 随访记录 |
| 处方 | prescription | 药物处方 |
| 备注 | note | 其他备注 |

## 病例状态

| 状态 | 标识符 | 说明 |
|------|--------|------|
| 草稿 | draft | 正在填写中 |
| 进行中 | active | 治疗进行中 |
| 已完成 | completed | 治疗完成 |
| 已归档 | archived | 历史病例 |

## 医疗实体识别

### 识别的实体类型
- **症状**: 疼痛、麻木、肿胀、乏力等
- **诊断**: 疾病名称、病理类型等
- **用药**: 药物名称、剂量、用法等
- **部位**: 身体部位、器官等
- **检查**: 检查项目、结果等

### 实体提取示例
`	ypescript
const text = '患者主诉腰部疼痛，伴左下肢放射痛，既往有高血压病史';
const entities = extractMedicalEntities(text);
// 结果:
// {
//   symptoms: ['腰部疼痛', '左下肢放射痛'],
//   diagnoses: [],
//   medications: [],
//   body_parts: ['腰部', '左下肢'],
//   past_history: ['高血压']
// }
`

## 数据隐私

### 敏感信息处理
- 患者姓名脱敏处理
- 身份证号掩码显示
- 联系方式加密存储
- 访问日志记录

### 权限控制
- 医生：完整访问权限
- 护士：查看和记录权限
- 患者：查看本人病历
- 管理员：系统管理权限

## 注意事项

### 数据完整性
- 必填字段不能为空
- 关键信息需要复核确认
- 语音录入需要人工校验
- 附件需要规范命名

### 法律法规
- 符合《病历书写规范》
- 遵守《个人信息保护法》
- 满足《医疗机构病历管理规定》
- 数据保留期限符合要求

### 性能优化
- 大文本分块处理
- 附件延迟加载
- 列表分页查询
- 热点数据缓存

## 与其他模块的集成

### 语音模块集成
- AudioRecorder组件配合使用
- 讯飞语音识别API对接
- 音频文件存储管理

### 评估模块集成
- 评估结果自动关联病例
- 评估报告附加到病历
- 康复进度追踪

### 报告模块集成
- 病历导出功能
- 统计报表生成
- 数据分析可视化
