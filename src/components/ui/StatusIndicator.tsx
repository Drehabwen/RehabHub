import React from 'react';
import { colors, typography } from '../../theme';

interface StatusIndicatorProps {
  status: 'healthy' | 'unhealthy' | 'checking' | 'error';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

// 定义尺寸常量
const getDotSize = (size: StatusIndicatorProps['size']) => {
  switch (size) {
    case 'small':
      return '8px';
    case 'large':
      return '16px';
    default:
      return '12px';
  }
};

// 获取状态颜色
const getStatusColor = (status: StatusIndicatorProps['status']) => {
  switch (status) {
    case 'healthy':
      return colors.success[500];
    case 'unhealthy':
      return colors.error[500];
    case 'checking':
      return colors.warning[500];
    case 'error':
      return colors.error[500];
    default:
      return colors.text.secondary;
  }
};

// 获取字体大小
const getFontSize = (size: StatusIndicatorProps['size']) => {
  switch (size) {
    case 'small':
      return typography.fontSize.sm;
    case 'large':
      return typography.fontSize.lg;
    default:
      return typography.fontSize.base;
  }
};

// 获取文本颜色
const getTextColor = (status: StatusIndicatorProps['status']) => {
  switch (status) {
    case 'healthy':
      return colors.text.primary;
    case 'unhealthy':
      return colors.error[500];
    case 'checking':
      return colors.text.secondary;
    case 'error':
      return colors.error[500];
    default:
      return colors.text.secondary;
  }
};

// 内联样式组件
const IndicatorContainer: React.FC<{
  size: StatusIndicatorProps['size'];
  children: React.ReactNode;
}> = ({ size, children }) => {
  return (
    <div 
      className="flex items-center gap-2"
      style={{ fontSize: getFontSize(size) }}
    >
      {children}
    </div>
  );
};

const IndicatorDot: React.FC<{
  status: StatusIndicatorProps['status'];
  size: StatusIndicatorProps['size'];
}> = ({ status, size }) => {
  const isChecking = status === 'checking';
  const dotSize = getDotSize(size);
  const color = getStatusColor(status);
  
  return (
    <div
      className={`rounded-full ${isChecking ? 'animate-pulse' : ''}`}
      style={{
        width: dotSize,
        height: dotSize,
        backgroundColor: color,
        ...(isChecking ? {
          animation: 'pulse 1.5s infinite',
        } : {})
      }}
    />
  );
};

const IndicatorText: React.FC<{
  status: StatusIndicatorProps['status'];
  children: React.ReactNode;
}> = ({ status, children }) => {
  return (
    <span
      className="font-medium"
      style={{
        fontFamily: typography.fontFamily,
        fontWeight: typography.fontWeight.medium,
        color: getTextColor(status),
      }}
    >
      {children}
    </span>
  );
};

// 添加CSS动画
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.1);
      }
    }
  `;
  document.head.appendChild(style);
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'medium',
  showText = true,
}) => {
  const getStatusText = () => {
    // 在本地开发环境中隐藏连接错误提示
    const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const isLocalDevelopment = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
    
    switch (status) {
      case 'healthy':
        return '系统正常';
      case 'unhealthy':
        return '系统异常';
      case 'checking':
        return '检查中...';
      case 'error':
        // 如果是本地开发环境，则不显示错误信息
        return isLocalDevelopment ? '' : '连接错误';
      default:
        return '未知状态';
    }
  };

  // 如果是本地开发环境且状态为error，不显示任何内容
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const isLocalDevelopment = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
  const statusText = getStatusText();
  
  if (isLocalDevelopment && status === 'error' && !statusText) {
    return null;
  }

  return (
    <IndicatorContainer size={size}>
      <IndicatorDot status={status} size={size} />
      {showText && statusText && (
        <IndicatorText status={status}>
          {statusText}
        </IndicatorText>
      )}
    </IndicatorContainer>
  );
};

// 导出为命名导出和默认导出
// 这样在其他组件中可以同时支持 import StatusIndicator from './StatusIndicator'
// 和 import { StatusIndicator } from './StatusIndicator'
export { StatusIndicator };
export default StatusIndicator;