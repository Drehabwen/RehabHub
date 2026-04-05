import React, { createContext, useContext } from 'react';

export interface PluginConfig {
  containerId?: string;
  apiBaseUrl?: string;
  backendBaseUrl?: string;
  apiUrl?: string;
  theme?: 'light' | 'dark';
  defaultModule?: string;
  hideNavigation?: boolean;
  onAction?: (action: string, data: any) => void;
}

const PluginContext = createContext<PluginConfig | null>(null);

export const usePluginConfig = () => useContext(PluginContext);

export const PluginProvider: React.FC<{ config: PluginConfig; children: React.ReactNode }> = ({ config, children }) => (
  <PluginContext.Provider value={config}>
    {children}
  </PluginContext.Provider>
);
