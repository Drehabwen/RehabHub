import type { Assessment } from '@/types/assessment';
import type { Patient } from '@/types/patient';
import type { Session } from '@/types/session';
import type { SessionReportInput, SessionReportInputType, SessionReportOutput } from '@/types/report-center';
import { generateSessionId } from '@/lib/session-utils';
import { buildSessionReportInputs } from './report-center-utils';

export type WorkflowToolId = 'vision3' | 'rom' | 'medvoice';
export type WorkflowStatus = 'completed' | 'pending';
export type WorkflowProcessStatus =
  | '待初筛'
  | '初筛中'
  | '待标准筛查'
  | '待补采集'
  | '待复核'
  | '待报告'
  | '待复测'
  | '已归档';
export type ScreeningRiskLevel = '正常' | '关注' | '高风险';
export type ScreeningDataCompleteness = '已齐全' | '缺体态' | '缺 ROM' | '缺问询' | '缺多项';
export type ScreeningReportStatus = '未生成' | '草稿中' | '待确认' | '已生成正式报告' | '已归档';

export interface WorkflowModuleDefinition {
  toolId: WorkflowToolId;
  assessmentType: Assessment['type'];
  title: string;
  shortTitle: string;
  description: string;
}

export interface WorkflowModuleSummary extends WorkflowModuleDefinition {
  status: WorkflowStatus;
  assessmentCount: number;
  latestAssessment: Assessment | null;
  latestCreatedAt: number | null;
  actionLabel: string;
}

export interface VisitTaskSummary {
  patient: Patient;
  patientName: string;
  visitId: string;
  sessionId: string | null;
  sessionSequence: number;
  status: WorkflowStatus;
  processStatus: WorkflowProcessStatus;
  riskLevel: ScreeningRiskLevel;
  dataCompleteness: ScreeningDataCompleteness;
  reportStatus: ScreeningReportStatus;
  completedModules: number;
  totalModules: number;
  progressRatio: number;
  reportReady: boolean;
  reportEligible: boolean;
  hasFormalReport: boolean;
  hasSession: boolean;
  hasAnyAssessment: boolean;
  updatedAt: number;
  nextStep: string;
  primaryAction: string;
  secondaryAction: string;
  currentFocus: string;
  reportConditionText: string;
  missingFields: string[];
  latestReportCreatedAt: number | null;
  modules: WorkflowModuleSummary[];
  sessionInput: SessionReportInput | null;
}

export const WORKFLOW_MODULES: WorkflowModuleDefinition[] = [
  {
    toolId: 'vision3',
    assessmentType: 'posture',
    title: '体态证据采集',
    shortTitle: '体态',
    description: '完成体态与脊柱关键证据采集，作为风险判断和正式报告的核心依据。',
  },
  {
    toolId: 'rom',
    assessmentType: 'rom',
    title: 'ROM 补充采集',
    shortTitle: 'ROM',
    description: '补充关节活动度与左右差异，帮助判断问题是否伴随功能受限。',
  },
  {
    toolId: 'medvoice',
    assessmentType: 'medvoice',
    title: '问询补充',
    shortTitle: '问询',
    description: '记录不适主诉、运动习惯和风险背景，提升报告规范性与后续跟踪价值。',
  },
];

const evidenceTypes: SessionReportInputType[] = ['posture', 'rom', 'medvoice'];

const sortSessions = (sessions: Session[]) => [...sessions].sort((left, right) => right.createdAt - left.createdAt);
const sortAssessments = (assessments: Assessment[]) => [...assessments].sort((left, right) => right.createdAt - left.createdAt);
const sortReports = (reports: SessionReportOutput[]) => [...reports].sort((left, right) => right.createdAt - left.createdAt);

const severityRank = {
  mild: 1,
  moderate: 2,
  severe: 3,
} as const;

const missingFieldLabels: Record<ScreeningDataCompleteness, string[]> = {
  已齐全: [],
  缺体态: ['体态'],
  '缺 ROM': ['ROM'],
  缺问询: ['问询'],
  缺多项: ['体态 / ROM / 问询中的多项'],
};

export const processStatusMeta: Record<WorkflowProcessStatus, { label: string; className: string; priority: number }> = {
  待初筛: { label: '待初筛', className: 'border-slate-200 bg-slate-100 text-slate-700', priority: 6 },
  初筛中: { label: '初筛中', className: 'border-teal-200 bg-teal-50 text-teal-700', priority: 5 },
  待标准筛查: { label: '待标准筛查', className: 'border-blue-200 bg-blue-50 text-blue-700', priority: 4 },
  待补采集: { label: '待补采集', className: 'border-amber-200 bg-amber-50 text-amber-700', priority: 2 },
  待复核: { label: '待复核', className: 'border-rose-200 bg-rose-50 text-rose-700', priority: 0 },
  待报告: { label: '待报告', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', priority: 3 },
  待复测: { label: '待复测', className: 'border-violet-200 bg-violet-50 text-violet-700', priority: 1 },
  已归档: { label: '已归档', className: 'border-slate-200 bg-white text-slate-600', priority: 7 },
};

export const riskLevelMeta: Record<ScreeningRiskLevel, { label: string; className: string; priority: number }> = {
  正常: { label: '正常', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', priority: 2 },
  关注: { label: '关注', className: 'border-amber-200 bg-amber-50 text-amber-700', priority: 1 },
  高风险: { label: '高风险', className: 'border-rose-200 bg-rose-50 text-rose-700', priority: 0 },
};

export const dataCompletenessMeta: Record<ScreeningDataCompleteness, { label: string; className: string }> = {
  已齐全: { label: '已齐全', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  缺体态: { label: '缺体态', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  '缺 ROM': { label: '缺 ROM', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  缺问询: { label: '缺问询', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  缺多项: { label: '缺多项', className: 'border-rose-200 bg-rose-50 text-rose-700' },
};

export const reportStatusMeta: Record<ScreeningReportStatus, { label: string; className: string }> = {
  未生成: { label: '未生成', className: 'border-slate-200 bg-slate-100 text-slate-700' },
  草稿中: { label: '草稿中', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  待确认: { label: '待确认', className: 'border-blue-200 bg-blue-50 text-blue-700' },
  已生成正式报告: { label: '已生成正式报告', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  已归档: { label: '已归档', className: 'border-slate-200 bg-white text-slate-600' },
};

function getLatestAssessmentByType(assessments: Assessment[], type: Assessment['type']) {
  return sortAssessments(assessments.filter((assessment) => assessment.type === type))[0] ?? null;
}

function getSessionInput(patient: Patient, sessionId: string | null, assessments: Assessment[]): SessionReportInput | null {
  if (!sessionId) return null;
  return (
    buildSessionReportInputs(
      assessments.filter((assessment) => assessment.sessionId === sessionId),
      new Map([[patient.id, patient.name || `学生 ${patient.id}`]]),
    )[0] ?? null
  );
}

function deriveDataCompleteness(sessionInput: SessionReportInput | null): ScreeningDataCompleteness {
  const missing = evidenceTypes.filter((type) => !sessionInput?.outputs[type]);
  if (missing.length === 0) return '已齐全';
  if (missing.length > 1) return '缺多项';
  if (missing[0] === 'posture') return '缺体态';
  if (missing[0] === 'rom') return '缺 ROM';
  return '缺问询';
}

function deriveRiskLevel(
  postureAssessment: Assessment | null,
  sessionInput: SessionReportInput | null,
  reportEligible: boolean,
): ScreeningRiskLevel {
  const issues = postureAssessment?.data.posture?.issues ?? [];
  const maxSeverityRank = issues.reduce((max, issue) => Math.max(max, severityRank[issue.severity] ?? 0), 0);

  if (maxSeverityRank >= severityRank.severe || issues.length >= 3) {
    return '高风险';
  }

  if (maxSeverityRank >= severityRank.moderate || issues.length > 0) {
    return '关注';
  }

  if (postureAssessment?.data.posture?.metrics?.stabilityScore !== undefined && (postureAssessment.data.posture.metrics.stabilityScore ?? 1) < 0.7) {
    return '关注';
  }

  if (!reportEligible || sessionInput?.readiness.partialCount) {
    return '关注';
  }

  return '正常';
}

function deriveReportConditionText(
  sessionInput: SessionReportInput | null,
  reportEligible: boolean,
  dataCompleteness: ScreeningDataCompleteness,
): string {
  if (!sessionInput?.outputs.posture) {
    return '缺少体态证据，暂不满足正式报告条件。';
  }

  if (!reportEligible) {
    return '需补充 ROM 或问询中的至少一项后，才能生成正式报告。';
  }

  if (dataCompleteness !== '已齐全') {
    return '已满足正式报告条件，但建议补齐缺失项后再形成更完整的正式报告。';
  }

  return '当前证据已齐全，可进入正式报告生成与归档流程。';
}

function deriveReportStatus(
  hasAnyAssessment: boolean,
  reportEligible: boolean,
  hasFormalReport: boolean,
  riskLevel: ScreeningRiskLevel,
): ScreeningReportStatus {
  if (!hasAnyAssessment) return '未生成';
  if (!reportEligible) return '草稿中';
  if (!hasFormalReport) return '待确认';
  if (riskLevel === '正常') return '已归档';
  return '已生成正式报告';
}

function deriveProcessStatus(
  hasAnyAssessment: boolean,
  postureReady: boolean,
  sessionInput: SessionReportInput | null,
  reportEligible: boolean,
  hasFormalReport: boolean,
  riskLevel: ScreeningRiskLevel,
  reportStatus: ScreeningReportStatus,
): WorkflowProcessStatus {
  if (!hasAnyAssessment) return '待初筛';
  if (!postureReady) return '初筛中';
  if ((sessionInput?.readiness.availableTypes.filter((type) => evidenceTypes.includes(type)).length ?? 0) <= 1) return '待标准筛查';
  if (!reportEligible) return '待补采集';
  if (!hasFormalReport && riskLevel === '高风险') return '待复核';
  if (!hasFormalReport) return '待报告';
  if (reportStatus === '已归档') return '已归档';
  return '待复测';
}

function buildFocusText(processStatus: WorkflowProcessStatus, dataCompleteness: ScreeningDataCompleteness, riskLevel: ScreeningRiskLevel): string {
  switch (processStatus) {
    case '待初筛':
      return '今天先完成初筛分流，确认是否需要进入标准筛查。';
    case '初筛中':
      return '先补齐体态证据，形成后续分流和判断基础。';
    case '待标准筛查':
      return '已进入对象详情页，建议补足标准筛查的辅助证据。';
    case '待补采集':
      return `当前${dataCompleteness}，需要继续补采集后再形成正式结论。`;
    case '待复核':
      return `当前系统判定为${riskLevel}，建议先复核证据再生成正式报告。`;
    case '待报告':
      return '证据已满足正式报告条件，下一步应完成报告确认与归档。';
    case '待复测':
      return '已形成正式报告，下一步应安排复测时间与跟踪动作。';
    case '已归档':
      return '当前对象已完成闭环，可在学生中心持续跟踪后续变化。';
    default:
      return '继续推进当前筛查闭环。';
  }
}

function buildPrimaryAction(processStatus: WorkflowProcessStatus): string {
  switch (processStatus) {
    case '待初筛':
      return '开始初筛';
    case '初筛中':
      return '继续初筛';
    case '待标准筛查':
      return '进入标准筛查';
    case '待补采集':
      return '补齐采集';
    case '待复核':
      return '进入复核';
    case '待报告':
      return '生成报告';
    case '待复测':
      return '安排复测';
    case '已归档':
      return '查看档案';
    default:
      return '查看详情';
  }
}

function buildSecondaryAction(processStatus: WorkflowProcessStatus): string {
  switch (processStatus) {
    case '待初筛':
    case '初筛中':
    case '待标准筛查':
    case '待补采集':
      return '查看对象详情';
    case '待复核':
    case '待报告':
      return '查看报告条件';
    case '待复测':
      return '查看复测计划';
    case '已归档':
      return '查看历史趋势';
    default:
      return '查看详情';
  }
}

function buildWorkflowModuleSummaries(assessments: Assessment[]) {
  return WORKFLOW_MODULES.map<WorkflowModuleSummary>((module) => {
    const moduleAssessments = sortAssessments(assessments.filter((assessment) => assessment.type === module.assessmentType));
    const latestAssessment = moduleAssessments[0] ?? null;
    const completed = Boolean(latestAssessment);

    return {
      ...module,
      status: completed ? 'completed' : 'pending',
      assessmentCount: moduleAssessments.length,
      latestAssessment,
      latestCreatedAt: latestAssessment?.createdAt ?? null,
      actionLabel: completed ? '查看结果' : module.toolId === 'vision3' ? '开始体态采集' : '开始补充',
    };
  });
}

export function buildVisitTaskSummary(
  patient: Patient,
  sessions: Session[],
  assessments: Assessment[],
  reports: SessionReportOutput[],
): VisitTaskSummary {
  const orderedSessions = sortSessions(sessions);
  const latestSession = orderedSessions[0] ?? null;
  const latestSessionAssessments = latestSession
    ? assessments.filter((assessment) => assessment.sessionId === latestSession.id)
    : [];
  const orderedAssessments = sortAssessments(latestSessionAssessments);
  const sessionSequence = latestSession?.sequence ?? 1;
  const visitId = latestSession?.id ?? generateSessionId(patient.id, sessionSequence);
  const sessionInput = getSessionInput(patient, latestSession?.id ?? null, orderedAssessments);
  const latestReport = latestSession
    ? sortReports(reports.filter((report) => report.sessionId === latestSession.id))[0] ?? null
    : null;
  const modules = buildWorkflowModuleSummaries(orderedAssessments);

  const requiredCompletedModules = modules.filter((module) => module.status === 'completed').length;
  const totalModules = modules.length;
  const hasAnyAssessment = requiredCompletedModules > 0;
  const postureAssessment = getLatestAssessmentByType(orderedAssessments, 'posture');
  const postureReady = Boolean(sessionInput?.outputs.posture);
  const reportEligible = postureReady && (Boolean(sessionInput?.outputs.rom) || Boolean(sessionInput?.outputs.medvoice));
  const dataCompleteness = deriveDataCompleteness(sessionInput);
  const riskLevel = deriveRiskLevel(postureAssessment, sessionInput, reportEligible);
  const hasFormalReport = Boolean(latestReport);
  const reportStatus = deriveReportStatus(hasAnyAssessment, reportEligible, hasFormalReport, riskLevel);
  const processStatus = deriveProcessStatus(hasAnyAssessment, postureReady, sessionInput, reportEligible, hasFormalReport, riskLevel, reportStatus);
  const missingFields = missingFieldLabels[dataCompleteness];

  return {
    patient,
    patientName: patient.name || `学生 ${patient.id}`,
    visitId,
    sessionId: latestSession?.id ?? null,
    sessionSequence,
    status: processStatus === '已归档' ? 'completed' : 'pending',
    processStatus,
    riskLevel,
    dataCompleteness,
    reportStatus,
    completedModules: requiredCompletedModules,
    totalModules,
    progressRatio: totalModules === 0 ? 0 : requiredCompletedModules / totalModules,
    reportReady: reportEligible,
    reportEligible,
    hasFormalReport,
    hasSession: Boolean(latestSession),
    hasAnyAssessment,
    updatedAt: latestReport?.createdAt ?? latestSession?.updatedAt ?? patient.updatedAt,
    nextStep: buildFocusText(processStatus, dataCompleteness, riskLevel),
    primaryAction: buildPrimaryAction(processStatus),
    secondaryAction: buildSecondaryAction(processStatus),
    currentFocus: buildFocusText(processStatus, dataCompleteness, riskLevel),
    reportConditionText: deriveReportConditionText(sessionInput, reportEligible, dataCompleteness),
    missingFields,
    latestReportCreatedAt: latestReport?.createdAt ?? null,
    modules,
    sessionInput,
  };
}

export function buildVisitTaskList(
  patients: Patient[],
  getPatientSessions: (patientId: string) => Session[],
  assessments: Assessment[],
  reports: SessionReportOutput[],
): VisitTaskSummary[] {
  return patients
    .map((patient) => buildVisitTaskSummary(
      patient,
      getPatientSessions(patient.id),
      assessments.filter((assessment) => assessment.patientId === patient.id),
      reports.filter((report) => report.patientId === patient.id),
    ))
    .sort((left, right) => {
      const processDelta = processStatusMeta[left.processStatus].priority - processStatusMeta[right.processStatus].priority;
      if (processDelta !== 0) return processDelta;

      const riskDelta = riskLevelMeta[left.riskLevel].priority - riskLevelMeta[right.riskLevel].priority;
      if (riskDelta !== 0) return riskDelta;

      return right.updatedAt - left.updatedAt;
    });
}
