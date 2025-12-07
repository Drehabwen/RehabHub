import { useState, useEffect } from 'react';
import { Layout } from './layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';
import { getModuleApi } from '../../services/api';

// 定义评分类型
interface Score {
  value: number;
  max: number;
  label: string;
  color?: string;
}

// 定义指标类型
interface Metric {
  name: string;
  value: number;
  unit: string;
  normalRange?: {
    min: number;
    max: number;
  };
  status?: 'normal' | 'warning' | 'critical';
}

// 定义评估类型
interface Assessment {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  date: string;
  scores: Score[];
  metrics: Metric[];
  summary: string;
  recommendations: string[];
  status: 'completed' | 'in-progress' | 'draft';
}

const ExampleAnalysis: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'scores' | 'metrics' | 'recommendations'>('overview');
  
  // 组件挂载后设置动画并获取数据
  useEffect(() => {
    setMounted(true);
    fetchLatestAssessment();
  }, []);
  
  // 获取最新的评估数据
  const fetchLatestAssessment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 尝试从API获取最新的评估数据
      const apiClient = getModuleApi('video-analysis');
      const data = await apiClient.get<Assessment[]>('/api/analysis');
      
      // 如果有数据，取最新的一个
      if (data && data.length > 0) {
        // 按日期排序，取最新的
        const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAssessment(sortedData[0]);
      } else {
        // 如果没有数据，设置为null，显示空状态
        setAssessment(null);
      }
    } catch (err) {
      console.error('获取评估数据失败:', err);
      setError('无法加载评估数据，请稍后重试');
      // 如果API调用失败，设置为null，显示空状态
      setAssessment(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取指标状态
  const getMetricStatus = (metric: Metric) => {
    if (!metric.normalRange) return 'normal';
    
    if (metric.value < metric.normalRange.min || metric.value > metric.normalRange.max) {
      return 'critical';
    }
    
    // 在正常范围的边缘，标记为警告
    const margin = (metric.normalRange.max - metric.normalRange.min) * 0.1;
    if (metric.value < metric.normalRange.min + margin || metric.value > metric.normalRange.max - margin) {
      return 'warning';
    }
    
    return 'normal';
  };
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return colors.success[600];
      case 'warning':
        return colors.warning[600];
      case 'critical':
        return colors.error[600];
      default:
        return colors.neutral[600];
    }
  };
  
  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '警告';
      case 'critical':
        return '异常';
      default:
        return '未知';
    }
  };
  
  // 计算总分
  const calculateTotalScore = () => {
    if (!assessment || !assessment.scores.length) return { value: 0, max: 0 };
    
    const total = assessment.scores.reduce((acc, score) => acc + score.value, 0);
    const maxTotal = assessment.scores.reduce((acc, score) => acc + score.max, 0);
    
    return { value: total, max: maxTotal };
  };
  
  // 获取总分颜色
  const getTotalScoreColor = () => {
    const { value, max } = calculateTotalScore();
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    if (percentage >= 90) return colors.success[600];
    if (percentage >= 80) return colors.success[500];
    if (percentage >= 70) return colors.warning[600];
    if (percentage >= 60) return colors.warning[500];
    return colors.error[600];
  };
  
  // 评分条组件
  const ScoreBar: React.FC<{ score: Score }> = ({ score }) => {
    const percentage = (score.value / score.max) * 100;
    const color = score.color || (percentage >= 80 ? colors.success[600] : percentage >= 60 ? colors.warning[600] : colors.error[600]);
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
            {score.label}
          </span>
          <span className="text-sm font-medium" style={{ color }}>
            {score.value}/{score.max}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
      </div>
    );
  };
  
  // 简单雷达图组件
  const SimpleRadarChart: React.FC<{ scores: Score[] }> = ({ scores }) => {
    const size = 200;
    const center = size / 2;
    const radius = size / 2 - 20;
    
    // 计算点的位置
    const points = scores.map((score, index) => {
      const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
      const value = (score.value / score.max) * radius;
      const x = center + value * Math.cos(angle);
      const y = center + value * Math.sin(angle);
      return { x, y, label: score.label, value: score.value, max: score.max };
    });
    
    // 生成多边形路径
    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 背景网格 */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((level, index) => (
            <polygon
              key={index}
              points={scores.map((_, i) => {
                const angle = (i * 2 * Math.PI) / scores.length - Math.PI / 2;
                const r = level * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke={colors.neutral[300]}
              strokeWidth="1"
            />
          ))}
          
          {/* 轴线 */}
          {scores.map((_, index) => {
            const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={colors.neutral[300]}
                strokeWidth="1"
              />
            );
          })}
          
          {/* 数据多边形 */}
          <polygon
            points={polygonPoints}
            fill={colors.primary[500]}
            fillOpacity="0.3"
            stroke={colors.primary[600]}
            strokeWidth="2"
          />
          
          {/* 数据点 */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors.primary[600]}
            />
          ))}
          
          {/* 标签 */}
          {points.map((point, index) => {
            const angle = (index * 2 * Math.PI) / scores.length - Math.PI / 2;
            const labelRadius = radius + 15;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            
            // 调整文本对齐方式
            let textAnchor = 'middle';
            let dominantBaseline = 'middle';
            
            if (Math.abs(x - center) < 5) {
              textAnchor = 'middle';
            } else if (x < center) {
              textAnchor = 'end';
            } else {
              textAnchor = 'start';
            }
            
            if (Math.abs(y - center) < 5) {
              dominantBaseline = 'middle';
            } else if (y < center) {
              dominantBaseline = 'bottom';
            } else {
              dominantBaseline = 'top';
            }
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline={dominantBaseline}
                fontSize="12"
                fill={colors.text.primary}
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };
  
  return (
    <Layout title="示例分析">
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
        
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
            color: colors.primary[800], 
            fontWeight: typography.fontWeight.bold
          }}>示例分析</h1>
          <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
            查看和分析评估结果
          </p>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <Button
              variant="outline"
              size="small"
              onClick={fetchLatestAssessment}
              className="ml-4"
            >
              重试
            </Button>
          </div>
        )}
        
        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {assessment ? (
              <>
                {/* 患者信息和测试概览 */}
                <Card className="p-6 border shadow-md mb-6" style={{ 
                  ...(mounted && animations.fadeInDown('0.3s', '0s'))
                }}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                        {assessment.testType} - {assessment.patientName}
                      </h2>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        患者ID: {assessment.patientId} | 测试日期: {assessment.date}
                      </p>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      <div className="px-3 py-1 rounded-full text-xs font-medium mr-3" style={{
                        backgroundColor: `${getStatusColor(assessment.status)}20`,
                        color: getStatusColor(assessment.status)
                      }}>
                        {assessment.status === 'completed' ? '已完成' : 
                         assessment.status === 'in-progress' ? '进行中' : '草稿'}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm" style={{ color: colors.text.secondary }}>总分</div>
                        <div className="text-2xl font-bold" style={{ color: getTotalScoreColor() }}>
                          {calculateTotalScore().value}/{calculateTotalScore().max}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 标签页导航 */}
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        selectedTab === 'overview' 
                          ? 'border-b-2 border-primary-500 text-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setSelectedTab('overview')}
                    >
                      概览
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        selectedTab === 'scores' 
                          ? 'border-b-2 border-primary-500 text-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setSelectedTab('scores')}
                    >
                      评分详情
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        selectedTab === 'metrics' 
                          ? 'border-b-2 border-primary-500 text-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setSelectedTab('metrics')}
                    >
                      指标分析
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        selectedTab === 'recommendations' 
                          ? 'border-b-2 border-primary-500 text-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setSelectedTab('recommendations')}
                    >
                      建议
                    </button>
                  </div>
                </Card>
                
                {/* 标签页内容 */}
                {selectedTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border shadow-md" style={{ 
                      ...(mounted && animations.fadeInUp('0.6s', '0.1s'))
                    }}>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                        评分概览
                      </h3>
                      <div className="space-y-3">
                        {assessment.scores.map((score, index) => (
                          <ScoreBar key={index} score={score} />
                        ))}
                      </div>
                    </Card>
                    
                    <Card className="p-6 border shadow-md" style={{ 
                      ...(mounted && animations.fadeInUp('0.6s', '0.2s'))
                    }}>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                        能力雷达图
                      </h3>
                      <SimpleRadarChart scores={assessment.scores} />
                    </Card>
                  </div>
                )}
                
                {selectedTab === 'scores' && (
                  <Card className="p-6 border shadow-md" style={{ 
                    ...(mounted && animations.fadeInUp('0.6s', '0.1s'))
                  }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                      评分详情
                    </h3>
                    <div className="space-y-4">
                      {assessment.scores.map((score, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium" style={{ color: colors.text.primary }}>
                              {score.label}
                            </span>
                            <span className="font-bold" style={{ 
                              color: score.color || (score.value / score.max >= 0.8 ? colors.success[600] : 
                              score.value / score.max >= 0.6 ? colors.warning[600] : colors.error[600])
                            }}>
                              {score.value}/{score.max}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${(score.value / score.max) * 100}%`,
                                backgroundColor: score.color || (score.value / score.max >= 0.8 ? colors.success[600] : 
                                score.value / score.max >= 0.6 ? colors.warning[600] : colors.error[600])
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                
                {selectedTab === 'metrics' && (
                  <Card className="p-6 border shadow-md" style={{ 
                    ...(mounted && animations.fadeInUp('0.6s', '0.1s'))
                  }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                      指标分析
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assessment.metrics.map((metric, index) => {
                        const status = metric.status || getMetricStatus(metric);
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium" style={{ color: colors.text.primary }}>
                                {metric.name}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                                backgroundColor: `${getStatusColor(status)}20`,
                                color: getStatusColor(status)
                              }}>
                                {getStatusText(status)}
                              </span>
                            </div>
                            <div className="text-2xl font-bold mb-1" style={{ color: colors.text.primary }}>
                              {metric.value} {metric.unit}
                            </div>
                            {metric.normalRange && (
                              <div className="text-xs" style={{ color: colors.text.secondary }}>
                                正常范围: {metric.normalRange.min}-{metric.normalRange.max} {metric.unit}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
                
                {selectedTab === 'recommendations' && (
                  <Card className="p-6 border shadow-md" style={{ 
                    ...(mounted && animations.fadeInUp('0.6s', '0.1s'))
                  }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                      评估总结与建议
                    </h3>
                    <div className="mb-6">
                      <h4 className="font-medium mb-2" style={{ color: colors.text.primary }}>总结</h4>
                      <p style={{ color: colors.text.secondary }}>
                        {assessment.summary}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: colors.text.primary }}>建议</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {assessment.recommendations.map((recommendation, index) => (
                          <li key={index} style={{ color: colors.text.secondary }}>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              // 空状态
              <Card className="p-12 text-center border shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
                  暂无评估数据
                </h3>
                <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
                  请先进行视频分析以获取评估结果
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigateTo('video-analysis')}
                >
                  进行视频分析
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ExampleAnalysis;