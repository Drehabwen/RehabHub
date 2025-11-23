import React from 'react';
// 使用require代替import以避免TypeScript模块解析问题
const styles: any = require('./Button.module.css');
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      event.preventDefault();
      onClick();
    }
  };

  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    disabled ? styles['button--disabled'] : '',
    loading ? styles['button--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const iconClasses = [
    styles.button__icon,
    styles[`button__icon--${iconPosition}`],
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
    >
      {loading && (
        <div className={styles.loadingSpinner} aria-label="加载中" />
      )}
      
      {!loading && icon && (
        <span className={iconClasses}>{icon}</span>
      )}
      
      <span className={styles.button__text}>{children}</span>
    </button>
  );
};

export default Button;