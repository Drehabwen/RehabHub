import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  // 从URL哈希初始化当前模块
  const initialModule = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return hash.slice(2);
    }
    return 'dashboard';
  };

  const [state, setState] = useState<NavigationState>({
    currentModule: initialModule(),
    previousModule: null,
    navigationHistory: [initialModule()],
    isTransitioning: false
  });

  // 监听来自navigation.ts的导航事件
  useEffect(() => {
    const handleNavigateToModule = (event: CustomEvent) => {
      const module = event.detail;
      navigateTo(module);
    };

    const handleGoBack = () => {
      goBack();
    };

    window.addEventListener('navigateToModule', handleNavigateToModule as EventListener);
    window.addEventListener('goBack', handleGoBack);

    return () => {
      window.removeEventListener('navigateToModule', handleNavigateToModule as EventListener);
      window.removeEventListener('goBack', handleGoBack);
    };
  }, []);

  // 监听URL哈希变化，这是导航的单一事实来源（Source of Truth）
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
        const module = hash.slice(2);
        
        // 如果模块没有变化，忽略
        if (module === state.currentModule) {
          return;
        }

        console.log('🔄 Hash changed to:', module);

        // 检测是否是后退操作
        // 逻辑：如果新模块等于历史记录中的倒数第二个，我们假设它是后退
        // 注意：这在 A -> B -> A 的情况下会误判为后退，但在层级导航中通常是可以接受的
        const isBack = state.navigationHistory.length > 1 && 
                       state.navigationHistory[state.navigationHistory.length - 2] === module;

        let newHistory;
        if (isBack) {
          // 后退：移除最后一个历史记录
          newHistory = state.navigationHistory.slice(0, -1);
          console.log('🔙 Detected back navigation');
        } else {
          // 前进/新页面：添加到历史记录
          // 防止重复添加（如果连续点击）
          if (state.navigationHistory[state.navigationHistory.length - 1] !== module) {
            newHistory = [...state.navigationHistory, module];
          } else {
            newHistory = state.navigationHistory;
          }
          console.log('➡️ Detected forward navigation');
        }

        setState(prevState => ({
          ...prevState,
          currentModule: module,
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
      }
    };

    // 添加哈希变化事件监听器
    window.addEventListener('hashchange', handleHashChange);

    // 清理事件监听器
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [state.currentModule, state.navigationHistory]);

  const navigateTo = (module: string, params?: Record<string, any>) => {
    console.log('� navigateTo called with module:', module);
    if (module === state.currentModule) {
      console.log('⚠️  Same module, skipping navigation');
      return;
    }

    // 存储参数（如果有）
    if (params) {
      sessionStorage.setItem(`nav_params_${module}`, JSON.stringify(params));
      console.log('💾 Stored params for module', module);
    }

    // 只更新 URL hash，让 hashchange 事件处理剩下的事情
    // 这确保了浏览器历史记录与应用状态的一致性
    window.location.hash = `/${module}`;
  };

  const goBack = () => {
    // 使用浏览器原生后退
    // 这会触发 hashchange 事件，从而更新应用状态
    if (state.navigationHistory.length > 1) {
      console.log('⬅️ goBack called, using history.back()');
      window.history.back();
    } else {
      console.log('⚠️ No history to go back to');
      // 可选：如果没有历史记录，可能跳转到仪表盘？
      // navigateTo('dashboard');
    }
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