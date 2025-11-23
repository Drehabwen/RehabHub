import React from 'react';
import { theme } from '../../theme/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  fullWidth = false,
  children,
  ...props 
}) => {
  // 触摸反馈状态
  const [isPressed, setIsPressed] = React.useState(false);
  // 获取尺寸样式
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      case 'medium':
      default:
        return 'px-4 py-2 text-base';
    }
  };

  // 获取变体样式
  const getVariantClasses = () => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return 'bg-primary/50 text-white cursor-not-allowed';
        case 'outline':
          return 'bg-transparent border border-gray-300 text-gray-400 cursor-not-allowed';
        case 'text':
          return 'bg-transparent text-gray-400 cursor-not-allowed';
        case 'secondary':
        default:
          return 'bg-primary/20 text-gray-400 cursor-not-allowed';
      }
    }

    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0';
      case 'secondary':
        return 'bg-primary/20 text-gray-800 hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0';
      case 'outline':
        return 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0';
      case 'text':
        return 'bg-transparent text-primary hover:bg-primary/10 hover:-translate-y-0.5 active:translate-y-0';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  // 基础样式
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50`;
  
  // 组合所有类名
  const classes = `${baseClasses} ${getSizeClasses()} ${getVariantClasses()} ${fullWidth ? 'w-full' : ''} ${isPressed ? 'transform scale-95' : ''}`;

  // 触摸相关事件处理
  const handleTouchStart = () => {
    setIsPressed(true);
  };
  
  const handleTouchEnd = () => {
    setIsPressed(false);
  };
  
  const handleTouchCancel = () => {
    setIsPressed(false);
  };
  
  // 鼠标相关事件处理
  const handleMouseDown = () => {
    setIsPressed(true);
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
  };
  
  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <button
      className={classes}
      disabled={disabled}
      style={{
        border: variant === 'outline' && !disabled ? `2px solid ${theme.colors.primary}` : 'none',
        borderRadius: theme.borderRadius.medium,
        touchAction: 'manipulation',
        userSelect: 'none',
        minHeight: size === 'small' ? '36px' : size === 'medium' ? '48px' : '56px',
        minWidth: '80px'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

// 导出为命名导出和默认导出
export { Button };
export default Button;