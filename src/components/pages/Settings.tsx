import React, { useState, useEffect } from 'react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义设置类型
interface Setting {
  id: string;
  name: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'range';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

// 模拟设置数据
const mockSettingsData: Setting[] = [
  {
    id: 'S001',
    name: '自动保存',
    description: '自动保存评估进度',
    type: 'toggle',
    value: true
  },
  {
    id: 'S002',
    name: '视频质量',
    description: '录制视频的质量',
    type: 'select',
    value: 'high',
    options: ['low', 'medium', 'high']
  },
  {
    id: 'S003',
    name: '分析精度',
    description: '视频分析的精度级别',
    type: 'range',
    value: 75,
    min: 50,
    max: 100,
    step: 5
  },
  {
    id: 'S004',
    name: '数据导出格式',
    description: '导出数据的默认格式',
    type: 'select',
    value: 'pdf',
    options: ['pdf', 'excel', 'csv']
  },
  {
    id: 'S005',
    name: '提醒通知',
    description: '接收评估提醒和通知',
    type: 'toggle',
    value: false
  },
  {
    id: 'S006',
    name: '深色模式',
    description: '使用深色主题界面',
    type: 'toggle',
    value: false
  },
  {
    id: 'S007',
    name: '语言设置',
    description: '界面显示语言',
    type: 'select',
    value: 'zh-CN',
    options: ['zh-CN', 'en-US']
  },
  {
    id: 'S008',
    name: '数据备份',
    description: '自动备份数据到云端',
    type: 'toggle',
    value: true
  }
];

const Settings: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<Setting[]>(mockSettingsData);
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'advanced'>('general');
  const [hasChanges, setHasChanges] = useState(false);
  
  // 组件挂载后设置动画
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 更新设置
  const handleSettingChange = (id: string, value: any) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
    setHasChanges(true);
  };
  
  // 保存设置
  const handleSaveSettings = () => {
    // 这里可以添加保存到后端的逻辑
    console.log('保存设置:', settings);
    setHasChanges(false);
    
    // 显示保存成功提示
    setTimeout(() => {
      alert('设置已保存');
    }, 100);
  };
  
  // 重置设置
  const handleResetSettings = () => {
    if (confirm('确定要重置所有设置吗？')) {
      setSettings(mockSettingsData);
      setHasChanges(false);
    }
  };
  
  // 根据标签页过滤设置
  const getFilteredSettings = () => {
    switch (activeTab) {
      case 'general':
        return settings.filter(s => 
          ['S001', 'S002', 'S003', 'S004', 'S006', 'S007'].includes(s.id)
        );
      case 'privacy':
        return settings.filter(s => 
          ['S005', 'S008'].includes(s.id)
        );
      case 'advanced':
        return settings.filter(s => 
          ['S003'].includes(s.id)
        );
      default:
        return settings;
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
        
        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
              color: colors.primary[800], 
              fontWeight: typography.fontWeight.bold
            }}>系统设置</h1>
            <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
              配置系统参数和用户偏好
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="medium"
              onClick={handleResetSettings}
              style={{ borderColor: colors.error[100], color: colors.error[500] }}
            >
              重置
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleSaveSettings}
              disabled={!hasChanges}
            >
              保存设置
            </Button>
          </div>
        </div>
        
        {/* 标签页 */}
        <div className="flex flex-wrap gap-2 mb-8 border-b" style={{ borderColor: colors.neutral[200] }}>
          {(['general', 'privacy', 'advanced'] as const).map(tab => (
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
              {tab === 'general' && '常规设置'}
              {tab === 'privacy' && '隐私与安全'}
              {tab === 'advanced' && '高级选项'}
            </button>
          ))}
        </div>
        
        {/* 设置列表 */}
        <div className="space-y-6">
          {getFilteredSettings().map((setting, index) => (
            <Card 
              key={setting.id}
              className="p-6 border shadow-md"
              style={{
                ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-lg font-medium mb-1" style={{ color: colors.text.primary }}>
                    {setting.name}
                  </h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    {setting.description}
                  </p>
                </div>
                
                <div className="flex items-center">
                  {setting.type === 'toggle' && (
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.value ? colors.primary[600] : colors.neutral[300]
                      }`}
                      onClick={() => handleSettingChange(setting.id, !setting.value)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                  
                  {setting.type === 'select' && setting.options && (
                    <select
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ 
                        borderColor: colors.neutral[300],
                        color: colors.text.primary
                      }}
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    >
                      {setting.options.map(option => (
                        <option key={option} value={option}>
                          {option === 'zh-CN' && '简体中文'}
                          {option === 'en-US' && 'English'}
                          {option === 'low' && '低'}
                          {option === 'medium' && '中'}
                          {option === 'high' && '高'}
                          {option === 'pdf' && 'PDF'}
                          {option === 'excel' && 'Excel'}
                          {option === 'csv' && 'CSV'}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {setting.type === 'range' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                        {setting.value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 系统信息 */}
        <Card className="p-6 border shadow-md mt-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: colors.text.primary }}>
            系统信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                <span className="font-medium">应用版本:</span> 1.0.0
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                <span className="font-medium">构建日期:</span> 2024-05-20
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                <span className="font-medium">许可证:</span> MIT License
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                <span className="font-medium">支持邮箱:</span> support@rehabhub.com
              </p>
            </div>
          </div>
        </Card>
      </div>
  );
};

export default Settings;