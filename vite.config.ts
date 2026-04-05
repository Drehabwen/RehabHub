import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(({ mode }) => {
  const isPlugin = mode === 'plugin'
  console.log('Build mode:', mode, 'isPlugin:', isPlugin)

  return {
    plugins: [
      react(),
      isPlugin && cssInjectedByJsPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom']
    },
    build: isPlugin ? {
      lib: {
        entry: path.resolve(__dirname, 'src/plugin-entry.tsx'),
        name: 'RehabHub',
        formats: ['umd', 'es'],
        fileName: (format) => `rehab-hub-plugin.${format}.js`,
      },
      rollupOptions: {
        // 插件模式下通常不需要把 react 打包进去，由宿主提供，但为了方便插入，我们默认打包进去
        // 如果宿主也有 react，可以考虑 external
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      },
      outDir: 'dist-plugin',
    } : {
      outDir: 'dist',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts']
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: {
        overlay: true,
        clientPort: 3000
      }
    }
  }
})
