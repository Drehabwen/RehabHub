
/**
 * 统一的导航工具函数
 * 用于解决前端跳转不一致的问题
 */

/**
 * 跳转到指定模块
 * @param module 要跳转到的模块名称
 */
export const navigateToModule = (module: string): void => {
  // 使用NavigationContext进行导航
  const event = new CustomEvent('navigateToModule', { detail: module });
  window.dispatchEvent(event);
};

/**
 * 返回上一页
 */
export const goBack = (): void => {
  // 使用NavigationContext进行返回操作
  const event = new CustomEvent('goBack');
  window.dispatchEvent(event);
};

/**
 * 跳转到首页
 */
export const goToHome = (): void => {
  navigateToModule('dashboard');
};

/**
 * 跳转到动作选择页面
 */
export const goToMovementSelection = (): void => {
  navigateToModule('movement-selection');
};

/**
 * 跳转到指定动作分析页面
 * @param movementId 动作ID
 */
export const goToMovementAnalysis = (movementId: string): void => {
  navigateToModule(movementId);
};

/**
 * 跳转到状态指示器示例页面
 */
export const goToStatusIndicatorExample = (): void => {
  navigateToModule('status-indicator-example');
};

/**
 * 跳转到组件测试页面
 */
export const goToComponentTest = (): void => {
  navigateToModule('component-test');
};

/**
 * 跳转到历史记录页面
 */
export const goToHistory = (): void => {
  navigateToModule('history');
};

/**
 * 跳转到患者管理页面
 */
export const goToPatients = (): void => {
  navigateToModule('patients');
};
