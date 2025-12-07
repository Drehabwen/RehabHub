import React, { useState, useEffect } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';
import { getModuleApi } from '../../services/api';

// 定义报告类型
interface Report {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  date: string;
  score: number;
  status: 'completed' | 'in-progress' | 'draft';
  summary: string;
  details?: string;
}

const Reports: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'draft'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    patientId: '',
    testId: '',
    summary: '',
    details: ''
  });
  
  // 组件挂载后设置动画并获取数据
  useEffect(() => {
    setMounted(true);
    fetchReports();
  }, []);
  
  // 从API获取报告数据
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 尝试从API获取报告数据
      const apiClient = getModuleApi('results-history');
      const data = await apiClient.get<Report[]>('/api/results');
      setReports(data || []);
    } catch (err) {
      console.error('获取报告数据失败:', err);
      setError('无法加载报告数据，请稍后重试');
      // 如果API调用失败，设置为空数组而不是使用模拟数据
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 过滤报告
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // 查看报告详情
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };
  
  // 编辑报告
  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    // 这里可以打开编辑表单
  };
  
  // 删除报告
  const handleDeleteReport = async (id: string) => {
    if (confirm('确定要删除此报告吗？')) {
      try {
        // 尝试从API删除报告
        const apiClient = getModuleApi('results-history');
        await apiClient.delete(`/api/results/${id}`);
        
        // 如果API调用成功，更新本地状态
        setReports(reports.filter(report => report.id !== id));
        if (selectedReport && selectedReport.id === id) {
          setSelectedReport(null);
        }
      } catch (err) {
        console.error('删除报告失败:', err);
        alert('删除报告失败，请稍后重试');
      }
    }
  };
  
  // 创建新报告
  const handleCreateReport = async () => {
    if (newReport.patientId && newReport.testId) {
      try {
        // 这里应该从患者和测试数据中获取名称
        const patientName = '新患者'; // 实际应用中应该从患者数据获取
        const testName = '新测试'; // 实际应用中应该从测试数据获取
        
        const reportData = {
          patientId: newReport.patientId,
          patientName,
          testId: newReport.testId,
          testName,
          date: new Date().toISOString().split('T')[0],
          score: 0,
          status: 'draft',
          summary: newReport.summary || '',
          details: newReport.details || ''
        };
        
        // 尝试通过API创建报告
        const apiClient = getModuleApi('results-history');
        const createdReport = await apiClient.post<Report>('/api/results', reportData);
        
        // 如果API调用成功，更新本地状态
        setReports([...reports, createdReport]);
        setNewReport({
          patientId: '',
          testId: '',
          summary: '',
          details: ''
        });
        setShowCreateForm(false);
      } catch (err) {
        console.error('创建报告失败:', err);
        alert('创建报告失败，请稍后重试');
      }
    }
  };
  
  // 导出报告
  const handleExportReport = async (report: Report, format: 'pdf' | 'excel') => {
    try {
      // 尝试通过API导出报告
      const apiClient = getModuleApi('results-history');
      await apiClient.get(`/api/results/${report.id}/export?format=${format}`);
      alert(`正在导出报告 ${report.id} 为 ${format} 格式`);
    } catch (err) {
      console.error('导出报告失败:', err);
      alert(`导出报告失败，请稍后重试`);
    }
  };
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success[600];
      case 'in-progress':
        return colors.warning[600];
      case 'draft':
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
      case 'draft':
        return '草稿';
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
  
  return (
    <Layout title="报告管理">
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
            }}>报告管理</h1>
            <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
              查看和管理评估报告
            </p>
          </div>
          
          <Button
            variant="primary"
            size="medium"
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建报告
          </Button>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <Button
              variant="outline"
              size="small"
              onClick={fetchReports}
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
            {/* 搜索和过滤 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索患者姓名、测试名称或报告ID..."
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ borderColor: colors.neutral[300] }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ borderColor: colors.neutral[300] }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">全部状态</option>
                  <option value="completed">已完成</option>
                  <option value="in-progress">进行中</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
            </div>
            
            {/* 创建报告表单 */}
            {showCreateForm && (
              <Card className="p-6 border shadow-md mb-6" style={{ 
                ...(mounted && animations.fadeInDown('0.3s', '0s'))
              }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>创建新报告</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      患者ID
                    </label>
                    <input
                      type="text"
                      placeholder="患者ID"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.patientId}
                      onChange={(e) => setNewReport({...newReport, patientId: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      测试ID
                    </label>
                    <input
                      type="text"
                      placeholder="测试ID"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.testId}
                      onChange={(e) => setNewReport({...newReport, testId: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      报告摘要
                    </label>
                    <textarea
                      placeholder="报告摘要"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.summary}
                      onChange={(e) => setNewReport({...newReport, summary: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      详细描述
                    </label>
                    <textarea
                      placeholder="详细描述"
                      rows={5}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newReport.details}
                      onChange={(e) => setNewReport({...newReport, details: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    取消
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateReport}
                  >
                    创建报告
                  </Button>
                </div>
              </Card>
            )}
            
            {/* 报告列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <Card 
                  key={report.id}
                  className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>
                        {report.testName}
                      </h3>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        报告ID: {report.id}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                      backgroundColor: `${getStatusColor(report.status)}20`,
                      color: getStatusColor(report.status)
                    }}>
                      {getStatusText(report.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm" style={{ color: colors.text.secondary }}>
                      <span className="font-medium">患者:</span> {report.patientName}
                    </div>
                    
                    <div className="text-sm" style={{ color: colors.text.secondary }}>
                      <span className="font-medium">日期:</span> {report.date}
                    </div>
                    
                    {report.status === 'completed' && report.score > 0 && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2" style={{ color: colors.text.secondary }}>得分:</span>
                        <span className="text-lg font-bold" style={{ color: getScoreColor(report.score) }}>
                          {report.score}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.text.secondary }}>
                    {report.summary}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleViewReport(report)}
                      className="flex-1"
                    >
                      查看
                    </Button>
                    
                    {report.status === 'completed' && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleExportReport(report, 'pdf')}
                          style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                          title="导出为PDF"
                        >
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleExportReport(report, 'excel')}
                          style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                          title="导出为Excel"
                        >
                          Excel
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleDeleteReport(report.id)}
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
            {filteredReports.length === 0 && (
              <Card className="p-12 text-center border shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
                  {searchTerm || filterStatus !== 'all' ? '未找到匹配的报告' : '暂无报告记录'}
                </h3>
                <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
                  {searchTerm || filterStatus !== 'all' ? '尝试调整搜索条件' : '创建第一个报告开始使用系统'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateForm(true)}
                  >
                    创建报告
                  </Button>
                )}
              </Card>
            )}
          </>
        )}
        
        {/* 报告详情模态框 */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                    {selectedReport.testName}
                  </h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>报告ID</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>状态</p>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getStatusColor(selectedReport.status) }}></div>
                        <p className="text-base" style={{ color: getStatusColor(selectedReport.status) }}>
                          {getStatusText(selectedReport.status)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>患者ID</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>测试ID</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.testId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>患者姓名</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>日期</p>
                      <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.date}</p>
                    </div>
                    {selectedReport.status === 'completed' && (
                      <div>
                        <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>得分</p>
                        <p className="text-lg font-bold" style={{ color: getScoreColor(selectedReport.score) }}>
                          {selectedReport.score}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>摘要</p>
                    <p className="text-base" style={{ color: colors.text.primary }}>{selectedReport.summary}</p>
                  </div>
                  
                  {selectedReport.details && (
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>详细描述</p>
                      <p className="text-base whitespace-pre-wrap" style={{ color: colors.text.primary }}>{selectedReport.details}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedReport(null)}
                  >
                    关闭
                  </Button>
                  {selectedReport.status === 'completed' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleExportReport(selectedReport, 'pdf')}
                      >
                        导出PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExportReport(selectedReport, 'excel')}
                      >
                        导出Excel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;