/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主要色彩 - 康复医疗主题配色（降低饱和度，更加温和）
        primary: {
          DEFAULT: '#8faa9d', // 主绿灰色 - 用于品牌标识、主要按钮和重要元素
          light: '#a8c4b8',   // 浅绿灰色 - 用于渐变和次要元素
          soft: '#c8d6cc',    // 柔和绿灰色 - 用于背景和卡片
          white: '#fefefe',   // 温暖白色 - 卡片和容器背景
          gray: '#f7f9f7',    // 温暖灰色 - 页面背景渐变
        },
        // 文字色彩层级（更加柔和的对比度）
        text: {
          primary: '#445a4b', // 主要文字 - 深绿灰色调，确保良好的可读性
          secondary: '#5a6f61', // 次要文字 - 中等饱和度的绿灰色
          tertiary: '#7a8a7a',  // 浅色文字 - 用于辅助信息
        },
        // 状态色（降低饱和度）
        status: {
          success: '#8faa9d', // 绿灰色 - 优秀
          warning: '#e6c27a', // 柔和黄棕色 - 良好/需要关注
          danger: '#d49094',  // 柔和红棕色 - 需要改善
        },
        // 辅助色彩
        border: '#d0ddd5',    // 浅绿灰色边框
        // 保留原有emerald系列以兼容现有代码（更新为温和色调）
        emerald: {
          50: '#f0f5f2',
          100: '#e1ebe5',
          200: '#d0ddd5',
          300: '#b8c9be',
          400: '#a4b8ab',
          500: '#8faa9d', // 使用新的主色调
          600: '#7f9b8c',
          700: '#5a6f61', // 使用新的次要文字色
          800: '#445a4b',
          900: '#445a4b', // 使用新的主要文字色
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(143, 170, 157, 0.08)', // 带有绿色调柔和阴影
        'hover': '0 4px 20px rgba(143, 170, 157, 0.12)', // 带有绿色调柔和阴影
        'card': '0 4px 15px rgba(143, 170, 157, 0.06)', // 卡片阴影
      },
      transitionDelay: {
          '0': '0ms',
          '15': '15ms',
          '30': '30ms',
          '45': '45ms',
          '60': '60ms',
          '75': '75ms',
          '90': '90ms',
          '100': '100ms',
          '150': '150ms',
          '200': '200ms',
          '250': '250ms',
          '300': '300ms',
        }
    },
  },
  plugins: [],
}