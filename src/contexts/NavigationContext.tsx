import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义导航状态类型
interface NavigationState {
  currentModule: string;
  previousModule: string | null;
  navigationHistory: string[];
  isTransitioning: boolean;
}

// 定义导航上下文类型
interface NavigationContextType {
  state: NavigationState;
  navigateTo: (module: string, params?: Record<string, any>) => void;
  goBack: () => void;
  resetNavigation: () => void;
  getBreadcrumbs: () => Array<{ label: string; path: string }>;
}

// 创建导航上下文
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// 定义模块映射
const moduleMap: Record<string, { label: string; parent?: string }> = {
  'dashboard': { label: '仪表盘' },
  'movement-selection': { label: '动作选择', parent: 'dashboard' },
  'video-analysis': { label: '视频分析', parent: 'movement-selection' },
  'deep-squat': { label: '深蹲分析', parent: 'video-analysis' },
  'hurdle-step': { label: '跨步分析', parent: 'video-analysis' },
  'inline-lunge': { label: '弓步分析', parent: 'video-analysis' },
  'shoulder-mobility': { label: '肩部活动度分析', parent: 'video-analysis' },
  'active-straight-leg-raise': { label: '直腿抬高分析', parent: 'video-analysis' },
  'trunk-stability-pushup': { label: '躯干稳定性俯卧撑分析', parent: 'video-analysis' },
  'rotary-stability': { label: '旋转稳定性分析', parent: 'video-analysis' },
  'history': { label: '历史记录', parent: 'dashboard' },
  'statistics': { label: '统计数据', parent: 'dashboard' },
  'patients': { label: '患者管理', parent: 'dashboard' },
  'settings': { label: '设置', parent: 'dashboard' }
};

// 导航提供者组件
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>({
    currentModule: 'dashboard',
    previousModule: null,
    navigationHistory: ['dashboard'],
    isTransitioning: false
  });

  const navigateTo = (module: string, params?: Record<string, any>) => {
    if (module === state.currentModule) return;

    setState(prevState => ({
      ...prevState,
      currentModule: module,
      previousModule: prevState.currentModule,
      navigationHistory: [...prevState.navigationHistory, module],
      isTransitioning: true
    }));

    // 存储参数（如果有）
    if (params) {
      sessionStorage.setItem(`nav_params_${module}`, JSON.stringify(params));
    }

    // 重置过渡状态
    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isTransitioning: false
      }));
    }, 300);
  };

  const goBack = () => {
    if (state.navigationHistory.length <= 1) return;

    const newHistory = [...state.navigationHistory];
    newHistory.pop(); // 移除当前模块
    const previousModule = newHistory[newHistory.length - 1];

    setState(prevState => ({
      ...prevState,
      currentModule: previousModule,
      previousModule: prevState.currentModule,
      navigationHistory: newHistory,
      isTransitioning: true
    }));

    // 重置过渡状态
    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isTransitioning: false
      }));
    }, 300);
  };

  const resetNavigation = () => {
    setState({
      currentModule: 'dashboard',
      previousModule: null,
      navigationHistory: ['dashboard'],
      isTransitioning: false
    });
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; path: string }> = [];
    const currentModuleInfo = moduleMap[state.currentModule];
    
    if (!currentModuleInfo) return breadcrumbs;

    // 构建面包屑路径
    let currentPath = state.currentModule;
    breadcrumbs.push({ label: currentModuleInfo.label, path: currentPath });

    // 添加父级路径
    let parentModule = currentModuleInfo.parent;
    while (parentModule) {
      const parentInfo = moduleMap[parentModule];
      if (!parentInfo) break;
      
      breadcrumbs.unshift({ label: parentInfo.label, path: parentModule });
      parentModule = parentInfo.parent;
    }

    return breadcrumbs;
  };

  const value: NavigationContextType = {
    state,
    navigateTo,
    goBack,
    resetNavigation,
    getBreadcrumbs
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// 自定义Hook用于使用导航上下文
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// 导航参数Hook
export const useNavigationParams = <T = Record<string, any>>() => {
  const { state } = useNavigation();
  
  const getParams = (): T | null => {
    const paramsStr = sessionStorage.getItem(`nav_params_${state.currentModule}`);
    return paramsStr ? JSON.parse(paramsStr) : null;
  };

  const clearParams = () => {
    sessionStorage.removeItem(`nav_params_${state.currentModule}`);
  };

  return { getParams, clearParams };
};

export default NavigationContext;