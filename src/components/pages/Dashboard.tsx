import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import { colors, typography, borderRadius } from '../../theme';
import HelpGuide from '../HelpGuide';
import { animations, animationKeyframes } from '../../utils/animations';
import { useNavigation } from '../../contexts/NavigationContext';
import { useDashboardData } from '../../hooks/useDashboardData';

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
  
  // 使用自定义Hook获取仪表盘数据
  const { statsCards, isLoading, error, refetch } = useDashboardData();
  
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
  
  // 渲染趋势指示器
  const renderTrendIndicator = (trend?: { value: number; isPositive: boolean }) => {
    if (!trend) return null;
    
    return (
      <div className="mt-3 flex items-center text-xs" style={{ fontWeight: typography.fontWeight.medium, color: trend.isPositive ? colors.success[500] : colors.error[500] }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          style={{ transform: trend.isPositive ? 'rotate(0deg)' : 'rotate(180deg)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        较昨日{trend.isPositive ? '增长' : '下降'} {Math.abs(trend.value)}%
      </div>
    );
  };

  return (
    <Layout title="康复评估平台">
      <style>{animationKeyframes}</style>
      <div className="mx-auto max-w-6xl p-4 w-full">
        {/* 左上角返回按钮 */}
        <div className="mb-6 flex justify-start">
          {isStatisticsPage ? (
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
          ) : (
            <Button
              variant="secondary"
              size="medium"
              onClick={() => navigateTo('movement-selection')}
              className="transition-colors duration-300"
              style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
              aria-label="返回动作选择"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回动作选择
            </Button>
          )}
        </div>
        {/* 顶部医疗风格的欢迎区域 */}
        <div className="border mb-8 p-6 md:p-8 rounded-2xl shadow" style={{ 
          backgroundColor: colors.background.secondary, 
          borderColor: colors.borderColor, 
          borderRadius: borderRadius.md,
          ...(mounted && animations.fadeInDown('0.6s', '0.1s'))
        }}>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.primary[100] }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">欢迎来到康复评估系统</h1>
                <p className="text-gray-600 mt-2 max-w-lg">
                  通过AI驱动的姿态识别技术，为患者提供专业的康复评估与追踪服务
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 统计数据卡片 */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card 
              key={index}
              className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
              style={{
                ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: card.bgColor + '20' }}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: card.textColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ 
                  backgroundColor: card.trend?.isPositive ? colors.success[100] : colors.error[100],
                  color: card.trend?.isPositive ? colors.success[700] : colors.error[700]
                }}>
                  {card.trend?.isPositive ? '↑' : '↓'} {Math.abs(card.trend?.value || 0)}%
                </span>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: card.textColor }}>{card.value}</h3>
              <p className="text-sm" style={{ color: colors.text.secondary }}>{card.title}</p>
              {renderTrendIndicator(card.trend)}
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
      </div>
      
      {/* 帮助指引 */}
      {showHelpGuide && (
        <HelpGuide 
          steps={helpSteps}
          onClose={() => setShowHelpGuide(false)}
          startFromStep={0}
        />
      )}
    </Layout>
  );
};

export default Dashboard;