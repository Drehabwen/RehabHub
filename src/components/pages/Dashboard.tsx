import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { colors } from '../../theme';
import HelpGuide from '../HelpGuide';
import { animations, animationKeyframes } from '../../utils/animations';
import { useNavigation } from '../../contexts/NavigationContext';


// 医疗风格的Dashboard组件
interface DashboardProps {
  isStatisticsPage?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isStatisticsPage = false }) => {
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 修正ref类型定义
  const movementsRef = useRef<HTMLDivElement>(null);
  
  // 使用导航上下文
  const { navigateTo, goBack } = useNavigation();
  
  // 操作指引步骤
  const helpSteps: Array<{ id: string; title: string; content: React.ReactNode; placement: 'top' | 'bottom' | 'left' | 'right' }> = [
    {
      id: 'welcome',
      title: '欢迎使用康复评估系统',
      content: (
        <div>
          <p>您好！这是您的仪表盘，采用全新的便当式布局。</p>
          <p className="mt-2">所有功能一目了然，降低交互成本。</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      id: 'assessment',
      title: '核心功能：康复评估',
      content: (
        <div>
          <p>最大的板块是您最常用的功能。</p>
          <p className="mt-2">点击即可快速开始AI动作评估。</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      id: 'management',
      title: '综合管理',
      content: (
        <div>
          <p>在这里管理患者档案和历史记录。</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      id: 'navigation',
      title: '功能导航',
      content: (
        <div>
          <p>设置、报告和其他辅助功能都在这里。</p>
        </div>
      ),
      placement: 'bottom'
    }
  ];
  
  // 首次加载时显示操作指引
  useEffect(() => {
    setMounted(true);
    // 检查是否是首次使用
    const hasUsedBefore = localStorage.getItem('hasUsedRehabSystem');
    if (!hasUsedBefore) {
      // 延迟显示操作指引，让页面完全加载
      setTimeout(() => {
        setShowHelpGuide(true);
        // 标记为已使用
        localStorage.setItem('hasUsedRehabSystem', 'true');
      }, 1000);
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      <style>{animationKeyframes}</style>
      {/* 只在统计页面显示返回按钮，仪表盘页面不显示左上角按钮 */}
      {isStatisticsPage && (
        <div className="mb-6 flex justify-start">
          <Button
            variant="secondary"
            size="medium"
            onClick={goBack}
            className="transition-colors duration-300"
            style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
            aria-label="返回主页面"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回主页面
          </Button>
        </div>
      )}
      {/* 顶部医疗风格的欢迎区域 */}
      <div className="relative mb-8 p-8 rounded-2xl shadow-sm overflow-hidden group" style={{ 
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.background.paper} 100%)`,
        borderColor: colors.primary[100], 
        borderWidth: '1px',
        ...(mounted && animations.fadeInDown('0.6s', '0.1s'))
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: `${colors.primary[100]}4D` }}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-12 -mb-12 blur-2xl transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: `${colors.primary[200]}4D` }}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ring-4 ring-white/50">
              <span className="text-3xl">👋</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                {new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好'}，治疗师
              </h1>
              <p className="text-gray-500 mt-1">
                今日安排已就绪，请按流程完成评估。
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <div className="text-3xl font-bold font-mono tracking-tight" style={{ color: `${colors.primary[700]}CC` }}>
              {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>
      </div>
      
      {/* 核心功能区域 - 便当式布局 (Bento Grid) */}
      <div ref={movementsRef} className="mb-8">
        <div className="grid grid-cols-2 gap-4 h-auto md:h-[500px]">
          
          {/* 板块1: 康复评估 (Assessment) - 占据主要位置 */}
          <div 
            className="col-span-2 md:col-span-1 md:row-span-2 relative overflow-hidden rounded-3xl shadow-sm cursor-pointer group transition-all duration-300 hover:shadow-md bg-white"
            onClick={() => navigateTo('patients')}
            style={{
              ...(mounted && animations.fadeInUp('0.6s', '0.2s'))
            }}
          >
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-4xl">➕</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">添加患者</h2>
              <p className="text-sm text-gray-500">创建患者档案，开始评估流程</p>
              <div className="mt-6">
                <Button onClick={() => navigateTo('patients')} size="large">立即添加</Button>
              </div>
            </div>
          </div>

          {/* 板块2: 综合管理 (Management) */}
          <div 
            className="col-span-1 relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl bg-white"
            onClick={() => navigateTo('assessment-hub')}
            style={{
              ...(mounted && animations.fadeInUp('0.6s', '0.3s'))
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-8 -mt-8"></div>
            
            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">康复评估</h3>
              <p className="text-sm text-gray-500 mb-4">动作选择与视频分析</p>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 板块3: 功能导航 (Navigation) */}
          <div 
            className="col-span-1 relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl bg-white"
            onClick={() => navigateTo('settings')}
            style={{
              ...(mounted && animations.fadeInUp('0.6s', '0.4s'))
            }}
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                <span className="text-2xl">🧭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">功能导航</h3>
              <p className="text-sm text-gray-500 mb-4">设置与更多功能</p>
              
              <div className="mt-auto grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">设置</div>
                <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">报告</div>
                <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">帮助</div>
                <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">关于</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* 隐藏原来的统计卡片和旧的功能区域，保留Welcome Header */}
      
      {/* 帮助指引 */}
      <HelpGuide 
        steps={helpSteps}
        targetRef={movementsRef}
        isOpen={showHelpGuide}
        onClose={() => setShowHelpGuide(false)}
      />
    </div>
  );
};

export default Dashboard;
