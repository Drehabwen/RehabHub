import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { PluginProvider, PluginConfig } from './contexts/PluginContext';
import { setRuntimeConfig } from './api/runtime';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const initRehabPlugin = (config: PluginConfig = {}) => {
  const {
    containerId = 'rehab-hub-plugin-root',
    apiBaseUrl,
    backendBaseUrl,
    apiUrl,
  } = config;

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'rehab-hub-plugin-container';
    document.body.appendChild(container);
  }

  setRuntimeConfig({
    apiBaseUrl: apiBaseUrl ?? apiUrl,
    backendBaseUrl,
    pluginMode: true,
    defaultModule: config.defaultModule,
    hideNavigation: config.hideNavigation,
  });

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <PluginProvider config={config}>
          <App />
        </PluginProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );

  return {
    destroy: () => root.unmount(),
    navigateTo: (moduleName: string) => {
      window.dispatchEvent(new CustomEvent('rehab-navigate', { detail: moduleName }));
    }
  };
};

if (typeof window !== 'undefined') {
  (window as any).RehabHub = { init: initRehabPlugin };
}
