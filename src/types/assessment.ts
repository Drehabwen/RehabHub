// 评估系统核心类型定义

// 通用评分类型
export interface Score {
  value: number;
  maxValue: number;
  description?: string;
  feedback?: string;
}

// 评估指标类型
export interface Metric {
  id: string;
  name: string;
  score: Score;
  category: string;
  details?: Record<string, any>;
}

// 评估类型枚举
export type AssessmentType = 'FMS' | 'YBT' | 'SFMA' | 'VAS' | 'OSWESTRY' | 'SF36' | 'TUG' | 'OTHER';

// 评估状态枚举
export type AssessmentStatus = 'draft' | 'completed' | 'reviewed';

// 评估类型基础接口
export interface Assessment {
  id: string;
  type: AssessmentType; // 例如: 'FMS', 'YBT', 'SFMA', 'VAS', 'OSWESTRY', 'SF36', 'TUG'
  subtype: string; // 更具体的分类，如FMS中的具体动作名称或量表的具体类型
  patientId: string;
  assessorId?: string;
  timestamp: string;
  metrics: Metric[];
  overallScore: Score;
  recommendations?: string[];
  notes?: string;
  status: AssessmentStatus;
}

// FMS特定评估类型
export interface FmsAssessment extends Assessment {
  type: 'FMS';
  movementType: string;
  movementName: string;
  mobilityScore: Score;
  stabilityScore: Score;
  asymmetryDetected: boolean;
  compensationPatterns?: string[];
}

// 量表评估类型
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

// 分页参数接口
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 评估查询参数接口
export interface AssessmentQueryParams extends PaginationParams {
  patientId?: string;
  type?: AssessmentType;
  subtype?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: AssessmentStatus;
}

// 评估结果处理器接口
export interface AssessmentProcessor {
  process(data: any): Promise<Assessment>;
  getRecommendedExercises(assessment: Assessment): string[];
  generateReport(assessment: Assessment): string;
}

// 评估模块配置接口
export interface AssessmentModuleConfig {
  id: string;
  name: string;
  supportedMovementTypes: string[];
  processor: AssessmentProcessor;
  icon: React.ReactNode;
  description: string;
}

// 评估系统注册表
export class AssessmentSystemRegistry {
  private static modules: Map<string, AssessmentModuleConfig> = new Map();

  static registerModule(module: AssessmentModuleConfig) {
    this.modules.set(module.id, module);
  }

  static getModule(id: string): AssessmentModuleConfig | undefined {
    return this.modules.get(id);
  }

  static getModulesForMovement(movementType: string): AssessmentModuleConfig[] {
    return Array.from(this.modules.values()).filter(
      module => module.supportedMovementTypes.includes(movementType)
    );
  }

  static getAllModules(): AssessmentModuleConfig[] {
    return Array.from(this.modules.values());
  }
}

// 评估结果存储接口
export interface AssessmentStorage {
  // 保存评估数据
  save(assessment: Assessment): Promise<void>;
  
  // 根据ID获取评估数据
  getById(id: string): Promise<Assessment | null>;
  
  // 根据类型获取评估数据
  getByType(type: AssessmentType, params?: PaginationParams): Promise<Assessment[]>;
  
  // 查询评估数据
  query(params: AssessmentQueryParams): Promise<Assessment[]>;
  
  // 获取所有评估数据
  getAll(params?: PaginationParams): Promise<Assessment[]>;
  
  // 删除评估数据
  delete(id: string): Promise<void>;
  
  // 更新评估数据
  update(id: string, assessment: Partial<Assessment>): Promise<void>;
}

// 示例本地存储实现
export class LocalAssessmentStorage implements AssessmentStorage {
  private readonly storageKey = 'deeprehab_assessments';

  async save(assessment: Assessment): Promise<void> {
    const assessments = await this.getAll();
    const index = assessments.findIndex(a => a.id === assessment.id);
    
    if (index >= 0) {
      assessments[index] = assessment;
    } else {
      assessments.unshift(assessment);
    }
    
    // 限制存储数量，保留最近100条
    const limitedAssessments = assessments.slice(0, 100);
    localStorage.setItem(this.storageKey, JSON.stringify(limitedAssessments));
  }

  async getById(id: string): Promise<Assessment | null> {
    const assessments = await this.getAll();
    return assessments.find(a => a.id === id) || null;
  }

  async getByType(type: AssessmentType, params?: PaginationParams): Promise<Assessment[]> {
    const assessments = await this.getAll(params);
    return assessments.filter(a => a.type === type);
  }

  async query(params: AssessmentQueryParams): Promise<Assessment[]> {
    let assessments = await this.getAll({
      page: params.page,
      pageSize: params.pageSize
    });

    // 根据查询参数过滤
    if (params.patientId) {
      assessments = assessments.filter(a => a.patientId === params.patientId);
    }
    
    if (params.type) {
      assessments = assessments.filter(a => a.type === params.type);
    }
    
    if (params.subtype) {
      assessments = assessments.filter(a => a.subtype === params.subtype);
    }
    
    if (params.dateFrom) {
      const from = params.dateFrom;
      assessments = assessments.filter(a => a.timestamp >= from);
    }
    
    if (params.dateTo) {
      const to = params.dateTo;
      assessments = assessments.filter(a => a.timestamp <= to);
    }
    
    if (params.status) {
      assessments = assessments.filter(a => a.status === params.status);
    }

    return assessments;
  }

  async getAll(params?: PaginationParams): Promise<Assessment[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      let assessments: Assessment[] = data ? JSON.parse(data) : [];
      
      // 如果提供了分页参数，则进行分页处理
      if (params?.page !== undefined && params?.pageSize !== undefined) {
        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        assessments = assessments.slice(startIndex, endIndex);
      }
      
      return assessments;
    } catch (error) {
      console.error('Failed to load assessments from localStorage:', error);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    const assessments = await this.getAll();
    const filtered = assessments.filter(a => a.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
  
  async update(id: string, assessmentUpdates: Partial<Assessment>): Promise<void> {
    const assessments = await this.getAll();
    const index = assessments.findIndex(a => a.id === id);
    
    if (index >= 0) {
      // 合并更新
      assessments[index] = { ...assessments[index], ...assessmentUpdates };
      localStorage.setItem(this.storageKey, JSON.stringify(assessments));
    } else {
      throw new Error(`Assessment with id ${id} not found`);
    }
  }
}
