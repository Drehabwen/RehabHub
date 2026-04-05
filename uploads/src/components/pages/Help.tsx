import React, { useState, useEffect } from 'react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义帮助类型
interface HelpItem {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
}

// 模拟帮助数据
const mockHelpData: HelpItem[] = [
  {
    id: 'H001',
    title: '如何开始评估',
    category: '快速入门',
    content: '开始评估前，请确保已添加患者信息。选择患者后，点击"开始评估"按钮，选择相应的测试项目，按照指引完成评估流程。',
    lastUpdated: '2024-05-15'
  },
  {
    id: 'H002',
    title: '视频录制技巧',
    category: '使用指南',
    content: '录制视频时，请确保光线充足，背景简洁。患者应穿着贴身衣物，确保关键关节清晰可见。建议从正面、侧面和背面多个角度录制。',
    lastUpdated: '2024-05-14'
  },
  {
    id: 'H003',
    title: '理解评估报告',
    category: '报告解读',
    content: '评估报告包含总分、各项得分和专业建议。分数越高表示功能越好。红色区域表示需要重点关注和改善的方面。',
    lastUpdated: '2024-05-13'
  },
  {
    id: 'H004',
    title: '数据导出功能',
    category: '使用指南',
    content: '系统支持将评估数据导出为PDF或Excel格式。在报告列表中选择要导出的报告，点击"导出"按钮，选择格式即可下载。',
    lastUpdated: '2024-05-12'
  },
  {
    id: 'H005',
    title: '常见问题解答',
    category: '故障排除',
    content: 'Q: 视频上传失败怎么办？A: 请检查网络连接，确保视频格式为MP4，大小不超过100MB。Q: 评估结果不准确？A: 请确保视频质量良好，动作标准，如有疑问可重新录制。',
    lastUpdated: '2024-05-11'
  },
  {
    id: 'H006',
    title: '账户与权限',
    category: '系统管理',
    content: '系统支持多用户角色：管理员可管理所有功能和数据；评估师可进行评估和查看报告；访客仅可查看公开内容。请联系管理员分配相应权限。',
    lastUpdated: '2024-05-10'
  }
];

const Help: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [helpItems] = useState<HelpItem[]>(mockHelpData);
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // 组件挂载后设置动画
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 获取所有类别
  const categories = ['all', ...Array.from(new Set(helpItems.map(item => item.category)))];
  
  // 过滤帮助项
  const filteredHelpItems = helpItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // 查看帮助详情
  const handleViewItem = (item: HelpItem) => {
    setSelectedItem(item);
  };
  
  // 获取类别颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '快速入门':
        return colors.primary[600];
      case '使用指南':
        return colors.success[500];
      case '报告解读':
        return colors.warning[500];
      case '故障排除':
        return colors.error[500];
      case '系统管理':
        return colors.neutral[600];
      default:
        return colors.neutral[600];
    }
  };
  
  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      <style>{animationKeyframes}</style>
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
          }}>帮助中心</h1>
          <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
            查找使用指南、常见问题解答和技术支持
          </p>
        </div>
        
        {/* 搜索栏 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索帮助内容..."
              className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ borderColor: colors.neutral[300] }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5" style={{ color: colors.neutral[400] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* 类别标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeCategory === category ? 'text-white' : ''
              }`}
              style={{
                backgroundColor: activeCategory === category 
                  ? getCategoryColor(category) 
                  : `${getCategoryColor(category)}20`,
                color: activeCategory === category 
                  ? '#ffffff' 
                  : getCategoryColor(category)
              }}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
        
        {/* 帮助列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredHelpItems.map((item, index) => (
            <Card 
              key={item.id}
              className="p-6 border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
              }}
              onClick={() => handleViewItem(item)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                  {item.title}
                </h3>
                <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                  backgroundColor: `${getCategoryColor(item.category)}20`,
                  color: getCategoryColor(item.category)
                }}>
                  {item.category}
                </div>
              </div>
              
              <p className="text-sm mb-4 line-clamp-3" style={{ color: colors.text.secondary }}>
                {item.content}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: colors.text.secondary }}>
                  更新于: {item.lastUpdated}
                </span>
                <Button
                  variant="text"
                  size="small"
                  style={{ color: colors.primary[600] }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewItem(item);
                  }}
                >
                  查看详情
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 空状态 */}
        {filteredHelpItems.length === 0 && (
          <Card className="p-12 text-center border shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
              未找到相关帮助内容
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
              尝试调整搜索条件或浏览其他类别
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
            >
              重置搜索
            </Button>
          </Card>
        )}
        
        {/* 常用链接 */}
        <Card className="p-6 border shadow-md">
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
            常用链接
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" style={{ color: colors.primary[600] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span style={{ color: colors.text.primary }}>用户手册</span>
            </a>
            
            <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" style={{ color: colors.primary[600] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span style={{ color: colors.text.primary }}>视频教程</span>
            </a>
            
            <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" style={{ color: colors.primary[600] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: colors.text.primary }}>常见问题</span>
            </a>
            
            <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" style={{ color: colors.primary[600] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span style={{ color: colors.text.primary }}>联系支持</span>
            </a>
          </div>
        </Card>
        
        {/* 帮助详情模态框 */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                    {selectedItem.title}
                  </h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{
                      backgroundColor: `${getCategoryColor(selectedItem.category)}20`,
                      color: getCategoryColor(selectedItem.category)
                    }}>
                      {selectedItem.category}
                    </div>
                    <span className="text-sm" style={{ color: colors.text.secondary }}>
                      更新于: {selectedItem.lastUpdated}
                    </span>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p style={{ color: colors.text.primary, lineHeight: 1.6 }}>
                      {selectedItem.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                  >
                    关闭
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      // 这里可以添加打印功能
                      window.print();
                    }}
                  >
                    打印
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
  );
};

export default Help;