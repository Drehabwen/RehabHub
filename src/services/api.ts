// 模块化API服务管理系统

// 导入关键点类型
import { Keypoint } from '../types/keypoints';

// 定义类型
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
  keypoints?: Keypoint[]; // 添加关键点数据字段
}

// API基础配置
const API_CONFIG = {
  baseUrl: process.env.VITE_BACKEND_URL || process.env.VITE_API_URL || 'http://localhost:8000', // 优先使用环境变量，默认8000
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// 模块API配置接口
export interface ModuleApiConfig {
  moduleId: string;
  baseUrl?: string; // 可选的模块独立API地址
  endpoints: Record<string, string>; // API端点映射
  isExternal?: boolean; // 是否为外部API
}

// 已注册的模块API配置
const moduleApis: Record<string, ModuleApiConfig> = {
  'video-analysis': {
    moduleId: 'video-analysis',
    endpoints: {
      analyze: '/api/analyze',
      uploadVideo: '/api/video/upload',
      captureVideo: '/api/video/capture'
    }
  },
  'results-history': {
    moduleId: 'results-history',
    endpoints: {
      getHistory: '/api/results',
      getResultDetail: '/api/results/:id',
      deleteResult: '/api/results/:id'
    }
  },
  'settings': {
    moduleId: 'settings',
    endpoints: {
      getSettings: '/api/settings',
      updateSettings: '/api/settings'
    }
  }
};

// API客户端类
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: { baseUrl: string; defaultHeaders: Record<string, string> }) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.defaultHeaders;
  }

  // 通用GET请求
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(this.baseUrl + endpoint);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.defaultHeaders
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 通用POST请求
  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 文件上传POST请求
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 通用DELETE请求
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'DELETE',
      headers: this.defaultHeaders
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// 获取模块API客户端
export function getModuleApi(moduleId: string): ApiClient {
  const moduleConfig = moduleApis[moduleId];
  if (!moduleConfig) {
    throw new Error(`未找到模块API配置: ${moduleId}`);
  }

  const baseUrl = moduleConfig.baseUrl || API_CONFIG.baseUrl;
  return new ApiClient({
    baseUrl,
    defaultHeaders: API_CONFIG.defaultHeaders
  });
}

// 注册新的模块API配置
export function registerModuleApi(config: ModuleApiConfig): void {
  moduleApis[config.moduleId] = config;
}

// 获取所有已注册的模块API配置
export function getAllModuleApis(): Record<string, ModuleApiConfig> {
  return { ...moduleApis };
}

// 为兼容旧代码，保留原始的analyzeVideo函数
export const analyzeVideo = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    console.log('API调用开始', {
      fileType: request.video.type,
      fileName: request.video.name,
      fileSize: request.video.size
    });
    
    // 使用新的模块化API客户端
    const apiClient = getModuleApi('video-analysis');
    const formData = new FormData();
    formData.append('file', request.video);
    
    // 使用模块配置中定义的端点
    const moduleConfig = moduleApis['video-analysis'];
    const endpoint = moduleConfig.endpoints.analyze;
    const data = await apiClient.upload<AnalysisResponse>(endpoint, formData);
    console.log('API调用成功，返回数据:', data);
    return data;
  } catch (error) {
    console.error('视频分析API调用失败:', error);
    throw error;
  }
};

export const fetchDashboardStats = async (): Promise<any[]> => {
  // 模拟数据
  return [
    {
      title: '今日评估',
      value: '12',
      icon: 'activity',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      title: '总患者数',
      value: '45',
      icon: 'users',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      trend: { value: 5, isPositive: true }
    },
    {
      title: '完成率',
      value: '85%',
      icon: 'check-circle',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: '待处理',
      value: '3',
      icon: 'clock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      trend: { value: 2, isPositive: false }
    }
  ];
};

// 流式上传关键点与角度数据
export const postPoseTelemetry = async (payload: {
  movementType: string;
  movementName?: string;
  timestamp: string;
  angles: Record<string, number>;
  keypoints: Keypoint[];
}): Promise<any> => {
  const apiClient = getModuleApi('video-analysis');
  // 指向 Python 后端的新端点
  return apiClient.post<any>('/api/v1/assessment/analyze', payload);
};

// 默认导出
export default {
  getModuleApi,
  registerModuleApi,
  getAllModuleApis,
  analyzeVideo,
  fetchDashboardStats,
  // 兼容使用默认导出访问
  postPoseTelemetry
};



// 历史列表
export const getResults = async (page = 1, size = 20): Promise<{ items: any[]; total: number; page: number; size: number }> => {
  const apiClient = getModuleApi('video-analysis');
  return apiClient.get<{ items: any[]; total: number; page: number; size: number }>('/api/results', { page: String(page), size: String(size) });
};

// 详情
export const getResultDetail = async (id: string): Promise<any> => {
  const apiClient = getModuleApi('video-analysis');
  return apiClient.get<any>(`/api/results/${id}`);
};

// 删除
export const deleteResult = async (id: string): Promise<{ status: string }> => {
  const apiClient = getModuleApi('video-analysis');
  return apiClient.delete<{ status: string }>(`/api/results/${id}`);
};
