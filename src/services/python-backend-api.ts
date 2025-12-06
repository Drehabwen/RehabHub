// Python后端API客户端
// 用于与Python后端进行通信

import { AnalysisRequest, AnalysisResponse } from './api';

// 定义缺失的类型接口
export interface Patient {
  id: string;
  name: string;
  [key: string]: any;
}

export interface MovementType {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

// Python后端API响应格式
interface PythonApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// 错误处理类
class ApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Python后端API客户端
class PythonBackendApi {
  private baseUrl: string;
  private accessToken: string | null = null;
  
  constructor() {
    // 使用更安全的方式访问环境变量，避免TypeScript错误
    this.baseUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8000';
    this.loadToken();
  }
  
  // 加载访问令牌
  private loadToken() {
    this.accessToken = localStorage.getItem('access_token');
  }
  
  // 健康检查
  async healthCheck(): Promise<{ status: string; message?: string }> {
    return await this.request('/health');
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    // 添加认证头
    if (this.accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    // 如果不是FormData，添加Content-Type
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      
      // 处理认证失败
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new ApiError('认证失败，请重新登录', 401);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP错误: ${response.status}`,
          response.status,
          errorData
        );
      }
      
      const result: PythonApiResponse<T> = await response.json();
      
      // 检查业务状态码
      if (result.code !== 200) {
        throw new ApiError(result.message, result.code, result.data);
      }
      
      return result.data;
      
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : '网络请求失败',
        0,
        error
      );
    }
  }
  
  // 处理认证失败
  private handleUnauthorized() {
    localStorage.removeItem('access_token');
    this.accessToken = null;
    // 可以在这里添加跳转到登录页的逻辑
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  
  // ==================== 认证相关API ====================
  
  // 用户登录
  async login(credentials: { username: string; password: string }) {
    const result = await this.request<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user: {
        id: string;
        username: string;
        role: 'admin' | 'therapist' | 'patient';
      };
    }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // 保存token
    localStorage.setItem('access_token', result.access_token);
    this.accessToken = result.access_token;
    
    return result;
  }
  
  // 用户登出
  async logout() {
    await this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
    
    localStorage.removeItem('access_token');
    this.accessToken = null;
  }
  

  
  // ==================== 视频分析API ====================
  
  // 视频分析
  async analyzeVideo(request: AnalysisRequest): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('video', request.video);
    
    // 可以添加其他参数
    if ((request as any).movement_type) {
      formData.append('movement_type', (request as any).movement_type);
    }
    if ((request as any).patient_id) {
      formData.append('patient_id', (request as any).patient_id);
    }
    
    return await this.request<AnalysisResponse>('/api/v1/video/analyze', {
      method: 'POST',
      body: formData,
    });
  }
  
  // 获取分析结果
  async getAnalysisResult(analysisId: string): Promise<AnalysisResponse> {
    return await this.request<AnalysisResponse>(`/api/v1/video/analysis/${analysisId}`);
  }
  
  // 获取分析进度
  async getAnalysisProgress(analysisId: string): Promise<{
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    estimated_time?: string;
  }> {
    return await this.request(`/api/v1/video/analysis/${analysisId}/progress`);
  }
  
  // ==================== 患者管理API ====================
  
  // 获取患者列表
  async getPatients(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<{
    patients: Patient[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/v1/patients?${queryString}` : '/api/v1/patients';
    
    return await this.request(endpoint);
  }
  
  // 创建患者
  async createPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    return await this.request<Patient>('/api/v1/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }
  
  // 获取患者详情
  async getPatient(patientId: string): Promise<Patient> {
    return await this.request<Patient>(`/api/v1/patients/${patientId}`);
  }
  
  // 更新患者信息
  async updatePatient(patientId: string, patientData: Partial<Patient>): Promise<Patient> {
    return await this.request<Patient>(`/api/v1/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }
  
  // 删除患者
  async deletePatient(patientId: string): Promise<void> {
    await this.request(`/api/v1/patients/${patientId}`, {
      method: 'DELETE',
    });
  }
  
  // ==================== 动作评估API ====================
  
  // 获取支持的动作类型
  async getMovementTypes(): Promise<MovementType[]> {
    return await this.request<MovementType[]>('/api/v1/movements');
  }
  
  // 获取特定动作详情
  async getMovementType(movementId: string): Promise<MovementType> {
    return await this.request<MovementType>(`/api/v1/movements/${movementId}`);
  }
  
  // ==================== 历史记录API ====================
  
  // 获取分析历史
  async getAnalysisHistory(params?: {
    page?: number;
    pageSize?: number;
    patient_id?: string;
    movement_type?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{
    records: Array<{
      id: string;
      patient_name: string;
      movement_type: string;
      score: number;
      analysis_date: string;
      video_thumbnail?: string;
      status: 'completed' | 'failed';
    }>;
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.movement_type) queryParams.append('movement_type', params.movement_type);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/v1/video/history?${queryString}` : '/api/v1/video/history';
    
    return await this.request(endpoint);
  }
  
  // 获取历史记录详情
  async getAnalysisHistoryDetail(recordId: string): Promise<any> {
    return await this.request(`/api/v1/video/history/${recordId}`);
  }
  
  // ==================== 系统管理API ====================
  
  // 获取系统统计
  async getSystemStats(): Promise<{
    total_patients: number;
    total_assessments: number;
    average_score: number;
    assessments_by_movement: Record<string, number>;
    recent_activity: Array<{ date: string; count: number }>;
  }> {
    return await this.request('/api/v1/system/stats');
  }
}

// 创建全局实例
export const pythonBackendApi = new PythonBackendApi();

// 导出类型
export type { ApiError };