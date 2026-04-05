// 医疗主题配置文件
// 定义统一的颜色、字体和样式变量，确保整个应用的UI风格一致性

// 色彩系统 - 医疗专业风格
export const colors = {
  // 主色调 - 医疗蓝系列
  primary: {
    50: '#E3F2FD',    // 极浅蓝，用于背景
    100: '#BBDEFB',   // 浅蓝色，用于边框
    200: '#90CAF9',   // 亮蓝色，用于次要元素
    300: '#64B5F6',   // 中蓝色，用于交互元素
    400: '#42A5F5',   // 中深蓝色，用于悬停状态
    500: '#1E88E5',   // 主蓝色，用于主要按钮、强调
    600: '#1976D2',   // 深蓝色，用于重要元素
    700: '#1565C0',   // 暗蓝色，用于标题
    800: '#0D47A1',   // 更深蓝色，用于标题
    900: '#0B3954',   // 几乎黑色的蓝色，用于最深色文本
  },
  
  // 辅助色 - 用于状态和指示
  secondary: {
    50: '#E8F5E9',    // 浅绿色，用于背景
    500: '#43A047',   // 绿色，用于成功状态
  },
  
  // 状态色
  success: {
    50: '#E8F5E9',    // 浅绿背景
    500: '#4CAF50',   // 绿色，用于成功状态
    700: '#388E3C',   // 深绿色，用于重要成功状态
  },
  
  warning: {
    50: '#FFF8E1',    // 浅黄色背景
    500: '#FB8C00',   // 橙黄色，用于警告状态
    700: '#F57C00',   // 深橙色，用于重要警告状态
  },
  
  error: {
    50: '#FFEBEE',    // 浅红色背景
    500: '#E53935',   // 红色，用于错误状态
    700: '#C62828',   // 深红色，用于重要错误状态
  },
  
  // 中性色 - 用于文本和背景
  neutral: {
    50: '#FAFAFA',    // 接近白色的灰色，用于背景
    100: '#F5F5F5',   // 浅灰色，用于次要背景
    200: '#EEEEEE',   // 浅灰色，用于分隔线
    300: '#E0E0E0',   // 中灰色，用于边框
    400: '#BDBDBD',   // 中灰色，用于禁用状态
    500: '#9E9E9E',   // 中灰色，用于次要文本
    600: '#757575',   // 深灰色，用于常规文本
    700: '#616161',   // 深灰色，用于强调文本
    800: '#424242',   // 更深灰色，用于标题
    900: '#212121',   // 接近黑色的灰色，用于最深色文本
  },
  
  // 背景色
  background: {
    default: '#F5F9FF', // 非常浅的蓝色作为默认背景
    paper: '#FFFFFF',   // 白色用于卡片和面板
  },
  
  // 文本色
  text: {
    primary: '#212121',   // 主要文本
    secondary: '#616161', // 次要文本
    disabled: '#BDBDBD',  // 禁用文本
    hint: '#9E9E9E',      // 提示文本
    inverse: '#FFFFFF',   // 反色文本（深色背景上的白色文本）
  },
};

// 间距系统
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 边框半径
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999, // 全圆角
};

// 阴影系统
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  hover: '0 15px 30px rgba(0, 0, 0, 0.1)',
};

// 字体系统
export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// 动画过渡
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  timingFunction: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// 组件样式
export const components = {
  button: {
    // 主按钮样式
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.text.inverse,
      hoverBackgroundColor: colors.primary[600],
      focusBackgroundColor: colors.primary[700],
      borderColor: colors.primary[500],
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.semibold,
      boxShadow: shadows.sm,
    },
    // 次要按钮样式
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      hoverBackgroundColor: colors.primary[50],
      borderColor: colors.primary[300],
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
    },
    // 成功按钮样式
    success: {
      backgroundColor: colors.success[500],
      color: colors.text.inverse,
      hoverBackgroundColor: colors.success[700],
      borderColor: colors.success[500],
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.semibold,
    },
    // 警告按钮样式
    warning: {
      backgroundColor: colors.warning[500],
      color: colors.text.inverse,
      hoverBackgroundColor: colors.warning[700],
      borderColor: colors.warning[500],
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.semibold,
    },
    // 错误按钮样式
    error: {
      backgroundColor: colors.error[500],
      color: colors.text.inverse,
      hoverBackgroundColor: colors.error[700],
      borderColor: colors.error[500],
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.semibold,
    },
  },
  // 卡片样式
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    border: `1px solid ${colors.primary[100]}`,
    padding: spacing.md,
    transition: `box-shadow ${transitions.duration.normal} ${transitions.timingFunction.easeInOut}`,
    hoverBoxShadow: shadows.lg,
  },
  // 输入框样式
  input: {
    backgroundColor: colors.background.paper,
    borderColor: colors.primary[200],
    borderRadius: borderRadius.md,
    color: colors.text.primary,
    focusBorderColor: colors.primary[500],
    focusBoxShadow: `0 0 0 3px rgba(30, 136, 229, 0.1)`,
  },
  // 标签页样式
  tab: {
    activeBackground: colors.background.paper,
    activeColor: colors.primary[600],
    inactiveColor: colors.text.secondary,
    hoverBackground: colors.primary[50],
  },
};

// 评分级别颜色和文字
export const scoreLevel = {
  excellent: {
    min: 90,
    color: colors.success[500],
    text: '优秀',
    bgColor: colors.success[50],
    textColor: colors.success[700],
  },
  good: {
    min: 80,
    color: colors.success[500],
    text: '良好',
    bgColor: colors.success[50],
    textColor: colors.success[700],
  },
  acceptable: {
    min: 60,
    color: colors.warning[500],
    text: '可接受',
    bgColor: colors.warning[50],
    textColor: colors.warning[700],
  },
  needsImprovement: {
    min: 0,
    color: colors.error[500],
    text: '需改进',
    bgColor: colors.error[50],
    textColor: colors.error[700],
  },
};

// 导出完整的主题配置
export const MedicalTheme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  transitions,
  components,
  scoreLevel,
};

// 导出获取评分级别的工具函数
export const getScoreLevel = (score: number) => {
  if (score >= scoreLevel.excellent.min) return scoreLevel.excellent;
  if (score >= scoreLevel.good.min) return scoreLevel.good;
  if (score >= scoreLevel.acceptable.min) return scoreLevel.acceptable;
  return scoreLevel.needsImprovement;
};

// 导出主背景渐变
export const backgroundGradient = {
  primary: 'bg-gradient-to-r from-green-50 to-green-100',
  secondary: 'bg-gradient-to-r from-green-100 to-green-200',
};

export default MedicalTheme;