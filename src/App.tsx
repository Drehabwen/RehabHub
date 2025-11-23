import React, { useState } from 'react';
import VideoAnalysis from './VideoAnalysis';


import { useHealthCheck } from './hooks/useHealthCheck';
import Dashboard from './components/pages/Dashboard';
import StatusIndicatorExample from './components/pages/StatusIndicatorExample';
import ComponentTestPage from './components/pages/ComponentTestPage';
import StatusIndicator from './components/ui/StatusIndicator';

// 健康检查状态组件
const HealthStatusIndicator: React.FC = () => {
  const { isHealthy, isChecking, hasError, checkHealth } = useHealthCheck();
  
  const getStatus = () => {
    if (isChecking) return 'checking';
    if (hasError) return 'error';
    return isHealthy ? 'healthy' : 'unhealthy';
  };
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        cursor: 'pointer'
      }} 
      onClick={checkHealth}
    >
      <StatusIndicator status={getStatus()} size="small" />
    </div>
  );
};

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

// 动作评估系统组件
const MovementSelection = ({ onSelectMovement }: { onSelectMovement: (movement: FmsMovement) => void }) => {
  return (
    <div className="space-y-8 p-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('setActiveModule', { detail: 'dashboard' }))}
          className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          返回首页
        </button>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-700 mb-3">功能性动作评估 (FMS)</h2>
        <p className="text-gray-600 text-lg">请选择要分析的动作类型</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fmsMovements.map(movement => (
          <div 
            key={movement.id}
            onClick={() => onSelectMovement(movement)}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:bg-emerald-50 transition-all hover:shadow-lg border-2 border-transparent hover:border-emerald-200 h-full flex flex-col"
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(143, 170, 143, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div className="flex items-center mb-3 text-emerald-600">
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7f5', borderRadius: '50%' }}>
                •
              </div>
              <h3 className="text-lg font-semibold ml-3">{movement.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mt-auto">{movement.description}</p>
          </div>
        ))}
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
  
  
  
  // 监听自定义事件以更新活动模块
  React.useEffect(() => {
    const handleSetActiveModule = (event: CustomEvent) => {
      setActiveModule(event.detail);
      setSelectedMovement(null);
    };
    
    // 添加事件监听器
    window.addEventListener('setActiveModule', handleSetActiveModule as EventListener);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('setActiveModule', handleSetActiveModule as EventListener);
    };
  }, []);
  
  const renderModule = () => {
    if (activeModule === 'dashboard') {
      return <Dashboard />;
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
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
            {selectedMovement && (
              <button 
                onClick={() => setActiveModule('movement-selection')}
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors p-4"
              >
                ←
                返回动作选择
              </button>
            )}
            <VideoAnalysis movementType={selectedMovement?.id} movementName={selectedMovement?.name} />
          </div>
        );
    }
  };

  return (
    <div>
      <HealthStatusIndicator />
      {renderModule()}
    </div>
  );
};

export default App;