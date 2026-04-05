import React from 'react';

import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';

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
    navigateTo('video-analysis', { movement });
  };

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      {/* 顶部便当式布局 */}
      <div className="grid grid-cols-2 gap-4 h-auto md:h-[500px] mb-8">
        {/* 大板块：快速开始与说明 */}
        <div className="col-span-2 md:col-span-1 md:row-span-2 relative overflow-hidden rounded-3xl shadow-lg bg-white">
          <div className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">FMS 动作评估</h2>
              <p className="text-gray-500 text-lg">选择动作类型，系统将通过AI分析动作质量与规范性</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleSelectMovement(fmsMovements[0])}
                className="px-5 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.primary[500] }}
              >
                快速开始
              </button>
            </div>
          </div>
        </div>

        {/* 板块：类别入口 */}
        <div className="col-span-1 rounded-3xl shadow-lg bg-white p-6 cursor-pointer" onClick={() => handleSelectMovement(fmsMovements[0])}>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">🏋️</div>
          <div className="text-xl font-bold text-gray-800">下肢与核心</div>
          <div className="text-sm text-gray-500">深蹲、弓步、俯卧撑</div>
        </div>
        <div className="col-span-1 rounded-3xl shadow-lg bg-white p-6 cursor-pointer" onClick={() => handleSelectMovement(fmsMovements[3])}>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">👐</div>
          <div className="text-xl font-bold text-gray-800">上肢灵活性</div>
          <div className="text-sm text-gray-500">肩部活动度与稳定</div>
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
              minHeight: '240px'
            }}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary[100], color: colors.primary[700], fontWeight: typography.fontWeight.semibold }}>
                {index + 1}
              </div>
              <h3 className="text-lg ml-3" style={{ color: colors.primary[800], fontWeight: typography.fontWeight.semibold }}>{movement.name}</h3>
            </div>
            <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>{movement.description}</p>
            <div className="mt-auto flex justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[400] }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t text-center text-sm" style={{ borderColor: colors.neutral[200] }}>
        <p style={{ color: colors.text.secondary }}>© 2024 医疗康复评估系统 - 专业版</p>
        <p className="mt-1" style={{ color: colors.text.secondary }}>使用AI技术辅助康复评估，提高治疗效率</p>
      </div>
    </div>
  );
};

export default MovementSelection;
