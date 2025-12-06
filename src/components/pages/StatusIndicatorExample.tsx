import React, { useState } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/StatusIndicator';

// 状态指示器示例页面
const StatusIndicatorExample: React.FC = () => {
  const [status, setStatus] = useState<'healthy' | 'unhealthy' | 'checking' | 'error'>('healthy');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showText, setShowText] = useState(true);
  
  // 模拟状态变化
  const simulateStatusChange = () => {
    const statuses: Array<'healthy' | 'unhealthy' | 'checking' | 'error'> = ['healthy', 'unhealthy', 'checking', 'error'];
    const currentIndex = statuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setStatus(statuses[nextIndex]);
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">状态指示器组件演示</h1>
          <p className="text-muted-foreground">展示系统健康状态指示器在不同配置下的效果</p>
        </div>
        
        {/* 状态指示器预览卡片 */}
        <Card>
          <Card.Header>
            <Card.Title>实时预览</Card.Title>
            <Card.Description>当前配置: {status} - {size} - {showText ? '显示文本' : '隐藏文本'}</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="flex items-center justify-center py-12">
              <StatusIndicator 
                status={status} 
                size={size}
                showText={showText}
              />
            </div>
          </Card.Content>
        </Card>
        
        {/* 控制选项卡片 */}
        <Card>
            <Card.Header>
              <Card.Title>交互控制</Card.Title>
              <Card.Description>调整状态指示器的配置参数</Card.Description>
            </Card.Header>
            <Card.Content>
            {/* 状态切换按钮 */}
            <div className="space-y-3">
              <h3 className="font-medium">状态选择</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button 
                  variant={status === 'healthy' ? 'primary' : 'outline'}
                  onClick={() => setStatus('healthy')}
                >
                  健康状态
                </Button>
                <Button 
                  variant={status === 'unhealthy' ? 'primary' : 'outline'}
                  onClick={() => setStatus('unhealthy')}
                >
                  异常状态
                </Button>
                <Button 
                  variant={status === 'checking' ? 'primary' : 'outline'}
                  onClick={() => setStatus('checking')}
                >
                  检查中
                </Button>
                <Button 
                  variant={status === 'error' ? 'primary' : 'outline'}
                  onClick={() => setStatus('error')}
                >
                  错误状态
                </Button>
              </div>
            </div>
            
            {/* 尺寸选择 */}
            <div className="space-y-3">
              <h3 className="font-medium">尺寸选择</h3>
              <div className="flex gap-3">
                <Button 
                  variant={size === 'small' ? 'primary' : 'outline'}
                  onClick={() => setSize('small')}
                >
                  小
                </Button>
                <Button 
                  variant={size === 'medium' ? 'primary' : 'outline'}
                  onClick={() => setSize('medium')}
                >
                  中
                </Button>
                <Button 
                  variant={size === 'large' ? 'primary' : 'outline'}
                  onClick={() => setSize('large')}
                >
                  大
                </Button>
              </div>
            </div>
            
            {/* 文本显示控制 */}
            <div className="space-y-3">
              <h3 className="font-medium">文本显示</h3>
              <Button 
                variant={showText ? 'primary' : 'outline'}
                onClick={() => setShowText(!showText)}
              >
                {showText ? '隐藏文本' : '显示文本'}
              </Button>
            </div>
            
            {/* 模拟状态变化按钮 */}
            <div>
              <Button 
                variant="primary"
                onClick={simulateStatusChange}
              >
                模拟状态变化
              </Button>
            </div>
            </Card.Content>
        </Card>
        
        {/* 状态指示器在不同场景中的应用示例 */}
        <Card>
          <Card.Header>
            <Card.Title>应用场景示例</Card.Title>
            <Card.Description>在实际界面中的使用示例</Card.Description>
          </Card.Header>
          <Card.Content>
            {/* 顶部状态栏示例 */}
            <div className="mb-6 border rounded-lg p-4 bg-muted">
              <h4 className="font-medium mb-3">顶部状态栏示例</h4>
              <div className="flex items-center justify-between">
                <div className="font-medium">系统监控面板</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>后端服务</span>
                    <StatusIndicator status="healthy" size="small" showText={false} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>数据库</span>
                    <StatusIndicator status="checking" size="small" showText={false} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>API 接口</span>
                    <StatusIndicator status="unhealthy" size="small" showText={false} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 控制面板示例 */}
            <div className="mb-6 border rounded-lg p-4 bg-muted">
              <h4 className="font-medium mb-3">控制面板示例</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <Card.Header>
                      <Card.Title>服务健康状态</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="healthy" size="medium" />
                      </div>
                    </Card.Content>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title>数据同步状态</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="checking" size="medium" />
                      </div>
                    </Card.Content>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title>连接状态</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="error" size="medium" />
                      </div>
                    </Card.Content>
                  </Card>
              </div>
            </div>
                    </Card.Content>
        </Card>
      </div>
    </Layout>
  );
};

export default StatusIndicatorExample;