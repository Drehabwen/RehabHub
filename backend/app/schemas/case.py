from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class CaseStatus(str, Enum):
    DRAFT = 'draft'
    ACTIVE = 'active'
    COMPLETED = 'completed'
    ARCHIVED = 'archived'

class Gender(str, Enum):
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'

class CaseCreate(BaseModel):
    patient_name: str = Field(..., description='患者姓名', min_length=1, max_length=100)
    patient_gender: Optional[Gender] = Field(None, description='患者性别')
    patient_age: Optional[int] = Field(None, ge=0, le=150, description='患者年龄')
    patient_id: Optional[str] = Field(None, description='患者ID/病历号')
    chief_complaint: Optional[str] = Field(None, description='主诉')
    present_illness: Optional[str] = Field(None, description='现病史')
    history_present_illness: Optional[str] = Field(None, description='现病史详情')
    past_history: Optional[str] = Field(None, description='既往史')
    allergy_history: Optional[str] = Field(None, description='过敏史')
    personal_history: Optional[str] = Field(None, description='个人史')
    family_history: Optional[str] = Field(None, description='家族史')
    tags: Optional[List[str]] = Field(default_factory=list, description='标签')
    notes: Optional[str] = Field(None, description='备注')
    voice_intake_id: Optional[str] = Field(None, description='关联的语音录入ID')

class CaseUpdate(BaseModel):
    patient_name: Optional[str] = Field(None, description='患者姓名')
    patient_gender: Optional[Gender] = Field(None, description='患者性别')
    patient_age: Optional[int] = Field(None, ge=0, le=150, description='患者年龄')
    patient_id: Optional[str] = Field(None, description='患者ID/病历号')
    chief_complaint: Optional[str] = Field(None, description='主诉')
    present_illness: Optional[str] = Field(None, description='现病史')
    history_present_illness: Optional[str] = Field(None, description='现病史详情')
    past_history: Optional[str] = Field(None, description='既往史')
    allergy_history: Optional[str] = Field(None, description='过敏史')
    personal_history: Optional[str] = Field(None, description='个人史')
    family_history: Optional[str] = Field(None, description='家族史')
    status: Optional[CaseStatus] = Field(None, description='病例状态')
    tags: Optional[List[str]] = Field(None, description='标签')
    notes: Optional[str] = Field(None, description='备注')

class CaseResponse(BaseModel):
    id: str
    patient_name: str
    patient_gender: Optional[Gender]
    patient_age: Optional[int]
    patient_id: Optional[str]
    chief_complaint: Optional[str]
    present_illness: Optional[str]
    history_present_illness: Optional[str]
    past_history: Optional[str]
    allergy_history: Optional[str]
    personal_history: Optional[str]
    family_history: Optional[str]
    status: CaseStatus
    tags: List[str]
    notes: Optional[str]
    voice_intake_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class VoiceIntakeCreate(BaseModel):
    case_id: Optional[str] = Field(None, description='关联的病例ID')
    audio_data: str = Field(..., description='Base64编码的音频数据')
    audio_format: str = Field(default='webm', description='音频格式')
    language: str = Field(default='zh-CN', description='语言')
    enable_medical_ner: bool = Field(default=True, description='是否启用医疗实体识别')
    enable_term_normalization: bool = Field(default=True, description='是否启用术语规范化')

class VoiceIntakeResponse(BaseModel):
    id: str
    case_id: Optional[str]
    transcript: str
    normalized_transcript: Optional[str]
    medical_entities: Dict[str, Any]
    audio_url: Optional[str]
    duration_seconds: Optional[float]
    confidence: Optional[float]
    language: str
    created_at: datetime
    
class MedicalRecordCreate(BaseModel):
    case_id: str = Field(..., description='病例ID')
    record_type: str = Field(..., description='记录类型: diagnosis, treatment, follow_up, prescription, note')
    content: str = Field(..., description='记录内容')
    attachments: Optional[List[str]] = Field(default_factory=list, description='附件URL列表')
    is_voice_generated: bool = Field(default=False, description='是否由语音生成')
    voice_intake_id: Optional[str] = Field(None, description='关联的语音录入ID')

class MedicalRecordResponse(BaseModel):
    id: str
    case_id: str
    record_type: str
    content: str
    attachments: List[str]
    is_voice_generated: bool
    voice_intake_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SpeechTranscriptionRequest(BaseModel):
    audio_data: str = Field(..., description='Base64编码的音频数据')
    audio_format: str = Field(default='wav', description='音频格式: wav, mp3, webm, m4a')
    language: str = Field(default='zh-CN', description='语言代码')
    sample_rate: int = Field(default=16000, description='采样率')
    enable_punctuation: bool = Field(default=True, description='是否启用标点符号')
    enable_ner: bool = Field(default=True, description='是否启用命名实体识别')
    enable_medical_dict: bool = Field(default=True, description='是否启用医疗词典')
    enable_itn: bool = Field(default=True, description='是否启用智能文本规整')

class SpeechTranscriptionResponse(BaseModel):
    success: bool
    transcript: str
    normalized_text: Optional[str]
    confidence: float
    duration_seconds: Optional[float]
    language: str
    words: List[Dict[str, Any]]
    medical_entities: Optional[Dict[str, Any]]
    suggestion: Optional[str]
    error: Optional[str]
