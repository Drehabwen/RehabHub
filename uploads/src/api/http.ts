import { resolveApiBaseUrl, resolveBackendBaseUrl } from './runtime';
import { isApiResponse, readJsonSafe } from './types';

type Target = 'api' | 'backend';
type QueryValue = string | number | boolean | undefined | null;

function joinUrl(baseUrl: string, endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  if (endpoint.startsWith('/')) {
    return `${baseUrl}${endpoint}`;
  }

  return `${baseUrl}/${endpoint}`;
}

function buildUrl(endpoint: string, baseUrl: string, params?: Record<string, QueryValue>): string {
  const url = new URL(joinUrl(baseUrl, endpoint));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

function withDefaultHeaders(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const body = init.body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...init,
    headers,
  };
}

export class HttpClient {
  constructor(private readonly target: Target) {}

  private getBaseUrl(): string {
    return this.target === 'backend' ? resolveBackendBaseUrl() : resolveApiBaseUrl();
  }

  private async request<T>(
    endpoint: string,
    init: RequestInit = {},
    params?: Record<string, QueryValue>
  ): Promise<T> {
    const response = await fetch(buildUrl(endpoint, this.getBaseUrl(), params), withDefaultHeaders(init));
    const payload = await readJsonSafe(response);

    if (!response.ok) {
      if (isApiResponse<unknown>(payload)) {
        throw new Error(payload.message || `HTTP error: ${response.status}`);
      }
      const message = payload && typeof payload === 'object' ? (payload as any).message : undefined;
      throw new Error(message || `HTTP error: ${response.status}`);
    }

    if (isApiResponse<T>(payload)) {
      if (payload.code !== 200) {
        throw new Error(payload.message || 'Request failed');
      }
      return payload.data;
    }

    return payload as T;
  }

  get<T>(endpoint: string, params?: Record<string, QueryValue>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, params);
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const appApiClient = new HttpClient('api');
export const backendApiClient = new HttpClient('backend');
