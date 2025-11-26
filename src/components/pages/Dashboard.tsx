import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import { colors, typography, borderRadius, shadows } from '../../theme/theme';
import HelpGuide from '../HelpGuide';
import { animations, animationKeyframes } from '../../utils/animations';

// 医疗风格的Dashboard组件
const Dashboard: React.FC = () => {
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 为操作指引设置引用
  const movementsRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const statsRef = useRef<HTMLDivElement>(null);
  const quickStartRef = useRef<HTMLDivElement>(null);
  
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
  
  // 模拟数据和导航函数
  const navigateToStatusDemo = () => {
    window.location.href = '#/status-indicator-example';
    const event = new CustomEvent('setActiveModule', { detail: 'status-indicator-example' });
    window.dispatchEvent(event);
  };
  
  const navigateToComponentTest = () => {
    window.location.href = '#/component-test';
    const event = new CustomEvent('setActiveModule', { detail: 'component-test' });
    window.dispatchEvent(event);
  };

  // 统计卡片数据
  const statsCards = [
    {
      title: '今日评估次数',
      value: '24',
      icon: '📊',
      bgColor: colors.primary[100],
      textColor: colors.primary[600]
    },
    {
      title: '活跃患者',
      value: '156',
      icon: '👥',
      bgColor: colors.backgroundSecondary,
      textColor: colors.textPrimary
    },
    {
      title: '评估完成率',
      value: '89%',
      icon: '✅',
      bgColor: colors.backgroundSecondary,
      textColor: colors.textPrimary
    },
    {
      title: '治疗师满意度',
      value: '4.8/5',
      icon: '⭐',
      bgColor: colors.backgroundSecondary,
      textColor: colors.textPrimary
    }
  ];

  return (
    <Layout title="康复评估平台">
      <style>{animationKeyframes}</style>
      <div className="mx-auto max-w-6xl p-4 w-full">
        {/* 顶部医疗风格的欢迎区域 */}
        <div className="border mb-8 p-6 md:p-8 rounded-2xl shadow" style={{ 
          backgroundColor: colors.backgroundSecondary, 
            borderColor: colors.borderColor, 
          borderRadius: borderRadius.large,
          ...(mounted && animations.fadeInDown('0.6s', '0.1s'))
        }}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: colors.primary[100] }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colors.primary[700], fontWeight: typography.fontWeight.bold }}>欢迎使用 DeepRehab 康复评估系统</h1>
                  <p className="text-gray-600 text-base">专业的动作功能评估工具，为康复治疗提供精准的数据支持</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="large"
                onClick={() => {
                  window.location.href = '#/movement-selection';
                  const event = new CustomEvent('setActiveModule', { detail: 'movement-selection' });
                  window.dispatchEvent(event);
                }}
                className="duration-300 h-[52px] min-w-[160px] transition-colors"
                style={{ backgroundColor: colors.primary[600] }}
              >
                开始新评估
              </Button>
              <Button
                variant="outline"
                size="large"
                className="min-w-[140px] h-[52px] transition-colors duration-300"
                style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
              >
                查看统计
              </Button>
            </div>
          </div>
        </div>

        {/* 医疗风格的统计卡片区域 */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, index) => (
            <Card 
              key={index} 
              className="shadow hover:shadow-md transition-all duration-300 border overflow-hidden" 
              style={{ 
                borderColor: colors.borderColor, 
                borderRadius: borderRadius.medium, 
                boxShadow: shadows.default,
                ...(mounted && animations.fadeInUp('0.5s', `${0.2 + index * 0.1}s`)),
                ...animations.cardHover
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = shadows.default;
              }}
            >
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ fontWeight: typography.fontWeight.medium, color: colors.textSecondary }}>{card.title}</p>
                    <h3 className="text-2xl font-bold" style={{ fontWeight: typography.fontWeight.bold, color: colors.textPrimary }}>{card.value}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-xl" style={{ backgroundColor: card.bgColor, color: card.textColor }}>
                    {card.icon}
                  </div>
                </div>
                {/* 趋势指示器 */}
                <div className="mt-3 flex items-center text-xs" style={{ fontWeight: typography.fontWeight.medium, color: colors.textSecondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  较昨日增长 {5 + index}%
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>

        {/* 核心功能卡片区域 - 医疗风格设计 */}
        <div ref={movementsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 视频动作评估卡片 */}
          <Card 
            className="shadow-md hover:shadow-lg transition-all duration-300 border overflow-hidden" 
            style={{ 
              borderColor: colors.borderColor, 
              borderRadius: borderRadius.medium,
              boxShadow: shadows.default,
              ...(mounted && animations.fadeInUp('0.6s', '0.5s')),
              ...animations.cardHover
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'translateY(-6px)';
              card.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'translateY(0)';
              card.style.boxShadow = shadows.default;
            }}
          >
            <Card.Header>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center mr-3 rounded-full" style={{ backgroundColor: colors.primary[100] }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <Card.Title>视频动作评估</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                通过AI姿态识别技术，实时分析患者的动作表现，提供精确的角度和对称性评估。
              </p>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => {
                  window.location.href = '#/movement-selection';
                  const event = new CustomEvent('setActiveModule', { detail: 'movement-selection' });
                  window.dispatchEvent(event);
                }}
                className="h-[48px] transition-colors duration-300" style={{ backgroundColor: colors.primary[600] }}>
                  开始评估
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={navigateToStatusDemo}
                    className="transition-colors duration-300" style={{ 
                      borderColor: colors.primary[200], 
                      color: colors.primary[600],
                      ...animations.buttonHover
                    }}>
                    状态演示
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={navigateToComponentTest}
                    className="transition-colors duration-300"
                    style={{ 
                      borderColor: colors.primary[200], 
                      color: colors.primary[600]
                    }}
                  >
                    组件测试
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* 历史数据追踪卡片 */}
          <Card 
            className="shadow-md hover:shadow-lg transition-all duration-300 border overflow-hidden" 
            style={{ 
              borderColor: colors.primary[50], 
              borderRadius: borderRadius.medium,
            boxShadow: shadows.default,
              ...(mounted && animations.fadeInUp('0.6s', '0.7s')),
              ...animations.cardHover
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'translateY(-6px)';
              card.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'translateY(0)';
              card.style.boxShadow = shadows.default;
            }}
          >
            <Card.Header>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primary[100] }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <Card.Title>历史数据追踪</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                记录并可视化患者的康复进度，帮助治疗师调整治疗方案，提高康复效果。
              </p>
              <Button 
                variant="primary"
                fullWidth
                onClick={() => {
                  window.location.href = '#/history';
                  const event = new CustomEvent('setActiveModule', { detail: 'history' });
                  window.dispatchEvent(event);
                }}
                className="h-[48px] transition-colors duration-300" style={{ backgroundColor: colors.primary[600] }}>
                查看历史
              </Button>
            </Card.Content>
          </Card>

          {/* 患者管理卡片 */}
          <Card 
            className="shadow-md hover:shadow-lg transition-all duration-300 border overflow-hidden" 
            style={{ 
              borderColor: colors.primary[50], 
              borderRadius: borderRadius.medium,
            boxShadow: shadows.default,
              ...(mounted && animations.fadeInUp('0.6s', '0.9s')),
              ...animations.cardHover
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'translateY(-6px)';
              card.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget;
              card.style.transform = 'translateY(0)';
              card.style.boxShadow = shadows.default;
            }}
          >
            <Card.Header>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primary[100] }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <Card.Title>患者管理</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                便捷的患者信息管理系统，支持快速创建评估档案和查看详细的康复数据。
              </p>
              <Button 
                variant="outline"
                fullWidth
                onClick={() => {
                  window.location.href = '#/patients';
                  const event = new CustomEvent('setActiveModule', { detail: 'patients' });
                  window.dispatchEvent(event);
                }}
                className="h-[48px] transition-colors duration-300" style={{ borderColor: colors.primary[300], color: colors.primary[600] }}>
                管理患者
              </Button>
            </Card.Content>
          </Card>
        </div>

        {/* 快速开始区域 - 医疗风格设计 */}
        <div ref={quickStartRef} className="p-6 md:p-8 rounded-2xl text-center text-white mb-8 transition-all duration-300 hover:translate-y-[-6px] hover:shadow-xl" style={{ 
          backgroundColor: colors.primary,
          ...(mounted && animations.fadeInUp('0.7s', '1.1s')),
          ...animations.cardHover
        }}>
          <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontWeight: typography.fontWeight.bold }}>准备好开始新的评估了吗？</h2>
          <p className="mb-6 max-w-2xl mx-auto" style={{ color: colors.primary[50] }}>
            输入患者信息，立即开始专业的康复动作功能评估，获取精准的分析报告。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <Input 
              placeholder="输入患者ID" 
              className="w-full text-white" 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: colors.primary[300] }} 
            />
            <Button
              size="large"
              onClick={() => {
                window.location.href = '#/movement-selection';
                const event = new CustomEvent('setActiveModule', { detail: 'movement-selection' });
                window.dispatchEvent(event);
              }}
              className="w-full sm:w-auto min-w-[160px] h-[52px] transition-colors duration-300"
              style={{ backgroundColor: 'white', color: colors.primary[700] }}
            >
              快速开始
            </Button>
          </div>
        </div>

        {/* 医疗风格页脚 */}
        <div className="text-center text-sm pt-4 border-t" style={{ color: colors.textSecondary, borderColor: colors.borderColor }}>
          <p>© 2024 医疗康复评估系统 - 专业版</p>
          <p className="mt-1">使用AI技术辅助康复评估，提高治疗效率</p>
        </div>
      </div>
      
      {/* 操作指引 */}
      {showHelpGuide && (
        <HelpGuide
          steps={helpSteps}
          targetRef={movementsRef}
          isOpen={showHelpGuide}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
    </Layout>
  );
};

export default Dashboard;