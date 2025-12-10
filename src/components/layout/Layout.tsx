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
const Header: React.FC<{ children: React.ReactNode; className?: string; onMenuClick?: () => void }> = ({ children, className = '', onMenuClick }) => (
  <header 
    style={{
      backgroundColor: theme.colors.primary[500],
      color: theme.colors.text.primary,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: theme.shadows.default,
      position: 'relative',
      zIndex: 30 // 提高Header层级
    }}
    className={`bg-primary text-white p-3 md:p-4 flex justify-between items-center shadow-md ${className}`}
  >
    {onMenuClick && (
      <button 
        onClick={onMenuClick}
        className="mr-3 p-1 rounded hover:bg-white/10 transition-colors"
        aria-label="打开菜单"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    )}
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
      boxShadow: theme.shadows.default
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
const Navigation: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, navigateTo } = useNavigation();

  const handleNavigationClick = (module: string) => {
    navigateTo(module);
    // 在移动端点击导航后关闭侧边栏
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* 半覆盖抽屉式导航 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
          onClick={onClose}
        />
      )}
      <Sidebar className={`
        fixed inset-y-0 right-0 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        w-[90vw] md:w-[50vw] max-w-[560px] shadow-lg z-50
      `}>
        <div className="flex justify-between items-center pb-4 border-b mb-4">
          <SidebarTitle>功能导航</SidebarTitle>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
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
              <span className="mr-3 text-lg">📊</span>
              仪表盘
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'movement-selection'} 
              onClick={() => handleNavigationClick('movement-selection')} 
              className="py-3"
            >
              <span className="mr-3 text-lg">🧘</span>
              康复评估
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'patients'} 
              onClick={() => handleNavigationClick('patients')} 
              className="py-3"
            >
              <span className="mr-3 text-lg">👥</span>
              患者管理
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'history'} 
              onClick={() => handleNavigationClick('history')} 
              className="py-3"
            >
              <span className="mr-3 text-lg">🕒</span>
              历史记录
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'reports'} 
              onClick={() => handleNavigationClick('reports')} 
              className="py-3"
            >
              <span className="mr-3 text-lg">📄</span>
              评估报告
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink 
              active={state.currentModule === 'settings'} 
              onClick={() => handleNavigationClick('settings')} 
              className="py-3"
            >
              <span className="mr-3 text-lg">⚙️</span>
              设置
            </NavigationLink>
          </NavigationItem>
        </NavigationList>
        
        {/* 底部快速操作区 */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleNavigationClick('movement-selection')}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium"
            style={{ backgroundColor: theme.colors.primary[500] }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建评估
          </button>
        </div>
      </Sidebar>
    </>
  );
};

// 底部导航栏组件
const BottomNavigation: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { state, navigateTo } = useNavigation();

  const navItems = [
    { id: 'dashboard', label: '主页', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'movement-selection', label: '评估', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { id: 'history', label: '历史', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'menu', label: '更多', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pb-safe-area z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = state.currentModule === item.id;
        return (
          <button
            key={item.id}
            onClick={() => item.id === 'menu' ? onMenuClick() : navigateTo(item.id)}
            className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ color: isActive ? theme.colors.primary[500] : undefined }}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <Header
        className="md:p-4 p-3 hidden md:flex"
        onMenuClick={() => setSidebarOpen(true)}
      >
        <div className="flex items-center gap-4">
          <LogoContainer>
            <Logo>Rehabhub</Logo>
            {title && <TitleComponent>{title}</TitleComponent>}
          </LogoContainer>
          <HeaderActions>
             {/* Desktop actions */}
          </HeaderActions>
        </div>
      </Header>

      {/* Mobile Header - Simplified */}
      <div className="md:hidden bg-white px-4 py-3 shadow-sm sticky top-0 z-30 flex items-center justify-center">
        <span className="font-bold text-lg text-gray-800">{title || 'Rehabhub'}</span>
      </div>
      
      <Navigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Main className="md:flex-row flex flex-col p-0 md:p-4 pb-20 md:pb-4 bg-gray-50">
        
        <div className="flex-1 px-4 py-4 md:p-0">
          <Content>{children}</Content>
        </div>

        <BottomNavigation onMenuClick={() => setSidebarOpen(true)} />
      </Main>
    </LayoutContainer>
  );
};

// 导出为命名导出和默认导出
export { Layout };
export default Layout;
