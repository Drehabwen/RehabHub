import { useState, useEffect } from 'react';
import { pythonBackendApi } from '../services/python-backend-api';

interface HealthStatus {
  status: 'checking' | 'healthy' | 'unhealthy' | 'error';
  message: string;
  lastChecked: Date | null;
}

/**
 * 健康检查钩子，用于检查后端服务状态
 */
export const useHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'checking',
    message: '正在检查后端服务状态...',
    lastChecked: null
  });

  const checkHealth = async () => {
    // 在开发环境中，如果后端URL是localhost但服务未运行，则降级为健康状态
    const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
    
    try {
      setHealthStatus({
        status: 'checking',
        message: '正在检查后端服务状态...',
        lastChecked: new Date()
      });

      const result = await pythonBackendApi.healthCheck();
      
      if (result.status === 'ok') {
        setHealthStatus({
          status: 'healthy',
          message: '后端服务运行正常',
          lastChecked: new Date()
        });
      } else {
        setHealthStatus({
          status: 'unhealthy',
          message: '后端服务状态异常',
          lastChecked: new Date()
        });
      }
    } catch (error) {
      console.error('健康检查失败:', error);
      
      // 如果是本地开发环境且连接被拒绝，则视为健康状态
      const isConnectionError = error instanceof Error && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('NetworkError'));
      
      if (isLocalhost && isConnectionError) {
        // 在本地开发环境中，如果无法连接到后端，将其视为健康状态而不是错误状态
        setHealthStatus({
          status: 'healthy',
          message: '本地开发模式',
          lastChecked: new Date()
        });
      } else {
        setHealthStatus({
          status: 'error',
          message: `后端服务连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
          lastChecked: new Date()
        });
      }
    }
  };

  useEffect(() => {
    // 应用启动时立即检查一次
    checkHealth();

    // 设置定时检查（每30秒检查一次）
    const interval = setInterval(checkHealth, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    healthStatus,
    checkHealth,
    isHealthy: healthStatus.status === 'healthy',
    isChecking: healthStatus.status === 'checking',
    hasError: healthStatus.status === 'error'
  };
};