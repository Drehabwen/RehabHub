import React, { useState } from 'react';
// 使用内联样式和Tailwind CSS代替styled-components
import { theme } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

// 布局容器组件
const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div 
    style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background.default,
      display: 'flex',
      flexDirection: 'column'
    }}
    className="flex flex-col min-h-screen bg-[#f8fafc]"
  >
    {children}
  </div>
);

// 头部组件
const Header: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <header 
    style={{
      backgroundColor: theme.colors.primary[500],
      color: theme.colors.text.primary,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: theme.shadows.default,
      position: 'relative' // 添加相对定位，让子元素的绝对定位相对于Header
    }}
    className={`bg-primary text-white p-3 md:p-4 flex justify-between items-center shadow-md ${className}`}
  >
    {children}
  </header>
);

// Logo容器组件
const LogoContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div 
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    }}
    className="flex items-center gap-2"
  >
    {children}
  </div>
);

// Logo组件
const Logo: React.FC<{ children?: React.ReactNode }> = ({ children = 'DeepRehab' }) => (
  <h1 
    style={{
      fontSize: theme.typography.fontSize.lg,
      fontWeight: 'bold',
      margin: 0
    }}
    className="text-lg md:text-xl font-bold m-0"
  >
    {children}
  </h1>
);

// 标题组件
const TitleComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 
    style={{
      fontSize: theme.typography.fontSize.lg,
      margin: 0,
      opacity: 0.9
    }}
    className="text-lg m-0 opacity-90"
  >
    {children}
  </h2>
);

// 头部操作区组件 - 修改为可选的children属性
const HeaderActions: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div 
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md
    }}
    className="flex items-center gap-4"
  >
    {children}
  </div>
);

// 主内容区组件
const Main: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <main 
    className={`flex-1 flex flex-col md:flex-row gap-4 p-4 ${className}`}
    style={{
      gap: theme.spacing.md,
      position: 'relative',
      zIndex: 1
    }}
  >
    {children}
  </main>
);

// 侧边栏组件
const Sidebar: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <aside 
    className={`w-full md:w-72 p-4 md:p-6 rounded-lg border md:shadow ${className}`}
    style={{
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.md,
      borderColor: theme.colors.borderColor,
      boxShadow: theme.shadows.default,
      position: 'relative',
      zIndex: 2
    }}
  >
    {children}
  </aside>
);

// 内容区组件
const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-1 min-w-0" style={{ position: 'relative', zIndex: 2 }}>
    {children}
  </div>
);

// 侧边栏标题组件
const SidebarTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 
    className="mb-6 pb-2 border-b"
    style={{
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
      margin: '0 0 24px 0',
      borderBottomColor: theme.colors.primary[100],
      borderBottomWidth: '2px'
    }}
  >
    {children}
  </h3>
);

// 导航列表组件
const NavigationList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-none p-0 m-0 flex flex-col gap-1">
    {children}
  </ul>
);

// 导航项组件
const NavigationItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="m-0">
    {children}
  </li>
);

interface NavigationLinkProps {
  href?: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ 
  href, 
  children, 
  active = false, 
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  const baseClasses = 'block px-4 py-2 rounded-md text-sm transition-all duration-200 min-h-[48px] flex items-center';
  const stateClasses = active 
    ? 'text-primary bg-primary/20 font-bold' 
    : isHovered 
      ? 'bg-gray-100 text-gray-800' 
      : 'text-gray-600';
  
  const linkProps = {
    className: `${baseClasses} ${stateClasses} ${className}`,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
    // 添加触摸反馈
    style: {
      touchAction: 'manipulation' as const,
      userSelect: 'none' as const
    }
  };
  
  return href ? (
    <a href={href} {...linkProps}>
      {children}
    </a>
  ) : (
    <button {...linkProps}>
      {children}
    </button>
  );
};

// 新的导航组件，使用导航上下文
const Navigation: React.FC = () => {
  const { state, navigateTo } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigationClick = (module: string) => {
    navigateTo(module);
    // 在移动端点击导航后关闭侧边栏
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* 移动端菜单按钮 - 显示在Main内部，保持适当间距 */}
      <div className="md:hidden mb-4 flex justify-start">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          aria-label={sidebarOpen ? "关闭菜单" : "打开菜单"}
          style={{
            backgroundColor: theme.colors.background.paper,
            border: `1px solid ${theme.colors.borderColor}`,
            boxShadow: theme.shadows.default,
            position: 'relative',
            zIndex: 10
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              // 关闭图标
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // 菜单图标
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 移动端侧边栏覆盖层 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
        />
      )}
      
      {/* 侧边栏 - 移动端抽屉式，桌面端固定 */}
      <Sidebar className={`
        md:w-72 md:static md:block fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:shadow-none shadow-lg
        w-64
        md:mb-0 mb-4
        z-50
      `}>
        <div className="flex justify-between items-center pb-4 border-b mb-4">
          <SidebarTitle>功能导航</SidebarTitle>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="关闭菜单"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NavigationList>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'dashboard'} 
              onClick={() => handleNavigationClick('dashboard')} 
              className="py-3"
            >
              仪表盘
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'movement-selection'} 
              onClick={() => handleNavigationClick('movement-selection')} 
              className="py-3"
            >
              康复评估
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'history'} 
              onClick={() => handleNavigationClick('history')} 
              className="py-3"
            >
              历史记录
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'settings'} 
              onClick={() => handleNavigationClick('settings')} 
              className="py-3"
            >
              设置
            </NavigationLink>
          </NavigationItem>
        </NavigationList>
      </Sidebar>
    </>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <LayoutContainer>
      <Header className="md:p-4 p-3">
        {/* 移除了Navigation组件，将其移到Main组件中 */}
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            {/* 移动端菜单按钮由Navigation组件内部管理 */}
          </div>
          <LogoContainer>
            <Logo>DeepRehab</Logo>
            {title && <TitleComponent>{title}</TitleComponent>}
          </LogoContainer>
          <HeaderActions>
            {/* 移除了StatusIndicator组件，避免出现连接错误提示 */}
          </HeaderActions>
        </div>
      </Header>
      
      <Main className="md:flex-row flex flex-col">
        <Navigation />
        <Content>{children}</Content>
      </Main>
    </LayoutContainer>
  );
};

// 导出为命名导出和默认导出
export { Layout };
export default Layout;