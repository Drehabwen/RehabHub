import { appApiClient, backendApiClient } from './http';
import { normalizePaginatedData, type PaginatedData } from './types';
import type { Score } from '../types/assessment';

export interface AssessmentResultRecord {
  id: string;
  movementType: string;
  movementName: string;
  timestamp: string;
  overallScore?: Score;
  mobilityScore?: Score;
  stabilityScore?: Score;
  angles?: Record<string, number>;
  recommendations?: string[];
}

function parseScoreSummary(value: unknown): Score | undefined {
  if (typeof value !== 'string') return undefined;
  const [rawValue, rawMaxValue] = value.split('/').map((part) => Number(part));
  if (!Number.isFinite(rawValue) || !Number.isFinite(rawMaxValue)) {
    return undefined;
  }

  return {
    value: rawValue,
    maxValue: rawMaxValue,
  };
}

function normalizeAssessmentResultRecord(payload: unknown): AssessmentResultRecord {
  const record = (payload ?? {}) as Record<string, any>;

  return {
    id: String(record.id ?? ''),
    movementType: String(record.movementType ?? 'unknown'),
    movementName: String(record.movementName ?? record.movementType ?? 'Unknown Movement'),
    timestamp: String(record.timestamp ?? new Date().toISOString()),
    overallScore: record.overallScore ?? parseScoreSummary(record.scoreSummary),
    mobilityScore: record.mobilityScore,
    stabilityScore: record.stabilityScore,
    angles: record.angles ?? record.anglesSummary ?? {},
    recommendations: Array.isArray(record.recommendations) ? record.recommendations.map(String) : undefined,
  };
}

export async function listAssessmentResults(page = 1, pageSize = 20): Promise<PaginatedData<AssessmentResultRecord>> {
  let payload: unknown;
  try {
    payload = await appApiClient.get<unknown>('/api/assessment-results', { page, pageSize });
  } catch {
    payload = await backendApiClient.get<unknown>('/api/v1/assessment-results', { page, pageSize });
  }
  const normalized = normalizePaginatedData<unknown>(payload, { page, pageSize });

  return {
    ...normalized,
    items: normalized.items.map(normalizeAssessmentResultRecord),
  };
}

export async function getAssessmentResult(id: string): Promise<AssessmentResultRecord> {
  let payload: unknown;
  try {
    payload = await appApiClient.get<unknown>(`/api/assessment-results/${id}`);
  } catch {
    payload = await backendApiClient.get<unknown>(`/api/v1/assessment-results/${id}`);
  }
  return normalizeAssessmentResultRecord(payload);
}

export async function deleteAssessmentResult(id: string): Promise<{ status: string }> {
  try {
    return await appApiClient.delete<{ status: string }>(`/api/assessment-results/${id}`);
  } catch {
    return backendApiClient.delete<{ status: string }>(`/api/v1/assessment-results/${id}`);
  }
}
