from __future__ import annotations

from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ScoreSummary(BaseModel):
    value: float
    maxValue: float


class PaginationMeta(BaseModel):
    page: int
    pageSize: int
    total: int
    totalPages: int

class AssessmentResultCreate(BaseModel):
    patientId: Optional[str] = "guest"
    movementType: str
    movementName: Optional[str] = None
    timestamp: Optional[str] = None
    overallScore: Optional[ScoreSummary] = None
    mobilityScore: Optional[ScoreSummary] = None
    stabilityScore: Optional[ScoreSummary] = None
    angles: Optional[Dict[str, float]] = Field(default_factory=dict)
    recommendations: Optional[List[str]] = Field(default_factory=list)


class AssessmentResultRecord(BaseModel):
    id: str
    patientId: Optional[str] = "guest"
    movementType: str
    movementName: str
    timestamp: str
    overallScore: Optional[ScoreSummary] = None
    mobilityScore: Optional[ScoreSummary] = None
    stabilityScore: Optional[ScoreSummary] = None
    angles: Dict[str, float] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)


class ReportStatus(str, Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in-progress"
    DRAFT = "draft"


class ReportCreate(BaseModel):
    patientId: str = ""
    patientName: str = ""
    testId: str = ""
    testName: str = "评估报告"
    date: Optional[str] = None
    score: float = 0
    status: ReportStatus = ReportStatus.DRAFT
    summary: str = ""
    details: Optional[str] = None


class ReportRecord(BaseModel):
    id: str
    patientId: str
    patientName: str
    testId: str
    testName: str
    date: str
    score: float
    status: ReportStatus
    summary: str
    details: str = ""


class ReportExportResponse(BaseModel):
    status: str
    id: str
    format: str


class DeleteResponse(BaseModel):
    status: str


class SystemStatsResponse(BaseModel):
    total_patients: int
    total_assessments: int
    average_score: float
    assessments_by_movement: Dict[str, int]
    recent_activity: List[Dict[str, int | str]]

class PaginatedAssessmentResultData(BaseModel):
    items: List[AssessmentResultRecord]
    pagination: PaginationMeta


class PaginatedReportData(BaseModel):
    items: List[ReportRecord]
    pagination: PaginationMeta
