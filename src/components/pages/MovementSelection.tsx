import React from 'react';

import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import Button from '../ui/Button';

// 定义FMS动作类型
interface FmsMovement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// FMS动作列表
const fmsMovements: FmsMovement[] = [
  {
    id: 'deep-squat',
    name: '深蹲',
    description: '评估下肢、核心稳定性和活动度',
    icon: <span>●</span>
  },
  {
    id: 'hurdle-step',
    name: '跨栏步',
    description: '评估单腿站立平衡能力',
    icon: <span>⋯</span>
  },
  {
    id: 'inline-lunge',
    name: '直线弓步',
    description: '评估髋、膝、踝关节稳定性',
    icon: <span>📊</span>
  },
  {
    id: 'shoulder-mobility',
    name: '肩部灵活性',
    description: '评估肩带活动范围',
    icon: <span>⚙️</span>
  },
  {
    id: 'active-straight-leg-raise',
    name: '主动直腿抬高',
    description: '评估后侧链柔韧性',
    icon: <span>↕️</span>
  },
  {
    id: 'trunk-stability-pushup',
    name: '躯干稳定俯卧撑',
    description: '评估核心稳定性',
    icon: <span>📋</span>
  },
  {
    id: 'rotary-stability',
    name: '旋转稳定性',
    description: '评估多平面核心控制能力',
    icon: <span>⭕</span>
  }
];

const MovementSelection: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleSelectMovement = (movement: FmsMovement) => {
    navigateTo(movement.id, { movement });
  };

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      {/* 返回按钮 */}
      <div className="mb-6 flex justify-start">
        <Button
          variant="secondary"
          size="medium"
          onClick={() => navigateTo('dashboard')}
          className="transition-colors duration-300"
          style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
          aria-label="返回仪表盘"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回仪表盘
        </Button>
      </div>
      
      {/* 页面标题和描述 */}
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: colors.primary[100] }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
          color: colors.primary[800], 
          fontWeight: typography.fontWeight.bold
        }}>功能性动作评估 (FMS)</h1>
        <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
          选择需要进行评估的动作类型，系统将通过AI技术分析动作质量和规范性
        </p>
        <div className="mt-4 text-sm" style={{ color: colors.text.secondary }}>
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            提示: 确保拍摄环境光线充足，穿着便于观察动作的衣物
          </span>
        </div>
      </div>
      
      {/* 动作卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {fmsMovements.map((movement, index) => (
          <div 
            key={movement.id}
            onClick={() => handleSelectMovement(movement)}
            className="p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border shadow-md hover:shadow-lg"
            style={{
              backgroundColor: colors.background.paper,
              borderRadius: '12px',
              borderColor: colors.primary[50],
              minHeight: '280px'
            }}
          >
            {/* 序号和图标 */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary[100], color: colors.primary[700], fontWeight: typography.fontWeight.semibold }}>
                {index + 1}
              </div>
              <h3 className="text-lg ml-3" style={{ 
                color: colors.primary[800], 
                fontWeight: typography.fontWeight.semibold
              }}>{movement.name}</h3>
            </div>
            
            {/* 描述文本 */}
            <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>{movement.description}</p>
            
            {/* 动作图示 */}
            <div className="w-full h-32 sm:h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.primary[50] }}>
              <div className="text-5xl opacity-70">
                {index === 0 && '🏋️'}
                {index === 1 && '🚶'}
                {index === 2 && '🦿'}
                {index === 3 && '👐'}
                {index === 4 && '🦵'}
                {index === 5 && '👨‍💻'}
                {index === 6 && '🔄'}
              </div>
            </div>
            
            {/* 底部标签 */}
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs" style={{ color: colors.primary[500], fontWeight: typography.fontWeight.medium }}>FMS 标准动作</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[400] }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      {/* 页脚 */}
      <div className="mt-10 pt-6 border-t text-center text-sm" style={{ borderColor: colors.neutral[200] }}>
        <p style={{ color: colors.text.secondary }}>© 2024 医疗康复评估系统 - 专业版</p>
        <p className="mt-1" style={{ color: colors.text.secondary }}>使用AI技术辅助康复评估，提高治疗效率</p>
      </div>
    </div>
  );
};

export default MovementSelection;