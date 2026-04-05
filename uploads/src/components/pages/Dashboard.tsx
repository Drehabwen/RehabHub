import React from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { ScreeningButton } from '../ui/ScreeningButton';

/**
 * 极简版仪表盘
 * 只保留一个筛查按钮
 */
const Dashboard: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleStartScreening = () => {
    // 直接跳转到亚当斯测试
    navigateTo('adams-test');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" style={{ backgroundColor: colors.backgroundSecondary }}>
      {/* 主标题 */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 w-full max-w-2xl">
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
          style={{ color: colors.textPrimary }}
        >
          亚当斯数字化筛查
        </h1>
        <p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl"
          style={{ color: colors.textSecondary }}
        >
          脊柱侧弯快速筛查系统
        </p>
      </div>

      {/* 筛查按钮 - 使用可复用组件 */}
      <ScreeningButton
        onClick={handleStartScreening}
        label="开始筛查"
        icon={
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
            />
          </svg>
        }
      />

      {/* 底部说明文字 */}
      <div className="mt-6 sm:mt-8 text-center px-4">
        <p 
          className="text-xs sm:text-sm md:text-base"
          style={{ color: colors.textLight }}
        >
          点击按钮开始亚当斯前屈测试筛查
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
