export type { JointType, MovementDirection } from '../config/romConvention';

export interface ROMData {
  joint: import('../config/romConvention').JointType;
  direction: import('../config/romConvention').MovementDirection;
  side: 'left' | 'right' | 'midline';
  angle: number;
  maxAngle: number;
  minAngle: number;
  timestamp: number;
  confidence: number;
}

export interface ROMAssessment {
  id: string;
  patientId: string;
  sessionId: string;
  createdAt: number;
  data: ROMData[];
  notes?: string;
  status: 'pending' | 'completed' | 'reviewed';
}

export interface ROMReport {
  id: string;
  patientId: string;
  assessmentId: string;
  createdAt: number;
  data: ROMData[];
  summary: string;
  recommendations: string[];
}
