import { resolveBackendBaseUrl } from '../api/runtime';

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

function logError(error: ApiError) {
  console.error('API error:', error);
}

async function executeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      throw new ApiError('Authentication failed', 401, 'AUTH_ERROR');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error: ${response.status}`,
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
      'Network request failed',
      0,
      'NETWORK_ERROR',
      new Date().toISOString()
    );
    logError(networkError);
    throw networkError;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${resolveBackendBaseUrl()}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

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

export async function getHealthStatus(): Promise<{ status: string; message?: string }> {
  try {
    return await request<{ status: string; message?: string }>('/health');
  } catch (error) {
    console.error('[ERROR] Health check failed', { error });
    throw error;
  }
}

export async function checkApiConnection(): Promise<boolean> {
  try {
    const result = await getHealthStatus();
    return result.status === 'ok';
  } catch {
    return false;
  }
}

export const fmsBackendApi = {
  getHealthStatus,
  checkApiConnection
};

export default {
  getHealthStatus,
  checkApiConnection,
  fmsBackendApi
};
