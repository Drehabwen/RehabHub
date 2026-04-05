import React from 'react';
import { colors } from '../../theme';

interface ScreeningButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  primaryColor?: string;
  primaryLightColor?: string;
}

/**
 * 筛查按钮组件
 * 响应式设计，适配手机、平板、桌面
 * 支持自定义颜色主题
 */
export const ScreeningButton: React.FC<ScreeningButtonProps> = ({
  onClick,
  label = '开始筛查',
  icon,
  disabled = false,
  className = '',
  primaryColor = colors.primary,
  primaryLightColor = colors.primaryLight
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full max-w-xs sm:max-w-sm md:max-w-md 
        py-5 px-6 sm:py-6 sm:px-8
        rounded-2xl 
        text-white 
        text-lg sm:text-xl md:text-2xl 
        font-bold
        shadow-lg
        transform 
        transition-all 
        duration-300
        hover:shadow-xl
        hover:scale-105
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-opacity-50
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:transform-none
        ${className}
      `}
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryLightColor} 100%)`
      }}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {icon && (
          <span className="shrink-0">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </div>
    </button>
  );
};

export default ScreeningButton;
