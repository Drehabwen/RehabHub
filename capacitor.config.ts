import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rehabhub.app',
  appName: 'Rehabhub',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      resetWhenUpdate: false
    }
  }
};

export default config;
