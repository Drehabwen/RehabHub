export type { AnalysisRequest, AnalysisResponse } from '../api/analysis';
export { analyzeVideo, postPoseTelemetry } from '../api/analysis';

export type { AssessmentResultRecord } from '../api/results';
export {
  listAssessmentResults,
  getAssessmentResult,
  deleteAssessmentResult,
} from '../api/results';

export type { ReportRecord, ReportStatus, CreateReportInput } from '../api/reports';
export {
  listReports,
  createReport,
  deleteReportRecord,
  exportReport,
} from '../api/reports';

export type { StatCard } from '../api/system';
export { fetchDashboardStats } from '../api/system';

export {
  getRuntimeConfig,
  setRuntimeConfig,
  resolveApiBaseUrl,
  resolveBackendBaseUrl,
} from '../api/runtime';

export { listAssessmentResults as getResults } from '../api/results';
export { getAssessmentResult as getResultDetail } from '../api/results';
export { deleteAssessmentResult as deleteResult } from '../api/results';
