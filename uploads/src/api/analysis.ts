import { appApiClient, backendApiClient } from './http';
import type { Keypoint } from '../types/keypoints';

export interface AnalysisRequest {
  video: File;
}

export interface AnalysisResponse {
  score: number;
  feedback: string;
  reason: string;
  angles: Record<string, number>;
  processing_time: string;
  keypoints_detected: boolean;
  annotated_image?: string;
  details: Record<string, unknown>;
  timestamp: string;
  keypoints?: Keypoint[];
}

export interface PoseTelemetryPayload {
  movementType: string;
  movementName?: string;
  timestamp: string;
  angles: Record<string, number>;
  keypoints: Keypoint[];
}

export async function analyzeVideo(request: AnalysisRequest): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', request.video);
  return appApiClient.upload<AnalysisResponse>('/api/analyze', formData);
}

export async function postPoseTelemetry(payload: PoseTelemetryPayload): Promise<unknown> {
  return backendApiClient.post('/api/v1/assessment/analyze', payload);
}
