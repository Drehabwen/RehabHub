export const tokens = {
  colors: {
    background: {
      primary: '#F5F2EC',
      secondary: '#EFECE4',
      tertiary: '#e4f0ea',
      inverse: '#1A1A18',
    },
    text: {
      primary: '#1A1A18',
      secondary: '#5a5a50',
      muted: '#999999',
      inverse: '#FFFFFF',
    },
    accent: {
      primary: '#3D7A5C',
      soft: '#e4f0ea',
      mid: '#6aaa8c',
      light: '#9fcfb8',
    },
    tcm: {
      primary: '#8B4A2A',
      amber: '#C4813E',
    },
    status: {
      success: '#3D7A5C',
      warning: '#C5943B',
      error: '#C53B3B',
      info: '#2563eb',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.08)',
      default: 'rgba(0, 0, 0, 0.15)',
    },
  },
  typography: {
    fontFamily: {
      title: '"Noto Serif SC", "Songti SC", "STSong", serif',
      body: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      eyebrow: '"DM Sans", "Helvetica Neue", sans-serif',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    page: {
      marginX: '40px',
      marginTop: '60px',
    },
  },
  radius: {
    sm: '2px',
    default: '4px',
    md: '8px',
    full: '9999px',
  },
  borderWidth: {
    thin: '1px',
    accent: '3px',
  },
} as const;

export default tokens;
