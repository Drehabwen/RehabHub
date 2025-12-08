import React, { useState, useEffect, ReactNode } from 'react';
import { colors, typography } from '../theme';

interface HelpStep {
  id: string;
  title: string;
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface HelpGuideProps {
  steps: HelpStep[];
  targetRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
}

const HelpGuide: React.FC<HelpGuideProps> = ({ steps, targetRef, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

  useEffect(() => {
    if (!isOpen || !targetRef.current) return;

    // 重置步骤
    setCurrentStep(0);

    // 计算位置
    const rect = targetRef.current.getBoundingClientRect();
    
    // 根据视口位置自动选择最佳放置位置
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // 默认位置在底部
    let bestPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    
    // 检查是否有足够空间在底部
    if (rect.bottom + 200 > viewportHeight) {
      // 如果底部空间不足，检查顶部
      if (rect.top > 200) {
        bestPlacement = 'top';
      } else if (rect.right + 300 <= viewportWidth) {
        // 如果右侧有足够空间
        bestPlacement = 'right';
      } else {
        // 最后选择左侧
        bestPlacement = 'left';
      }
    }
    
    setPlacement(bestPlacement);
    
    // 设置位置
    const newPosition = {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
      right: viewportWidth - rect.right + window.pageXOffset,
      bottom: viewportHeight - rect.bottom + window.pageYOffset
    };
    
    setPosition(newPosition);
  }, [isOpen, targetRef]);

  if (!isOpen) return null;

  const currentHelpStep = steps[currentStep];
  const stepPlacement = currentHelpStep.placement || placement;

  const getStyles = () => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1001,
      width: '320px',
      maxWidth: '90vw',
      backgroundColor: colors.background.default,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: `1px solid ${colors.neutral[300]}`,

      fontFamily: typography.fontFamily,
      transform: 'translateZ(0)',
      animation: 'fadeIn 0.3s ease-out',
      willChange: 'opacity, transform'
    };

    // 根据位置设置具体样式
    switch (stepPlacement) {
      case 'bottom':
        styles.top = `${position.top + 40}px`;
        styles.left = `${position.left}px`;
        break;
      case 'top':
        styles.bottom = `${position.bottom + 40}px`;
        styles.left = `${position.left}px`;
        break;
      case 'right':
        styles.top = `${position.top}px`;
        styles.left = `${position.left + 40}px`;
        break;
      case 'left':
        styles.top = `${position.top}px`;
        styles.right = `${position.right + 40}px`;
        break;
    }

    return styles;
  };

  const getArrowStyles = () => {
    const arrowStyles: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderWidth: '8px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      willChange: 'opacity, transform'
    };

    // 根据位置设置箭头
    switch (stepPlacement) {
      case 'bottom':
        arrowStyles.top = '-16px';
        arrowStyles.left = '16px';
        arrowStyles.borderBottomColor = colors.background.default;
        break;
      case 'top':
        arrowStyles.bottom = '-16px';
        arrowStyles.left = '16px';
        arrowStyles.borderTopColor = colors.background.default;
        break;
      case 'right':
        arrowStyles.top = '16px';
        arrowStyles.left = '-16px';
        arrowStyles.borderRightColor = colors.background.default;
        break;
      case 'left':
        arrowStyles.top = '16px';
        arrowStyles.right = '-16px';
        arrowStyles.borderLeftColor = colors.background.default;
        break;
    }

    return arrowStyles;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="help-guide-backdrop" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div 
        className="help-guide-tooltip"
        style={getStyles()}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={getArrowStyles()} />
        
        {/* 标题区域 */}
        <div className="help-guide-header" style={{
          padding: '16px',
          borderBottom: `1px solid ${colors.borderColor}`,

          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: typography.fontWeight.semibold,
            color: colors.primary[800]
          }}>
            {currentHelpStep.title}
          </h3>
          
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.secondary
            }}
            aria-label="关闭"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* 内容区域 */}
        <div className="help-guide-content" style={{
          padding: '16px',
          lineHeight: 1.5,
          color: colors.textSecondary
        }}>
          {currentHelpStep.content}
        </div>
        
        {/* 步骤指示器 */}
        <div style={{
          padding: '0 16px 12px',
          display: 'flex',
          justifyContent: 'center',
          gap: '4px'
        }}>
          {steps.map((_, index) => (
            <div 
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentStep ? colors.primary[500] : colors.borderColor,

                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
        </div>
        
        {/* 按钮区域 */}
        <div className="help-guide-footer" style={{
          padding: '16px',
          borderTop: `1px solid ${colors.borderColor}`,

          display: 'flex',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              style={{
                padding: '8px 16px',
                border: `1px solid ${colors.borderColor}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: colors.text.primary,

                fontSize: '14px',
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1
              }}
            >
              上一步
            </button>
          )}
          
          <button
            onClick={handleNext}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: colors.primary[600],
              color: 'white',
              fontSize: '14px',
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flex: currentStep > 0 ? 1 : 'auto',
              minWidth: '80px'
            }}
          >
            {currentStep < steps.length - 1 ? '下一步' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;

// 操作提示组件 - 简单的非模态提示
interface TooltipHintProps {
  title: string;
  content: string;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipHint: React.FC<TooltipHintProps> = ({ 
  title, 
  content, 
  children, 
  placement = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const hintRef = React.useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={hintRef}
      className="tooltip-container"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: colors.background.default,
            border: `1px solid ${colors.neutral[300]}`,

            borderRadius: '6px',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            minWidth: '200px',
            [placement]: '100%',
            [placement === 'top' ? 'bottom' : 'top']: placement === 'top' ? '100%' : '-100%',
            left: '50%',
            transform: 'translateX(-50%)',
            ...(placement === 'top' && { bottom: '100%' }),
            ...(placement === 'bottom' && { top: '100%' }),
            ...(placement === 'left' && { right: '100%', top: '50%', transform: 'translateY(-50%)' }),
            ...(placement === 'right' && { left: '100%', top: '50%', transform: 'translateY(-50%)' }),
            fontFamily: typography.fontFamily,
            fontSize: '14px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {title && (
            <div style={{
              fontWeight: typography.fontWeight.semibold,
              marginBottom: '4px',
              color: colors.primary[800]
            }}>
              {title}
            </div>
          )}
          <div style={{ color: colors.textSecondary, lineHeight: 1.4 }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};