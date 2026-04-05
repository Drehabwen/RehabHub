// Capacitor 插件服务
import { Plugins } from '@capacitor/core';

// 获取 PermissionHelper 插件引用
const { PermissionHelper } = Plugins;

/**
 * 权限辅助服务类，封装 Capacitor PermissionHelper 插件的调用
 */
export class PermissionHelperService {
  /**
   * 打开应用设置页面
   * @returns Promise<void>
   */
  static async openAppSettings(): Promise<void> {
    try {
      await PermissionHelper.openAppSettings();
      console.log('成功打开应用设置');
    } catch (error) {
      console.error('打开应用设置失败:', error);
      throw new Error(`打开应用设置失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 导出工具函数以便直接使用
export const openAppSettings = PermissionHelperService.openAppSettings;
