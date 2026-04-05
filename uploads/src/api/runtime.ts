export interface RuntimeConfig {
  apiBaseUrl?: string;
  backendBaseUrl?: string;
  pluginMode?: boolean;
  defaultModule?: string;
  hideNavigation?: boolean;
}

const RUNTIME_CONFIG_KEY = '__REHAB_RUNTIME_CONFIG__';
let runtimeConfig: RuntimeConfig = {};

function normalizeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.replace(/\/+$/, '');
}

function getGlobalRuntimeConfig(): RuntimeConfig {
  if (typeof window === 'undefined') {
    return {};
  }

  return ((window as any)[RUNTIME_CONFIG_KEY] ?? {}) as RuntimeConfig;
}

function getEnvApiBaseUrl(): string {
  return normalizeUrl(import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001')!;
}

function getEnvBackendBaseUrl(): string {
  return normalizeUrl(import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000')!;
}

export function setRuntimeConfig(config: Partial<RuntimeConfig & { apiUrl?: string }>): RuntimeConfig {
  const normalized: RuntimeConfig = {
    apiBaseUrl: normalizeUrl(config.apiBaseUrl ?? config.apiUrl),
    backendBaseUrl: normalizeUrl(config.backendBaseUrl),
    pluginMode: config.pluginMode,
    defaultModule: config.defaultModule,
    hideNavigation: config.hideNavigation,
  };

  runtimeConfig = {
    ...getGlobalRuntimeConfig(),
    ...runtimeConfig,
    ...Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== undefined)),
  };

  if (typeof window !== 'undefined') {
    (window as any)[RUNTIME_CONFIG_KEY] = runtimeConfig;
  }

  return getRuntimeConfig();
}

export function getRuntimeConfig(): RuntimeConfig {
  const globalConfig = getGlobalRuntimeConfig();

  return {
    ...globalConfig,
    ...runtimeConfig,
    apiBaseUrl: normalizeUrl(runtimeConfig.apiBaseUrl || globalConfig.apiBaseUrl) || getEnvApiBaseUrl(),
    backendBaseUrl: normalizeUrl(runtimeConfig.backendBaseUrl || globalConfig.backendBaseUrl) || getEnvBackendBaseUrl(),
    pluginMode: runtimeConfig.pluginMode ?? globalConfig.pluginMode,
    defaultModule: runtimeConfig.defaultModule ?? globalConfig.defaultModule,
    hideNavigation: runtimeConfig.hideNavigation ?? globalConfig.hideNavigation,
  };
}

export function resolveApiBaseUrl(): string {
  const config = getRuntimeConfig();
  return normalizeUrl(config.apiBaseUrl) || getEnvApiBaseUrl();
}

export function resolveBackendBaseUrl(): string {
  const config = getRuntimeConfig();
  return normalizeUrl(config.backendBaseUrl || config.apiBaseUrl) || getEnvBackendBaseUrl();
}
