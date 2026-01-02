import type { ReactNode } from 'react';

export interface Score {
  value: number;
  maxValue: number;
  description?: string;
  feedback?: string;
}

export interface Metric {
  id: string;
  name: string;
  score: Score;
  category: string;
  details?: Record<string, any>;
}

export type AssessmentType = 'FMS' | 'YBT' | 'SFMA' | 'VAS' | 'OSWESTRY' | 'SF36' | 'TUG' | 'OTHER';

export type AssessmentStatus = 'draft' | 'completed' | 'reviewed';

export interface Assessment {
  id: string;
  type: AssessmentType;
  subtype: string;
  patientId: string;
  assessorId?: string;
  timestamp: string;
  metrics: Metric[];
  overallScore: Score;
  recommendations?: string[];
  notes?: string;
  status: AssessmentStatus;
}

export interface FmsAssessment extends Assessment {
  type: 'FMS';
  movementType: string;
  movementName: string;
  mobilityScore: Score;
  stabilityScore: Score;
  asymmetryDetected: boolean;
  compensationPatterns?: string[];
}

export interface ScaleAssessment extends Assessment {
  type: 'VAS' | 'OSWESTRY' | 'SF36' | 'TUG';
  scaleType: 'VAS' | 'OSWESTRY' | 'SF36' | 'TUG';
  scaleId: string;
  answers: Array<{
    questionId: string;
    answer: string | number | Array<string | number>;
    score?: number;
  }>;
  totalScore?: number;
  interpretation?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface AssessmentQueryParams extends PaginationParams {
  patientId?: string;
  type?: AssessmentType;
  subtype?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: AssessmentStatus;
}

export interface AssessmentProcessor {
  process(data: any): Promise<Assessment>;
  getRecommendedExercises(assessment: Assessment): string[];
  generateReport(assessment: Assessment): string;
}

export interface AssessmentModuleConfig {
  id: string;
  name: string;
  supportedMovementTypes: string[];
  processor: AssessmentProcessor;
  icon: ReactNode;
  description: string;
}

export class AssessmentSystemRegistry {
  private static modules: Map<string, AssessmentModuleConfig> = new Map();

  static registerModule(module: AssessmentModuleConfig) {
    this.modules.set(module.id, module);
  }

  static getModule(id: string): AssessmentModuleConfig | undefined {
    return this.modules.get(id);
  }

  static getModulesForMovement(movementType: string): AssessmentModuleConfig[] {
    return Array.from(this.modules.values()).filter((module) => module.supportedMovementTypes.includes(movementType));
  }

  static getAllModules(): AssessmentModuleConfig[] {
    return Array.from(this.modules.values());
  }
}

export interface AssessmentStorage {
  save(assessment: Assessment): Promise<void>;
  getById(id: string): Promise<Assessment | null>;
  getByType(type: AssessmentType, params?: PaginationParams): Promise<Assessment[]>;
  query(params: AssessmentQueryParams): Promise<Assessment[]>;
  getAll(params?: PaginationParams): Promise<Assessment[]>;
  delete(id: string): Promise<void>;
  update(id: string, assessment: Partial<Assessment>): Promise<void>;
}

export class LocalAssessmentStorage implements AssessmentStorage {
  private readonly storageKey = 'deeprehab_assessments';

  async save(assessment: Assessment): Promise<void> {
    const assessments = await this.getAll();
    const index = assessments.findIndex((a) => a.id === assessment.id);

    if (index >= 0) {
      assessments[index] = assessment;
    } else {
      assessments.unshift(assessment);
    }

    const limitedAssessments = assessments.slice(0, 100);
    localStorage.setItem(this.storageKey, JSON.stringify(limitedAssessments));
  }

  async getById(id: string): Promise<Assessment | null> {
    const assessments = await this.getAll();
    return assessments.find((a) => a.id === id) || null;
  }

  async getByType(type: AssessmentType, params?: PaginationParams): Promise<Assessment[]> {
    const assessments = await this.getAll(params);
    return assessments.filter((a) => a.type === type);
  }

  async query(params: AssessmentQueryParams): Promise<Assessment[]> {
    let assessments = await this.getAll({
      page: params.page,
      pageSize: params.pageSize,
    });

    if (params.patientId) {
      assessments = assessments.filter((a) => a.patientId === params.patientId);
    }

    if (params.type) {
      assessments = assessments.filter((a) => a.type === params.type);
    }

    if (params.subtype) {
      assessments = assessments.filter((a) => a.subtype === params.subtype);
    }

    if (params.dateFrom) {
      const from = params.dateFrom;
      assessments = assessments.filter((a) => a.timestamp >= from);
    }

    if (params.dateTo) {
      const to = params.dateTo;
      assessments = assessments.filter((a) => a.timestamp <= to);
    }

    if (params.status) {
      assessments = assessments.filter((a) => a.status === params.status);
    }

    return assessments;
  }

  async getAll(params?: PaginationParams): Promise<Assessment[]> {
    let assessments: Assessment[] = [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          assessments = parsed as Assessment[];
        }
      }
    } catch {
      assessments = [];
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? assessments.length;
    if (pageSize <= 0) return assessments;
    const start = Math.max(0, (page - 1) * pageSize);
    return assessments.slice(start, start + pageSize);
  }

  async delete(id: string): Promise<void> {
    const assessments = await this.getAll();
    const next = assessments.filter((a) => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
  }

  async update(id: string, assessment: Partial<Assessment>): Promise<void> {
    const assessments = await this.getAll();
    const index = assessments.findIndex((a) => a.id === id);
    if (index < 0) return;
    assessments[index] = { ...assessments[index], ...assessment };
    localStorage.setItem(this.storageKey, JSON.stringify(assessments));
  }
}
