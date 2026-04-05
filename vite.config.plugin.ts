import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/plugin-entry.tsx'),
      name: 'RehabHub',
      formats: ['umd', 'es'],
      fileName: (format) => `rehab-hub-plugin.${format}.js`,
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: 'dist-plugin',
    emptyOutDir: true,
  }
})
