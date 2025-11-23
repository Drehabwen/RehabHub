import React from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Input from '../ui/Input';

// Dashboard组件样式定义已移除

const Dashboard: React.FC = () => {

  
  // 使用window.location.href模拟导航
  const navigateToStatusDemo = () => {
    window.location.href = '#/status-indicator-example';
    // 强制更新App中的activeModule状态
    const event = new CustomEvent('setActiveModule', { detail: 'status-indicator-example' });
    window.dispatchEvent(event);
  };
  
  const navigateToComponentTest = () => {
    window.location.href = '#/component-test';
    // 强制更新App中的activeModule状态
    const event = new CustomEvent('setActiveModule', { detail: 'component-test' });
    window.dispatchEvent(event);
  };

  return (
    <Layout title="康复评估平台">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">欢迎使用 DeepRehab 康复评估系统</h1>
          <p className="text-gray-600">专业的动作功能评估工具，为康复治疗提供精准的数据支持</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="shadow-sm">
            <Card.Content>
              <div className="text-center p-3">
                <div className="text-xl font-bold mb-1">24</div>
                <p className="text-gray-600 text-sm">今日评估次数</p>
              </div>
            </Card.Content>
          </Card>
          <Card className="shadow-sm">
            <Card.Content>
              <div className="text-center p-3">
                <div className="text-xl font-bold mb-1">156</div>
                <p className="text-gray-600 text-sm">活跃患者</p>
              </div>
            </Card.Content>
          </Card>
          <Card className="shadow-sm">
            <Card.Content>
              <div className="text-center p-3">
                <div className="text-xl font-bold mb-1">89%</div>
                <p className="text-gray-600 text-sm">评估完成率</p>
              </div>
            </Card.Content>
          </Card>
          <Card className="shadow-sm">
            <Card.Content>
              <div className="text-center p-3">
                <div className="text-xl font-bold mb-1">4.8/5</div>
                <p className="text-gray-600 text-sm">治疗师满意度</p>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card className="shadow-md">
            <Card.Header>
              <Card.Title>视频动作评估</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 mb-4">
                通过AI姿态识别技术，实时分析患者的动作表现，提供精确的角度和对称性评估。
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    window.location.href = '#/movement-selection';
                    const event = new CustomEvent('setActiveModule', { detail: 'movement-selection' });
                    window.dispatchEvent(event);
                  }}
                  className="min-w-[120px] min-h-[48px]"
                >
                  开始评估
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={navigateToStatusDemo}
                  className="min-w-[120px] min-h-[48px]"
                >
                  查看状态指示器演示
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={navigateToComponentTest}
                  className="min-w-[120px] min-h-[48px]"
                >
                  组件测试
                </Button>
              </div>
            </Card.Content>
          </Card>

          <Card className="shadow-md">
            <Card.Header>
              <Card.Title>历史数据追踪</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 mb-4">
                记录并可视化患者的康复进度，帮助治疗师调整治疗方案，提高康复效果。
              </p>
              <Button 
                variant="secondary"
                onClick={() => {
                  window.location.href = '#/history';
                  const event = new CustomEvent('setActiveModule', { detail: 'history' });
                  window.dispatchEvent(event);
                }}
                className="min-w-[120px] min-h-[48px]"
              >
                查看历史
              </Button>
            </Card.Content>
          </Card>

          <Card className="shadow-md">
            <Card.Header>
              <Card.Title>患者管理</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 mb-4">
                便捷的患者信息管理系统，支持快速创建评估档案和查看详细的康复数据。
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  window.location.href = '#/patients';
                  const event = new CustomEvent('setActiveModule', { detail: 'patients' });
                  window.dispatchEvent(event);
                }}
                className="min-w-[120px] min-h-[48px]"
              >
                管理患者
              </Button>
            </Card.Content>
          </Card>
        </div>

        <div className="p-4 md:p-6 bg-gray-50 rounded-xl text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-2">准备好开始新的评估了吗？</h2>
          <p className="text-gray-600 mb-4">
            输入患者信息，立即开始专业的康复动作功能评估，获取精准的分析报告。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Input 
              placeholder="输入患者ID" 
              className="w-full sm:w-64"
            />
            <Button 
              size="large"
              onClick={() => {
                window.location.href = '#/movement-selection';
                const event = new CustomEvent('setActiveModule', { detail: 'movement-selection' });
                window.dispatchEvent(event);
              }}
              className="min-w-[120px] min-h-[48px] w-full sm:w-auto"
            >
              快速开始
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;