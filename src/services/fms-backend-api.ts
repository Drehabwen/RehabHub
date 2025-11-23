// FMS后端API客户端
// 用于与Python后端进行健康检查通信

// API错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public type?: string,
    public timestamp?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 日志错误函数
function logError(error: ApiError) {
  console.error('API错误:', error);
}

// 执行请求函数
async function executeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    // 处理认证失败
    if (response.status === 401) {
      throw new ApiError('认证失败', 401, 'AUTH_ERROR');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP错误: ${response.status}`,
        response.status,
        'HTTP_ERROR'
      );
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
    
  } catch (error) {
    if (error instanceof ApiError) {
      logError(error);
      throw error;
    }
    
    const networkError = new ApiError(
      '网络连接失败',
      0,
      'NETWORK_ERROR',
      new Date().toISOString()
    );
    logError(networkError);
    throw networkError;
  }
}

// 通用请求方法
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = 'http://localhost:5000'; // 修正端口为5000
  const url = `${baseUrl}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };
  
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
  
  return executeRequest<T>(url, config);
}

// 获取健康状态
export async function getHealthStatus(): Promise<{ status: string; message?: string }> {
  try {
    return await request<{ status: string; message?: string }>('/health');
  } catch (error) {
    console.error('[ERROR] 健康状态检查失败', { error });
    throw error;
  }
}

// 检查API连接
export async function checkApiConnection(): Promise<boolean> {
  try {
    const result = await getHealthStatus();
    return result.status === 'ok';
  } catch (error) {
    return false;
  }
}

// 创建API客户端实例
export const fmsBackendApi = {
  getHealthStatus,
  checkApiConnection
};

// 导出默认对象
export default {
  getHealthStatus,
  checkApiConnection,
  fmsBackendApi
};