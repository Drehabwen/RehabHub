import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { App } from '@capacitor/app';

// 版本信息接口
export interface VersionInfo {
  version: string;
  url: string;
  note?: string;
  force?: boolean;
}

// 默认的更新服务器地址 (请替换为您实际的服务器地址)
// 例如: https://api.yourdomain.com/update/version.json
// 或者使用 GitHub Pages: https://username.github.io/repo/version.json
const UPDATE_URL = 'http://localhost:8000/updates/version.json';

class UpdaterService {
  // 检查更新
  async checkForUpdate(): Promise<{ hasUpdate: boolean; version?: VersionInfo }> {
    try {
      console.log('正在检查更新...', UPDATE_URL);
      
      // 1. 获取服务器上的版本信息
      const response = await fetch(UPDATE_URL);
      if (!response.ok) {
        throw new Error('无法连接到更新服务器');
      }
      
      const remoteVersion: VersionInfo = await response.json();
      console.log('服务器版本:', remoteVersion);

      // 2. 获取当前应用版本
      const appInfo = await App.getInfo();
      const currentVersion = appInfo.version; // 例如 "1.0.0"
      console.log('当前版本:', currentVersion);

      // 3. 比较版本 (简单的字符串比较，实际可能需要 semver 库)
      if (this.compareVersions(remoteVersion.version, currentVersion) > 0) {
        return { hasUpdate: true, version: remoteVersion };
      }

      return { hasUpdate: false };
    } catch (error) {
      console.error('检查更新失败:', error);
      return { hasUpdate: false };
    }
  }

  // 执行更新
  async performUpdate(versionInfo: VersionInfo, _onProgress?: (percent: number) => void): Promise<void> {
    try {
      console.log('开始下载更新:', versionInfo.url);
      
      const version = await CapacitorUpdater.download({
        url: versionInfo.url,
        version: versionInfo.version,
      });
      
      console.log('下载完成，准备安装:', version);
      
      // 设置为下一次启动时激活
      await CapacitorUpdater.set(version);
      
      console.log('更新已就绪，将在下次启动时生效');
      
      // 如果需要立即生效 (会重启 APP)
      // await CapacitorUpdater.reload(); 
    } catch (error) {
      console.error('更新失败:', error);
      throw error;
    }
  }

  // 简单的版本号比较函数 (v1 > v2 返回 1, v1 < v2 返回 -1, 相等返回 0)
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    
    return 0;
  }
}

export const updaterService = new UpdaterService();
