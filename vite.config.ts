import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.wasm')) {
            return 'assets/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
      maxParallelFileOps: 4,
      treeshake: false
    },
    minify: false,
    sourcemap: false
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs-backend-wasm']
  },
  assetsInclude: ['**/*.wasm']
});