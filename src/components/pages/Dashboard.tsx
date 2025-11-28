import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import { colors, typography, borderRadius } from '../../theme';
import HelpGuide from '../HelpGuide';
import { animations, animationKeyframes } from '../../utils/animations';
import { 
  goToMovementSelection,
  goToHistory,
  goToPatients
} from '../../utils/navigation';
import { useDashboardData } from '../../hooks/useDashboardData';

// 医疗风格的Dashboard组件
const Dashboard: React.FC = () => {
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [patientId, setPatientId] = useState('');
  
  // 修正ref类型定义
  const movementsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quickStartRef = useRef<HTMLDivElement>(null);
  
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
  
  // 统一导航函数
  const handleNavigation = useCallback((path: string, module: string) => {
    window.location.href = `#/${path}`;
    const event = new CustomEvent('setActiveModule', { detail: module });
    window.dispatchEvent(event);
  }, []);
  
  // 快速开始处理函数
  const handleQuickStart = useCallback(() => {
    if (patientId.trim()) {
      // 存储患者ID到会话存储
      sessionStorage.setItem('currentPatientId', patientId.trim());
      handleNavigation('movement-selection', 'movement-selection');
    } else {
      // 显示错误提示
      alert('请输入有效的患者ID');
    }
  }, [patientId, handleNavigation]);
  
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
        {/* 顶部医疗风格的欢迎区域 */}
        <div className="border mb-8 p-6 md:p-8 rounded-2xl shadow" style={{ 
          backgroundColor: colors.background.secondary, 
          borderColor: colors.borderColor, 
          borderRadius: borderRadius.md,
          ...(mounted && animations.fadeInDown('0.6s', '0.1s'))
        }}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: colors.primary[100] }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[700] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold }}>欢迎使用 DeepRehab 康复评估系统</h1>
                  <p className="text-gray-600 text-base">专业的动作功能评估工具，为康复治疗提供精准的数据支持</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="large"
                onClick={goToMovementSelection}
                className="duration-300 h-[52px] min-w-[160px] transition-colors"
                style={{ backgroundColor: colors.primary[600] }}
                aria-label="开始新的康复评估"
              >
                开始新评估
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => handleNavigation('statistics', 'statistics')}
                className="min-w-[140px] h-[52px] transition-colors duration-300"
                style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                aria-label="查看详细统计数据"
              >
                查看统计
              </Button>
            </div>
          </div>
        </div>

        {/* 统计数据区域 */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" style={mounted ? animations.fadeInUp('0.6s', '0.2s') : undefined}>
          {isLoading ? (
            // 加载状态
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-6 rounded-xl shadow" style={{ backgroundColor: colors.background.paper }}>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // 错误状态
            <div className="col-span-full p-6 rounded-xl shadow" style={{ backgroundColor: colors.error[50] }}>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.error[500] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ color: colors.error[700] }}>{error}</span>
                <button 
                  onClick={refetch}
                  className="ml-auto px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: colors.error[50], color: colors.error[700] }}
                >
                  重试
                </button>

              </div>
            </div>
          ) : (
            // 正常状态
            statsCards.map((stat: any, index: any) => (
              <div key={index} className="p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300" style={{ 
                backgroundColor: stat.bgColor,
                ...(mounted ? animations.fadeInUp('0.6s', `${0.2 + index * 0.1}s`) : {})
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{stat.icon}</div>
                  {stat.trend && renderTrendIndicator(stat.trend)}
                </div>
                <h3 className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>{stat.title}</h3>
                <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
              </div>
            ))
          )}
        </div>

        {/* 核心功能区域 */}
        <div ref={movementsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={mounted ? animations.fadeInUp('0.6s', '0.4s') : undefined}>
          <Card 
            title="视频动作评估" 
            onClick={() => handleNavigation('video-analysis', 'video-analysis')}
            style={{ backgroundColor: colors.background.paper }}
          >
            <p>通过AI姿态识别技术分析患者动作表现</p>
          </Card>
          <Card 
            title="历史数据追踪" 
            onClick={goToHistory}
            style={{ backgroundColor: colors.background.paper }}
          >
            <p>记录并可视化患者的康复进度</p>
          </Card>
          <Card 
            title="患者管理" 
            onClick={goToPatients}
            style={{ backgroundColor: colors.background.paper }}
          >
            <p>便捷的患者信息管理系统</p>
          </Card>
        </div>

        {/* 快速开始区域 */}
        <div ref={quickStartRef} className="p-6 rounded-xl shadow" style={{ 
          backgroundColor: colors.background.paper,
          ...(mounted && animations.fadeInUp('0.6s', '0.6s'))
        }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>快速开始</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="请输入患者ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              fullWidth
              style={{ flex: 1 }}
            />
            <Button
              variant="primary"
              onClick={handleQuickStart}
              disabled={!patientId.trim()}
              style={{ backgroundColor: colors.primary[600] }}
            >
              开始评估
            </Button>
          </div>
        </div>

        {/* 操作指引 */}
        {showHelpGuide && (
          <HelpGuide 
            steps={helpSteps}
            onClose={() => setShowHelpGuide(false)}
            isOpen={showHelpGuide}
            targetRef={movementsRef}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;