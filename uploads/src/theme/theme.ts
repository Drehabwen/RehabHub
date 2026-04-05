// 主题配置文件 - 康复评估平台UI设计规范

// 主色调系统（降低饱和度，更加温和）
export const colors = {
  // 品牌主色
  primary: '#8faa9d', // 深绿灰色 - 用于重要按钮、链接、标题等核心元素
  primaryLight: '#a8c4b8', // 中绿灰 - 用于次要按钮、图标、悬停状态
  primaryLighter: '#c8d6cc', // 浅绿灰 - 用于背景色块、禁用状态等
  
  // 背景色
  backgroundPrimary: '#fefefe', // 暖白 - 页面主体背景
  backgroundSecondary: '#f7f9f7', // 暖灰 - 卡片、模块背景
  
  // 文本颜色（更加柔和的对比度）
  textPrimary: '#445a4b', // 深绿灰色 - 标题、重要内容
  textSecondary: '#5a6f61', // 中绿灰 - 正文、说明文字
  textLight: '#7a8a7a', // 浅灰 - 提示、辅助信息
  
  // 边框和阴影
  borderColor: '#d0ddd5', // 浅灰绿 - 分隔线、边框
};

// 阴影样式（使用更柔和的颜色）
export const shadows = {
  default: '0 4px 20px rgba(143, 170, 157, 0.08)', // 常规状态
  hover: '0 8px 30px rgba(143, 170, 157, 0.12)', // 悬停状态
};

// 圆角尺寸
export const borderRadius = {
  small: '6px',
  medium: '12px',
  large: '20px',
  full: '9999px',
};

// 间距系统
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// 字体系统
export const typography = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.8',
  },
};

// 动画配置
export const animations = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.2, 0, 0, 1)',
  },
};

// 主题对象
export const theme = {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
  animations,
};

export type ThemeType = typeof theme;

export default theme;