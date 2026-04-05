// 导入必要的 React 钩子和组件
import React from 'react';
import Layout from './components/layout/Layout';
import { useNavigation, NavigationProvider } from './contexts/NavigationContext';
import { usePluginConfig } from './contexts/PluginContext';
import Breadcrumbs from './components/ui/Breadcrumbs';
import SplashScreen from './components/ui/SplashScreen';
import { colors } from './theme';

// 导入页面组件
import Dashboard from './components/pages/Dashboard';
import StatusIndicatorExample from './components/pages/StatusIndicatorExample';
import ComponentTestPage from './components/pages/ComponentTestPage';
// VideoAnalysis 组件已迁移到 ./components/pages/VideoAnalysis 目录
import MovementSelection from './components/pages/MovementSelection';
import VideoAnalysisPage from './components/pages/VideoAnalysisPage';
import History from './components/pages/History';
import Patients from './components/pages/Patients';
import Tests from './components/pages/Tests';
import Settings from './components/pages/Settings';
import Reports from './components/pages/Reports';
import Help from './components/pages/Help';
import Admin from './components/pages/Admin';
import AssessmentHub from './components/pages/AssessmentHub';
import Scales from './components/pages/Scales';
import Questionnaire from './components/pages/Questionnaire';
import AdamsTest from './components/pages/AdamsTest';
import ResultsHistory from './components/pages/ResultsHistory';
import ResultDetail from './components/pages/ResultDetail';

// 动态导入FMS动作模块
const DeepSquatAnalysis = React.lazy(() => import('./movements/deep-squat'));
const HurdleStepAnalysis = React.lazy(() => import('./movements/hurdle-step'));
const InlineLungeAnalysis = React.lazy(() => import('./movements/inline-lunge'));
const ShoulderMobilityAnalysis = React.lazy(() => import('./movements/shoulder-mobility'));
const ActiveStraightLegRaiseAnalysis = React.lazy(() => import('./movements/active-straight-leg-raise'));
const TrunkStabilityPushupAnalysis = React.lazy(() => import('./movements/trunk-stability-pushup'));
const RotaryStabilityAnalysis = React.lazy(() => import('./movements/rotary-stability'));

// 应用内容组件
const AppContent: React.FC = () => {
  const { state, navigateTo, goBack } = useNavigation();
  const pluginConfig = usePluginConfig();
  const hideNavigation = pluginConfig?.hideNavigation ?? false;

  const renderModule = () => {
    // 渲染仪表盘 - Dashboard 不使用 Layout，直接全屏显示
    if (state.currentModule === 'dashboard' || state.currentModule === 'statistics') {
      return <Dashboard isStatisticsPage={state.currentModule === 'statistics'} />;
    }
    
    if (state.currentModule === 'status-indicator-example') {
      return <StatusIndicatorExample />;
    }
    
    if (state.currentModule === 'component-test') {
      return <ComponentTestPage />;
    }
    
    if (state.currentModule === 'movement-selection') {
      return <MovementSelection />;
    }
    if (state.currentModule === 'assessment-hub') {
      return <AssessmentHub />;
    }
    
    if (state.currentModule === 'video-analysis') {
      return <VideoAnalysisPage />;
    }
    
    if (state.currentModule === 'history') {
      return <History />;
    }
    
    if (state.currentModule === 'patients') {
      return <Patients />;
    }
    if (state.currentModule === 'scales') {
      return <Scales />;
    }
    if (state.currentModule === 'questionnaire') {
      return <Questionnaire />;
    }
    if (state.currentModule === 'adams-test') {
      return <AdamsTest />;
    }
    if (state.currentModule === 'results-history') {
      return <ResultsHistory />;
    }
    if (state.currentModule === 'results-detail') {
      return <ResultDetail />;
    }
    
    if (state.currentModule === 'tests') {
      return <Tests />;
    }
    
    if (state.currentModule === 'settings') {
      return <Settings />;
    }
    
    if (state.currentModule === 'reports') {
      return <Reports />;
    }
    
    if (state.currentModule === 'help') {
      return <Help />;
    }
    
    if (state.currentModule === 'admin') {
      return <Admin />;
    }

    

    // 根据选择的动作模块渲染对应组件
    switch (state.currentModule) {
      case 'deep-squat':
        return (
          <React.Suspense fallback={<div>加载中...</div>}>
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
            <div className="flex flex-col">
              <button 
                onClick={goBack}
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
          <div className="flex flex-col items-center justify-center min-h-screen p-6" style={{ backgroundColor: colors.background.default }}>
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>页面未找到</h1>
              <p className="mb-6" style={{ color: colors.text.secondary }}>抱歉，您访问的页面不存在。</p>
              <button 
                onClick={() => navigateTo('dashboard')}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: colors.primary[500],
                  color: colors.text.inverse
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {state.currentModule === 'dashboard' || state.currentModule === 'statistics' ? (
        // Dashboard 页面不使用 Layout
        <>
          {!hideNavigation && <Breadcrumbs className="mb-4" />}
          {renderModule()}
        </>
      ) : (
        // 其他页面使用 Layout 包裹
        <Layout>
          {!hideNavigation && <Breadcrumbs className="mb-4" />}
          <div className="flex-1">
            {renderModule()}
          </div>
        </Layout>
      )}
    </>
  );
};

// 主应用组件
const App: React.FC = () => {
  const pluginConfig = usePluginConfig();
  
  const [showSplash, setShowSplash] = React.useState(() => {
    // 插件模式下默认不显示启动页
    if (pluginConfig) return false;

    try {
      const today = new Date().toISOString().slice(0, 10);
      const last = localStorage.getItem('splash_last_shown');
      return last !== today;
    } catch {
      return true;
    }
  });

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => {
        try {
          const today = new Date().toISOString().slice(0, 10);
          localStorage.setItem('splash_last_shown', today);
        } catch {}
        setShowSplash(false);
      }} />}
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </>
  );
};

export default App;
