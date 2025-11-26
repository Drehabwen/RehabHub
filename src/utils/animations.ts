import { CSSProperties } from 'react';

// 医疗风格的动画效果
export const animations = {
  // 淡入动画
  fadeIn: (duration = '0.3s', delay = '0s'): CSSProperties => ({
    animation: `fadeIn ${duration} ease-out ${delay} forwards`,
    opacity: 0
  }),
  
  // 淡入并向上移动的动画
  fadeInUp: (duration = '0.4s', delay = '0s'): CSSProperties => ({
    animation: `fadeInUp ${duration} ease-out ${delay} forwards`,
    opacity: 0,
    transform: 'translateY(20px)'
  }),
  
  // 淡入并向下移动的动画
  fadeInDown: (duration = '0.4s', delay = '0s'): CSSProperties => ({
    animation: `fadeInDown ${duration} ease-out ${delay} forwards`,
    opacity: 0,
    transform: 'translateY(-20px)'
  }),
  
  // 淡入并向右移动的动画
  fadeInRight: (duration = '0.4s', delay = '0s'): CSSProperties => ({
    animation: `fadeInRight ${duration} ease-out ${delay} forwards`,
    opacity: 0,
    transform: 'translateX(-20px)'
  }),
  
  // 淡入并向左移动的动画
  fadeInLeft: (duration = '0.4s', delay = '0s'): CSSProperties => ({
    animation: `fadeInLeft ${duration} ease-out ${delay} forwards`,
    opacity: 0,
    transform: 'translateX(20px)'
  }),
  
  // 缩放动画
  scaleIn: (duration = '0.3s', delay = '0s'): CSSProperties => ({
    animation: `scaleIn ${duration} ease-out ${delay} forwards`,
    opacity: 0,
    transform: 'scale(0.95)'
  }),
  
  // 脉冲动画（用于按钮和交互元素）
  pulse: (duration = '2s', delay = '0s'): CSSProperties => ({
    animation: `pulse ${duration} ease-in-out ${delay} infinite`
  }),
  
  // 微妙的悬停效果
  subtleHover: {
    transform: 'translateZ(0)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // 卡片悬停效果
  cardHover: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform, box-shadow'
  },
  
  // 按钮悬停效果
  buttonHover: {
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // 平滑滚动
  smoothScroll: {
    scrollBehavior: 'smooth' as const
  }
};

// 动画关键帧样式字符串，用于注入到组件中
export const animationKeyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

// 组件进入视口时的动画钩子
export const useScrollAnimation = () => {
  // 此函数可以与Intersection Observer API结合使用
  // 这里提供基本的实现思路
  const animateOnScroll = (element: HTMLElement, animationType: keyof typeof animations) => {
    element.style.animation = `${animationType} 0.5s ease-out forwards`;
  };
  
  return { animateOnScroll };
};

// 生成错开的延迟动画，用于列表项或卡片组
export const staggerAnimations = (
  items: any[],
  animationType: keyof typeof animations,
  baseDelay = 0.1,
  maxDelay = 1
) => {
  return items.map((item, index) => {
    const delay = Math.min(baseDelay * index, maxDelay);
    // 检查动画类型是否为函数，如果是函数则调用它，否则直接使用
    const animationStyle = typeof animations[animationType] === 'function' 
      ? animations[animationType](undefined, `${delay}s`)
      : animations[animationType];
    
    return {
      ...item,
      animationStyle
    };
  });
};