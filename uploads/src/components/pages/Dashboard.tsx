import React from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: colors.backgroundSecondary }}>
      {/* 主标题 */}
      <div className="text-center mb-12">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: colors.textPrimary }}
        >
          亚当斯数字化筛查
        </h1>
        <p 
          className="text-lg md:text-xl"
          style={{ color: colors.textSecondary }}
        >
          脊柱侧弯快速筛查系统
        </p>
      </div>

      {/* 筛查按钮 */}
      <button
        onClick={handleStartScreening}
        className="
          w-full max-w-md 
          py-6 px-8 
          rounded-2xl 
          text-white 
          text-xl md:text-2xl 
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
        "
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
          focusRing: colors.primaryLight
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 md:h-10 md:w-10" 
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
          开始筛查
        </div>
      </button>

      {/* 底部说明文字 */}
      <div className="mt-8 text-center">
        <p 
          className="text-sm md:text-base"
          style={{ color: colors.textLight }}
        >
          点击按钮开始亚当斯前屈测试筛查
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
