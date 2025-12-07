import React from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义历史记录类型
interface HistoryRecord {
  id: string;
  date: string;
  movementType: string;
  movementName: string;
  score: number;
  patientId?: string;
}

// 模拟历史数据
const mockHistoryData: HistoryRecord[] = [
  {
    id: '1',
    date: '2024-05-15',
    movementType: 'deep-squat',
    movementName: '深蹲',
    score: 85,
    patientId: 'P001'
  },
  {
    id: '2',
    date: '2024-05-14',
    movementType: 'hurdle-step',
    movementName: '跨栏步',
    score: 72,
    patientId: 'P001'
  },
  {
    id: '3',
    date: '2024-05-13',
    movementType: 'inline-lunge',
    movementName: '直线弓步',
    score: 78,
    patientId: 'P002'
  },
  {
    id: '4',
    date: '2024-05-12',
    movementType: 'shoulder-mobility',
    movementName: '肩部灵活性',
    score: 90,
    patientId: 'P002'
  },
  {
    id: '5',
    date: '2024-05-11',
    movementType: 'active-straight-leg-raise',
    movementName: '主动直腿抬高',
    score: 65,
    patientId: 'P001'
  }
];

const History: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted] = React.useState(true);
  
  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success[600];
    if (score >= 60) return colors.warning[600];
    return colors.error[600];
  };
  
  // 获取分数文本
  const getScoreText = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    return '需要改进';
  };
  
  // 查看详情
  const handleViewDetail = (record: HistoryRecord) => {
    // 这里可以导航到详情页面
    console.log('查看详情:', record);
  };
  
  return (
    <Layout title="历史记录">
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
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
            color: colors.primary[800], 
            fontWeight: typography.fontWeight.bold
          }}>评估历史记录</h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
            查看所有历史评估记录，追踪患者康复进展
          </p>
        </div>
        
        {/* 历史记录列表 */}
        <div className="space-y-4">
          {mockHistoryData.map((record, index) => (
            <Card 
              key={record.id}
              className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
              style={{
                ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold mr-3" style={{ color: colors.text.primary }}>
                      {record.movementName}
                    </h3>
                    <span className="text-sm px-2 py-1 rounded-full" style={{ 
                      backgroundColor: getScoreColor(record.score) + '20',
                      color: getScoreColor(record.score)
                    }}>
                      {getScoreText(record.score)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: colors.text.secondary }}>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {record.date}
                    </div>
                    {record.patientId && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        患者: {record.patientId}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0 md:ml-6">
                  <div className="text-center mr-6">
                    <div className="text-2xl font-bold" style={{ color: getScoreColor(record.score) }}>
                      {record.score}
                    </div>
                    <div className="text-xs" style={{ color: colors.text.secondary }}>分数</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleViewDetail(record)}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    查看详情
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 空状态 */}
        {mockHistoryData.length === 0 && (
          <Card className="p-12 text-center border shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>暂无历史记录</h3>
            <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
              开始进行评估后，历史记录将显示在这里
            </p>
            <Button
              variant="primary"
              onClick={() => navigateTo('movement-selection')}
            >
              开始评估
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default History;