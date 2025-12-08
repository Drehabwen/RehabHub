import React, { useState, useEffect, useRef, useCallback } from 'react';

import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
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
  const [patientId, setPatientId] = useState('');
  
  // 修正ref类型定义
  const movementsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quickStartRef = useRef<HTMLDivElement>(null);
  
  // 使用导航上下文
  const { navigateTo, goBack } = useNavigation();
  
  // 模拟仪表盘数据，避免使用有问题的Hook
  const statsCards = [
    {
      title: '今日评估次数',
      value: '12',
      icon: '📊',
      bgColor: '#E1F5FE',
      textColor: '#0288D1',
      trend: { value: 8, isPositive: true }
    },
    {
      title: '活跃患者',
      value: '6',
      icon: '👥',
      bgColor: '#E8F5E8',
      textColor: '#388E3C',
      trend: { value: 2, isPositive: true }
    },
    {
      title: '评估完成率',
      value: '85%',
      icon: '✅',
      bgColor: '#FFF3E0',
      textColor: '#F57C00',
      trend: { value: 5, isPositive: true }
    },
    {
      title: '治疗师满意度',
      value: '92%',
      icon: '⭐',
      bgColor: '#F3E5F5',
      textColor: '#7B1FA2',
      trend: { value: 3, isPositive: true }
    }
  ];
  
  // 操作指引步骤
  const helpSteps: Array<{ id: string; title: string; content: React.ReactNode; placement: 'top' | 'bottom' | 'left' | 'right' }> = [
    {
      id: 'welcome',
      title: '欢迎使用康复评估系统',
      content: (
        <div>
          <p>您好！这是您的仪表盘，从这里您可以访问系统的所有主要功能。</p>
          <p className="mt-2">您可以查看统计数据、选择评估动作或快速开始新的评估流程。</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      id: 'stats',
      title: '统计数据区域',
      content: (
        <div>
          <p>这里显示您的核心统计信息，包括今日评估次数、活跃患者、评估完成率和治疗师满意度。</p>
          <p className="mt-2">数据会实时更新，帮助您了解整体评估情况。</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      id: 'movements',
      title: '核心功能区域',
      content: (
        <div>
          <p>这是系统核心功能区域，包含三个主要功能：</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>视频动作评估 - 通过AI姿态识别技术分析患者动作表现</li>
            <li>历史数据追踪 - 记录并可视化患者的康复进度</li>
            <li>患者管理 - 便捷的患者信息管理系统</li>
          </ul>
          <p className="mt-2">点击任意卡片进入相应功能。</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      id: 'quick-start',
      title: '快速开始',
      content: (
        <div>
          <p>使用快速开始功能，您可以直接输入患者ID并开始新的评估流程。</p>
          <p className="mt-2">这是最快捷的方式开始一次新的康复动作评估。</p>
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
  
  // 快速开始处理函数
  const handleQuickStart = useCallback(() => {
    if (patientId.trim()) {
      // 存储患者ID到会话存储
      sessionStorage.setItem('currentPatientId', patientId.trim());
      navigateTo('movement-selection');
    } else {
      // 显示错误提示
      alert('请输入有效的患者ID');
    }
  }, [patientId, navigateTo]);

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
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/30 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100/30 rounded-full -ml-12 -mb-12 blur-2xl transition-transform duration-700 group-hover:scale-110"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ring-4 ring-white/50">
              <span className="text-3xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                {new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好'}，治疗师
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                准备好开始今天的康复评估工作了吗？
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <div className="text-3xl font-bold text-green-700/80 font-mono tracking-tight">
              {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>
      </div>
      
      {/* 统计数据卡片 */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <Card 
            key={index}
            className="p-0 border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white ring-1 ring-slate-100"
            style={{
              ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
            }}
          >
            <div className="p-6 relative">
              {/* 装饰性背景 */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white to-transparent opacity-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" 
                   style={{ backgroundColor: card.bgColor }}></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm ring-2 ring-white" 
                     style={{ backgroundColor: card.bgColor, color: card.textColor }}>
                   {/* 根据卡片标题动态显示图标，如果icon是emoji则显示emoji，如果是SVG路径则需要改造数据结构，这里暂时保持原逻辑但优化容器样式 */}
                   <span className="text-xl">{card.icon}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm ${
                  card.trend?.isPositive 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {card.trend?.isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {Math.abs(card.trend?.value || 0)}%
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-gray-800 tracking-tight mb-1">{card.value}</h3>
                <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                  {card.title}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* 核心功能区域 */}
      <div ref={movementsRef} className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6" style={{
          ...(mounted && animations.fadeInUp('0.6s', '0.5s'))
        }}>
          核心功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="p-6 border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigateTo('movement-selection')}
            style={{
              ...(mounted && animations.fadeInUp('0.6s', '0.6s'))
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.primary[100] }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">视频动作评估</h3>
              <p className="text-sm text-gray-600">通过AI姿态识别技术分析患者动作表现，提供专业评估报告</p>
            </div>
          </Card>
          
          <Card 
            className="p-6 border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigateTo('history')}
            style={{
              ...(mounted && animations.fadeInUp('0.6s', '0.7s'))
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.secondary[100] }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.secondary[600] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">历史数据追踪</h3>
              <p className="text-sm text-gray-600">记录并可视化患者的康复进度，生成趋势分析报告</p>
            </div>
          </Card>
          
          <Card 
            className="p-6 border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigateTo('patients')}
            style={{
              ...(mounted && animations.fadeInUp('0.6s', '0.8s'))
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.secondary[100] }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.secondary[600] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">患者管理</h3>
              <p className="text-sm text-gray-600">便捷的患者信息管理系统，支持创建、编辑和查看患者档案</p>
            </div>
          </Card>
        </div>
      </div>
      
      {/* 快速开始区域 */}
      <div ref={quickStartRef} className="border rounded-xl p-6 shadow-md" style={{ 
        backgroundColor: colors.background.secondary, 
        borderColor: colors.borderColor,
        ...(mounted && animations.fadeInUp('0.6s', '0.9s'))
      }}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">快速开始</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="输入患者ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="flex-1"
            style={{
              height: '48px'
            }}
          />
          <Button
            variant="primary"
            size="medium"
            onClick={handleQuickStart}
            disabled={!patientId.trim()}
            className="px-6"
            style={{
              height: '48px',
              minWidth: '120px'
            }}
          >
            开始评估
          </Button>
        </div>
      </div>
      
      {/* 帮助指引 */}
      <HelpGuide 
        steps={helpSteps}
        targetRef={quickStartRef}
        isOpen={showHelpGuide}
        onClose={() => setShowHelpGuide(false)}
      />
    </div>
  );
};

export default Dashboard;