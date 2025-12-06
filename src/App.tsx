import React, { useState } from 'react';
import VideoAnalysis from './VideoAnalysis';


import Dashboard from './components/pages/Dashboard';
import StatusIndicatorExample from './components/pages/StatusIndicatorExample';
import ComponentTestPage from './components/pages/ComponentTestPage';
import { colors, components, typography } from './theme';
import { 
  goToMovementSelection, 
  goToHome,
  // goToStatusIndicatorExample, // 已注释，未使用
  // goToComponentTest // 已注释，未使用
} from './utils/navigation';

// 动态导入FMS动作模块
const DeepSquatAnalysis = React.lazy(() => import('./movements/deep-squat'));
const HurdleStepAnalysis = React.lazy(() => import('./movements/hurdle-step'));
const InlineLungeAnalysis = React.lazy(() => import('./movements/inline-lunge'));
const ShoulderMobilityAnalysis = React.lazy(() => import('./movements/shoulder-mobility'));
const ActiveStraightLegRaiseAnalysis = React.lazy(() => import('./movements/active-straight-leg-raise'));
const TrunkStabilityPushupAnalysis = React.lazy(() => import('./movements/trunk-stability-pushup'));
const RotaryStabilityAnalysis = React.lazy(() => import('./movements/rotary-stability'));

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

// 动作评估系统组件 - 医疗风格设计和移动端适配
const MovementSelection = ({ onSelectMovement }: { onSelectMovement: (movement: FmsMovement) => void }) => {
  return (
    <div className="space-y-6 p-4 md:p-8 min-h-screen" style={{ backgroundColor: colors.background.default }}>
      {/* 返回按钮和顶部装饰 - 移动端适配 */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={goToHome}
          className="flex items-center transition-all duration-300 rounded-full shadow-sm hover:shadow active:scale-95" 
          style={{ 
            color: colors.primary[600], 
            backgroundColor: colors.neutral[100], 
            padding: '12px 16px', // 增加触摸目标大小
            minHeight: '48px' // 确保足够的高度
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </button>
        <div className="hidden sm:block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary[100], color: colors.primary[800], fontWeight: typography.fontWeight.semibold }}>
          医疗专业版 v1.0
        </div>
      </div>
      
      {/* 页面标题和描述 - 医疗风格设计和移动端适配 */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-block p-2 rounded-full mb-4 mx-auto" style={{ backgroundColor: colors.primary[100] }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
          color: colors.primary[800], 
          fontWeight: typography.fontWeight.bold,
          // 响应式调整
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'
        }}>功能性动作评估 (FMS)</h2>
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
      
      {/* 动作卡片网格 - 医疗风格、增强UI和移动端适配 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
        {fmsMovements.map((movement, index) => (
          <div 
            key={movement.id}
            onClick={() => onSelectMovement(movement)}
            className="p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col active:scale-98" // 添加触摸反馈
            style={{
              backgroundColor: colors.neutral[100],
              borderRadius: components.card.borderRadius,
              boxShadow: components.card.boxShadow,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderColor: colors.primary[50],
              border: `1px solid ${colors.primary[50]}`,
              // 移动端适配
              padding: '14px',
              minHeight: '220px' // 确保卡片高度一致
            }}
          >
            {/* 序号和图标 - 医疗风格设计和移动端适配 */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary[100], color: colors.primary[700], fontWeight: typography.fontWeight.semibold }}>
                {index + 1}
              </div>
              <h3 className="text-lg ml-3" style={{ 
                color: colors.primary[800], 
                fontWeight: typography.fontWeight.semibold,
                fontSize: 'clamp(1rem, 3vw, 1.25rem)'
              }}>{movement.name}</h3>
            </div>
            
            {/* 描述文本 - 移动端适配 */}
            <p className="text-sm mt-auto mb-4" style={{ color: colors.text.secondary, fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{movement.description}</p>
            
            {/* 动作图示 - 移动端适配 */}
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
            
            {/* 医疗风格的底部标签 */}
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs" style={{ color: colors.primary[500], fontWeight: typography.fontWeight.medium }}>FMS 标准动作</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[400] }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      {/* 医疗风格页脚 - 移动端适配 */}
      <div className="mt-10 pt-6 border-t text-center text-sm" style={{ borderColor: colors.neutral[200] }}>
        <p style={{ color: colors.text.secondary }}>© 2024 医疗康复评估系统 - 专业版</p>
        <p className="mt-1" style={{ color: colors.text.secondary }}>使用AI技术辅助康复评估，提高治疗效率</p>
      </div>
    </div>
  );
};



// 主应用组件
const App: React.FC = () => {
  const [selectedMovement, setSelectedMovement] = useState<FmsMovement | null>(null);
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  const handleMovementSelect = (movement: FmsMovement) => {
    setSelectedMovement(movement);
    setActiveModule(movement.id);
  };
  
  
  
  const renderModule = () => {
    // 渲染组件
    if (activeModule === 'dashboard' || activeModule === 'statistics') {
      return <Dashboard isStatisticsPage={activeModule === 'statistics'} />;
    }
    
    if (activeModule === 'status-indicator-example') {
      return <StatusIndicatorExample />;
    }
    
    if (activeModule === 'component-test') {
      return <ComponentTestPage />;
    }
    
    if (activeModule === 'movement-selection') {
      return <MovementSelection onSelectMovement={handleMovementSelect} />;
    }

    // 根据选择的动作模块渲染对应组件
    switch (selectedMovement?.id) {
      case 'deep-squat':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                  color: colors.success[700], 
                  minHeight: '48px' // 增加触摸目标大小
                }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <DeepSquatAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      case 'hurdle-step':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                color: colors.success[700], 
                minHeight: '48px'
              }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <HurdleStepAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      case 'inline-lunge':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                  color: colors.success[700], 
                  minHeight: '48px'
                }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <InlineLungeAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      case 'shoulder-mobility':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                  color: colors.success[700], 
                  minHeight: '48px'
                }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <ShoulderMobilityAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      case 'active-straight-leg-raise':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                color: colors.success[700], 
                minHeight: '48px'
              }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <ActiveStraightLegRaiseAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      case 'trunk-stability-pushup':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                  color: colors.success[700], 
                  minHeight: '48px'
                }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <TrunkStabilityPushupAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      case 'rotary-stability':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col min-h-screen">
              <button 
                onClick={goToMovementSelection}
                className="flex items-center transition-colors p-4 active:scale-95" 
                style={{ 
                  color: colors.success[700], 
                  minHeight: '48px'
                }}
              >
                <span>←</span>
              </button>
              <div className="flex-1">
                <RotaryStabilityAnalysis />
              </div>
            </div>
          </React.Suspense>
        );
      default:
        return (
          <div className="space-y-4">
            {/* 为通用动作分析页面添加返回按钮 */}
            <button 
              onClick={selectedMovement ? goToMovementSelection : goToHome}
              className="flex items-center transition-colors p-4 active:scale-95" 
              style={{ 
                color: colors.success[700], 
                minHeight: '48px'
              }}
            >
              <span>←</span>
            </button>
            <VideoAnalysis movementType={selectedMovement?.id} movementName={selectedMovement?.name} />
          </div>
        );
    }
  };

  return (
    <div>
      {renderModule()}
    </div>
  );
};

export default App;