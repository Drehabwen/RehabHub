import React, { useState, useEffect } from 'react';
import { colors } from '../theme';

/**
 * 移动端调试工具栏
 * 用于在桌面浏览器中模拟移动端视口和交互
 */
const MobileDebugToolbar: React.FC = () => {
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (isMobileMode) {
      // 模拟移动端视口
      const meta = document.querySelector('meta[name=viewport]');
      if (meta) {
        meta.setAttribute('content', 'width=375, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      document.body.style.maxWidth = '375px';
      document.body.style.margin = '0 auto';
      document.body.style.borderLeft = '1px solid #ccc';
      document.body.style.borderRight = '1px solid #ccc';
      document.body.style.minHeight = '100vh';
    } else {
      const meta = document.querySelector('meta[name=viewport]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      document.body.style.maxWidth = '100%';
      document.body.style.margin = '0';
      document.body.style.borderLeft = 'none';
      document.body.style.borderRight = 'none';
    }
  }, [isMobileMode]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        backgroundColor: colors.primary[800],
        color: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
        📱 移动端调试
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>尺寸:</span>
        <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
          {screenSize.width} × {screenSize.height}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>模式:</span>
        <span style={{ 
          backgroundColor: isMobileMode ? '#4CAF50' : '#FF9800',
          padding: '2px 8px', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {isMobileMode ? '📱 手机' : '💻 桌面'}
        </span>
      </div>

      <button
        onClick={() => setIsMobileMode(!isMobileMode)}
        style={{
          backgroundColor: isMobileMode ? '#FF9800' : '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginTop: '4px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isMobileMode ? '🔄 切换到桌面模式' : '📱 切换到手机模式'}
      </button>

      {isMobileMode && (
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid rgba(255,255,255,0.3)',
          fontSize: '11px',
          opacity: 0.9
        }}>
          <div>💡 提示：此模式会限制宽度为 375px</div>
          <div>模拟 iPhone 12/13/14 尺寸</div>
        </div>
      )}
    </div>
  );
};

export default MobileDebugToolbar;
