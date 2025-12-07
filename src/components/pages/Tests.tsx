import React, { useState, useEffect } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义测试类型
interface Test {
  id: string;
  name: string;
  description: string;
  duration: number; // 分钟
  status: 'pending' | 'in-progress' | 'completed';
  progress?: number; // 0-100
  score?: number;
  lastAccessed?: string;
}

// 模拟测试数据
const mockTestsData: Test[] = [
  {
    id: 'T001',
    name: '基础功能评估',
    description: '评估患者基本运动功能和活动能力',
    duration: 30,
    status: 'completed',
    progress: 100,
    score: 85,
    lastAccessed: '2024-05-15'
  },
  {
    id: 'T002',
    name: '平衡能力测试',
    description: '评估患者静态和动态平衡能力',
    duration: 20,
    status: 'in-progress',
    progress: 60,
    lastAccessed: '2024-05-16'
  },
  {
    id: 'T003',
    name: '肌力评估',
    description: '评估主要肌群的力量水平',
    duration: 25,
    status: 'pending',
    lastAccessed: ''
  },
  {
    id: 'T004',
    name: '关节活动度测量',
    description: '评估主要关节的活动范围',
    duration: 15,
    status: 'pending',
    lastAccessed: ''
  }
];

const Tests: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [tests, setTests] = useState<Test[]>(mockTestsData);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  
  // 组件挂载后设置动画
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 过滤测试
  const filteredTests = tests.filter(test => {
    if (activeTab === 'all') return true;
    return test.status === activeTab;
  });
  
  // 开始测试
  const handleStartTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: 'in-progress' as const, progress: 0, lastAccessed: new Date().toISOString().split('T')[0] }
        : test
    ));
    
    // 导航到测试页面
    navigateTo('video-analysis', { testId });
  };
  
  // 继续测试
  const handleContinueTest = (testId: string) => {
    // 导航到测试页面
    navigateTo('video-analysis', { testId });
  };
  
  // 重新开始测试
  const handleRestartTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { ...test, status: 'in-progress' as const, progress: 0, score: undefined }
        : test
    ));
    
    // 导航到测试页面
    navigateTo('video-analysis', { testId });
  };
  
  // 删除测试
  const handleDeleteTest = (testId: string) => {
    setTests(tests.filter(test => test.id !== testId));
  };
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success[600];
      case 'in-progress':
        return colors.warning[600];
      case 'pending':
        return colors.neutral[600];
      default:
        return colors.neutral[600];
    }
  };
  
  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '进行中';
      case 'pending':
        return '待开始';
      default:
        return '未知';
    }
  };
  
  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.success[600];
    if (score >= 80) return colors.success[500];
    if (score >= 70) return colors.warning[600];
    if (score >= 60) return colors.warning[500];
    return colors.error[600];
  };
  
  // 获取分数文本
  const getScoreText = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    if (score >= 60) return '及格';
    return '不及格';
  };
  
  return (
    <Layout title="测试管理">
      <style>{animationKeyframes}</style>
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
        
        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
              color: colors.primary[800], 
              fontWeight: typography.fontWeight.bold
            }}>测试管理</h1>
            <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
              管理和执行各种康复评估测试
            </p>
          </div>
          
          <Button
            variant="primary"
            size="medium"
            className="mt-4 md:mt-0"
            onClick={() => navigateTo('movement-selection')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建测试
          </Button>
        </div>
        
        {/* 标签页 */}
        <div className="flex flex-wrap gap-2 mb-8 border-b" style={{ borderColor: colors.neutral[200] }}>
          {(['all', 'pending', 'in-progress', 'completed'] as const).map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                activeTab === tab ? 'border-current' : 'border-transparent'
              }`}
              style={{
                color: activeTab === tab ? colors.primary[600] : colors.text.secondary,
                ...(activeTab === tab ? { fontWeight: typography.fontWeight.semibold } : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' && '全部测试'}
              {tab === 'pending' && '待开始'}
              {tab === 'in-progress' && '进行中'}
              {tab === 'completed' && '已完成'}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full" style={{
                backgroundColor: colors.neutral[100],
                color: colors.text.secondary
              }}>
                {tests.filter(test => tab === 'all' ? true : test.status === tab).length}
              </span>
            </button>
          ))}
        </div>
        
        {/* 测试列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test, index) => (
            <Card 
              key={test.id}
              className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
              style={{
                ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>
                    {test.name}
                  </h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    ID: {test.id}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                  backgroundColor: `${getStatusColor(test.status)}20`,
                  color: getStatusColor(test.status)
                }}>
                  {getStatusText(test.status)}
                </div>
              </div>
              
              <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
                {test.description}
              </p>
              
              <div className="flex items-center text-sm mb-4" style={{ color: colors.text.secondary }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                预计用时: {test.duration} 分钟
              </div>
              
              {test.status === 'in-progress' && test.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm" style={{ color: colors.text.secondary }}>进度</span>
                    <span className="text-sm font-medium" style={{ color: colors.text.primary }}>{test.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.neutral[200] }}>
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${test.progress}%`,
                        backgroundColor: colors.primary[500]
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              {test.status === 'completed' && test.score !== undefined && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.neutral[50] }}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: colors.text.secondary }}>得分</span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2" style={{ color: getScoreColor(test.score) }}>
                        {test.score}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        backgroundColor: `${getScoreColor(test.score)}20`,
                        color: getScoreColor(test.score)
                      }}>
                        {getScoreText(test.score)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {test.lastAccessed && (
                <div className="text-xs mb-4" style={{ color: colors.text.secondary }}>
                  上次访问: {test.lastAccessed}
                </div>
              )}
              
              <div className="flex gap-2">
                {test.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleStartTest(test.id)}
                    className="flex-1"
                  >
                    开始测试
                  </Button>
                )}
                
                {test.status === 'in-progress' && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleContinueTest(test.id)}
                    className="flex-1"
                  >
                    继续测试
                  </Button>
                )}
                
                {test.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleRestartTest(test.id)}
                    className="flex-1"
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    重新测试
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigateTo('history', { testId: test.id })}
                  style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                >
                  历史
                </Button>
                
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleDeleteTest(test.id)}
                  style={{ borderColor: colors.error[300], color: colors.error[600] }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 空状态 */}
        {filteredTests.length === 0 && (
          <Card className="p-12 text-center border shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
              暂无测试记录
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
              创建第一个测试开始评估
            </p>
            <Button
              variant="primary"
              onClick={() => navigateTo('movement-selection')}
            >
              创建测试
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Tests;