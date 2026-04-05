import { appApiClient, backendApiClient } from './http';
import { normalizePaginatedData, type PaginatedData } from './types';

export type ReportStatus = 'completed' | 'in-progress' | 'draft';

export interface ReportRecord {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  date: string;
  score: number;
  status: ReportStatus;
  summary: string;
  details?: string;
}

export interface CreateReportInput {
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  date: string;
  score: number;
  status: ReportStatus;
  summary: string;
  details?: string;
}

function normalizeReportRecord(payload: unknown): ReportRecord {
  const record = (payload ?? {}) as Record<string, any>;

  return {
    id: String(record.id ?? ''),
    patientId: String(record.patientId ?? ''),
    patientName: String(record.patientName ?? ''),
    testId: String(record.testId ?? ''),
    testName: String(record.testName ?? ''),
    date: String(record.date ?? ''),
    score: Number(record.score ?? 0),
    status: (record.status ?? 'draft') as ReportStatus,
    summary: String(record.summary ?? ''),
    details: record.details ? String(record.details) : undefined,
  };
}

export async function listReports(page = 1, pageSize = 20): Promise<PaginatedData<ReportRecord>> {
  let payload: unknown;
  try {
    payload = await appApiClient.get<unknown>('/api/reports', { page, pageSize });
  } catch {
    payload = await backendApiClient.get<unknown>('/api/v1/reports', { page, pageSize });
  }
  const normalized = normalizePaginatedData<unknown>(payload, { page, pageSize });

  return {
    ...normalized,
    items: normalized.items.map(normalizeReportRecord),
  };
}

export async function createReport(data: CreateReportInput): Promise<ReportRecord> {
  let payload: unknown;
  try {
    payload = await appApiClient.post<unknown>('/api/reports', data);
  } catch {
    payload = await backendApiClient.post<unknown>('/api/v1/reports', data);
  }
  return normalizeReportRecord(payload);
}

export async function deleteReportRecord(id: string): Promise<{ status: string }> {
  try {
    return await appApiClient.delete<{ status: string }>(`/api/reports/${id}`);
  } catch {
    return backendApiClient.delete<{ status: string }>(`/api/v1/reports/${id}`);
  }
}

export async function exportReport(id: string, format: 'pdf' | 'excel'): Promise<{ status: string; id: string; format: string }> {
  try {
    return await appApiClient.get<{ status: string; id: string; format: string }>(`/api/reports/${id}/export`, { format });
  } catch {
    return backendApiClient.get<{ status: string; id: string; format: string }>(`/api/v1/reports/${id}/export`, { format });
  }
}
