import React, { useState } from 'react';
import { theme } from '../../theme';

import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/StatusIndicator';

// 测试页面容器组件
const TestContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-8">
    {children}
  </div>
);

// 组件测试区域组件
const TestSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="mb-8">
    {children}
  </section>
);

// 区域标题组件
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{
    borderBottom: `2px solid ${theme.colors.text.primary}`
  }} className="text-2xl font-semibold text-gray-800 mb-4 pb-2">
    {children}
  </h2>
);

// 组件网格布局
const ComponentGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {children}
  </div>
);

// 测试用例容器
const TestCase: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.borderColor}`
  }} className="p-4 bg-white shadow-sm">
    {children}
  </div>
);

// 测试用例标题
const TestCaseTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-base font-medium text-gray-800 mb-2">
    {children}
  </h3>
);

// 测试控制区域
const TestControls: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {children}
  </div>
);

// 简单的卡片组件实现
interface CardProps {
  children: React.ReactNode;
  shadowLevel?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, shadowLevel = 'medium', noPadding = false }) => {
  const getShadowClasses = () => {
    switch (shadowLevel) {
      case 'low': return 'shadow-sm';
      case 'high': return 'shadow-lg';
      default: return 'shadow';
    }
  };
  
  return (
    <div style={{
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.text.primary}`
    }} className={`bg-white ${getShadowClasses()} ${noPadding ? '' : 'p-4'}`}>
      {children}
    </div>
  );
};

// 简单的输入框组件实现
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error = false, fullWidth = false, ...props }) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        style={{
          borderColor: error ? '#ef4444' : undefined,
          borderRadius: theme.borderRadius.sm
        }}
        className={`px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded w-full focus:outline-none focus:ring-2 focus:ring-primary/50`}
        {...props}
      />
    </div>
  );
};

// 卡片子组件
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800 mb-1">{children}</h3>
);

const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-2">{children}</div>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2">{children}</div>
);

const ComponentTestPage: React.FC = () => {
  // 按钮测试状态
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'outline' | 'text'>('primary');
  const [buttonSize, setButtonSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonFullWidth, setButtonFullWidth] = useState(false);
  
  // 输入框测试状态
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // 卡片测试状态
  const [cardShadow, setCardShadow] = useState<'low' | 'medium' | 'high'>('medium');
  const [cardPadding, setCardPadding] = useState(true);
  
  // 状态指示器测试状态
  const [status, setStatus] = useState<'healthy' | 'unhealthy' | 'checking' | 'error'>('healthy');
  const [statusSize, setStatusSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showStatusText, setShowStatusText] = useState(true);

  return (
    <>
      <TestContainer>
        <h1>UI组件综合测试页面</h1>
        <p>测试所有UI组件在不同状态下的表现效果</p>
        
        {/* 按钮组件测试 */}
        <TestSection>
          <SectionTitle>按钮组件 (Button)</SectionTitle>
          <TestControls>
            <Button 
              variant={buttonVariant === 'primary' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setButtonVariant('primary')}
            >
              Primary
            </Button>
            <Button 
              variant={buttonVariant === 'secondary' ? 'secondary' : 'outline'}
              size="small"
              onClick={() => setButtonVariant('secondary')}
            >
              Secondary
            </Button>
            <Button 
              variant={buttonVariant === 'outline' ? 'outline' : 'outline'}
              size="small"
              onClick={() => setButtonVariant('outline')}
            >
              Outline
            </Button>
            <Button 
              variant={buttonVariant === 'text' ? 'text' : 'outline'}
              size="small"
              onClick={() => setButtonVariant('text')}
            >
              Text
            </Button>
            
            <div style={{ marginLeft: '1rem' }}></div>
            
            <Button 
              variant={buttonSize === 'small' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setButtonSize('small')}
            >
              Small
            </Button>
            <Button 
              variant={buttonSize === 'medium' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setButtonSize('medium')}
            >
              Medium
            </Button>
            <Button 
              variant={buttonSize === 'large' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setButtonSize('large')}
            >
              Large
            </Button>
            
            <div style={{ marginLeft: '1rem' }}></div>
            
            <Button 
              variant={buttonDisabled ? 'primary' : 'outline'}
              size="small"
              onClick={() => setButtonDisabled(!buttonDisabled)}
            >
              {buttonDisabled ? '已禁用' : '禁用'}
            </Button>
            <Button 
              variant={buttonFullWidth ? 'primary' : 'outline'}
              size="small"
              onClick={() => setButtonFullWidth(!buttonFullWidth)}
            >
              {buttonFullWidth ? '全宽' : '默认宽度'}
            </Button>
          </TestControls>
          
          <ComponentGrid>
            <TestCase>
              <TestCaseTitle>文本按钮</TestCaseTitle>
              <Button 
                variant={buttonVariant}
                size={buttonSize}
                disabled={buttonDisabled}
                fullWidth={buttonFullWidth}
              >
                点击测试按钮
              </Button>
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>文本按钮</TestCaseTitle>
              <Button 
                variant={buttonVariant}
                size={buttonSize}
                disabled={buttonDisabled}
                fullWidth={buttonFullWidth}
              >
                带文本按钮
              </Button>
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>带有文本的按钮</TestCaseTitle>
              <Button 
                variant={buttonVariant}
                size={buttonSize}
                disabled={buttonDisabled}
                fullWidth={buttonFullWidth}
              >
                操作按钮
              </Button>
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>小尺寸按钮</TestCaseTitle>
              <Button 
                variant={buttonVariant}
                size="small"
                disabled={buttonDisabled}
              >
                小按钮
              </Button>
            </TestCase>
          </ComponentGrid>
        </TestSection>
        
        {/* 输入框组件测试 */}
        <TestSection>
          <SectionTitle>输入框组件 (Input)</SectionTitle>
          <TestControls>
            <Button 
              variant={inputError ? 'primary' : 'outline'}
              size="small"
              onClick={() => setInputError(!inputError)}
            >
              {inputError ? '错误状态' : '正常状态'}
            </Button>
            <Button 
              variant={inputDisabled ? 'primary' : 'outline'}
              size="small"
              onClick={() => setInputDisabled(!inputDisabled)}
            >
              {inputDisabled ? '已禁用' : '禁用'}
            </Button>
          </TestControls>
          
          <ComponentGrid>
            <TestCase>
              <TestCaseTitle>基本输入框</TestCaseTitle>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="请输入内容"
                error={inputError}
                disabled={inputDisabled}
              />
              {inputError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>错误提示信息</p>}
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>带标签输入框</TestCaseTitle>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="请输入内容"
                label="示例输入"
                error={inputError}
                disabled={inputDisabled}
              />
              {inputError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>错误提示信息</p>}
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>全宽输入框</TestCaseTitle>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="全宽输入框"
                fullWidth
                error={inputError}
                disabled={inputDisabled}
              />
            </TestCase>
          </ComponentGrid>
        </TestSection>
        
        {/* 卡片组件测试 */}
        <TestSection>
          <SectionTitle>卡片组件 (Card)</SectionTitle>
          <TestControls>
            <Button 
              variant={cardShadow === 'low' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setCardShadow('low')}
            >
              低阴影
            </Button>
            <Button 
              variant={cardShadow === 'medium' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setCardShadow('medium')}
            >
              中阴影
            </Button>
            <Button 
              variant={cardShadow === 'high' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setCardShadow('high')}
            >
              高阴影
            </Button>
            <Button 
              variant={!cardPadding ? 'primary' : 'outline'}
              size="small"
              onClick={() => setCardPadding(!cardPadding)}
            >
              {cardPadding ? '默认内边距' : '无边距'}
            </Button>
          </TestControls>
          
          <ComponentGrid>
            <Card shadowLevel={cardShadow} noPadding={!cardPadding}>
              <CardHeader>
                <CardTitle>基础卡片</CardTitle>
                <CardDescription>这是一个基础卡片示例</CardDescription>
              </CardHeader>
              <CardContent>
                <p>卡片内容区域，用于展示详细信息</p>
              </CardContent>
            </Card>
            
            <Card shadowLevel={cardShadow} noPadding={!cardPadding}>
              <CardHeader>
                <CardTitle>带操作按钮的卡片</CardTitle>
              </CardHeader>
              <CardContent>
                <p>可以在卡片中放置各种交互元素</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="small">操作按钮</Button>
              </CardFooter>
            </Card>
            
            <Card shadowLevel={cardShadow} noPadding={!cardPadding}>
              <CardHeader>
                <CardTitle>紧凑卡片</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusIndicator status="healthy" size="small" />
                  <span>系统状态正常</span>
                </div>
              </CardContent>
            </Card>
          </ComponentGrid>
        </TestSection>
        
        {/* 状态指示器组件测试 */}
        <TestSection>
          <SectionTitle>状态指示器组件 (StatusIndicator)</SectionTitle>
          <TestControls>
            <Button 
              variant={status === 'healthy' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatus('healthy')}
            >
              健康
            </Button>
            <Button 
              variant={status === 'unhealthy' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatus('unhealthy')}
            >
              异常
            </Button>
            <Button 
              variant={status === 'checking' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatus('checking')}
            >
              检查中
            </Button>
            <Button 
              variant={status === 'error' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatus('error')}
            >
              错误
            </Button>
            
            <div style={{ marginLeft: '1rem' }}></div>
            
            <Button 
              variant={statusSize === 'small' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatusSize('small')}
            >
              小
            </Button>
            <Button 
              variant={statusSize === 'medium' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatusSize('medium')}
            >
              中
            </Button>
            <Button 
              variant={statusSize === 'large' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setStatusSize('large')}
            >
              大
            </Button>
            
            <div style={{ marginLeft: '1rem' }}></div>
            
            <Button 
              variant={showStatusText ? 'primary' : 'outline'}
              size="small"
              onClick={() => setShowStatusText(!showStatusText)}
            >
              {showStatusText ? '显示文本' : '隐藏文本'}
            </Button>
          </TestControls>
          
          <ComponentGrid>
            <TestCase>
              <TestCaseTitle>状态指示器</TestCaseTitle>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', backgroundColor: theme.colors.primary[500] }}>
                <StatusIndicator 
                  status={status} 
                  size={statusSize}
                  showText={showStatusText}
                />
              </div>
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>仅图标状态指示器</TestCaseTitle>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', backgroundColor: theme.colors.primary[500] }}>
                <StatusIndicator 
                  status={status} 
                  size={statusSize}
                  showText={false}
                />
              </div>
            </TestCase>
            
            <TestCase>
              <TestCaseTitle>状态指示器组合</TestCaseTitle>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '100px', backgroundColor: theme.colors.primary[500] }}>
                <StatusIndicator 
                  status="healthy" 
                  size="small"
                  showText={false}
                />
                <StatusIndicator 
                  status="unhealthy" 
                  size="small"
                  showText={false}
                />
                <StatusIndicator 
                  status="checking" 
                  size="small"
                  showText={false}
                />
                <StatusIndicator 
                  status="error" 
                  size="small"
                  showText={false}
                />
              </div>
            </TestCase>
          </ComponentGrid>
        </TestSection>
      </TestContainer>
    </>
  );
};

export default ComponentTestPage;