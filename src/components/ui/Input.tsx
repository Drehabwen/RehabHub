import React, { useState } from 'react';
import { theme } from '../../theme/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  customSize?: 'small' | 'medium' | 'large';
}

const Input: React.FC<InputProps> = ({
  error = false,
  fullWidth = false,
  label,
  helperText,
  customSize = 'medium',
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine size-specific styles
  const getSizeStyles = () => {
    switch (customSize) {
      case 'small':
        return {
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: theme.typography.fontSize.sm,
          minHeight: '40px'
        };
      case 'large':
        return {
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          fontSize: theme.typography.fontSize.lg,
          minHeight: '56px'
        };
      case 'medium':
      default:
        return {
          padding: `${theme.spacing.md} ${theme.spacing.md}`,
          fontSize: theme.typography.fontSize.md,
          minHeight: '48px'
        };
    }
  };

  const sizeStyles = getSizeStyles();
  
  // Determine border color based on state
  const getBorderColor = () => {
    if (disabled) return theme.colors.borderColor;
    if (error) return '#e57373';
    if (isFocused) return theme.colors.primary;
    if (isFocused && error) return '#e57373';
    return theme.colors.borderColor;
  };

  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: fullWidth ? '100%' : 'auto'
  };

  const labelStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary
  };

  const inputStyles: React.CSSProperties = {
    padding: sizeStyles.padding,
    border: `2px solid ${getBorderColor()}`,
    borderRadius: theme.borderRadius.medium,
    fontFamily: theme.typography.fontFamily,
    fontSize: sizeStyles.fontSize,
    color: theme.colors.textPrimary,
    backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.backgroundPrimary,
    transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.easeInOut}`,
    outline: 'none',
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    minHeight: sizeStyles.minHeight,
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    touchAction: 'manipulation',
    userSelect: 'none'
  };

  const helperTextStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.xs,
    color: error ? '#e57373' : theme.colors.textLight,
    margin: 0,
    lineHeight: theme.typography.lineHeight.normal
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (!disabled) {
      e.currentTarget.style.borderColor = error ? '#e57373' : theme.colors.primary;
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(143, 170, 143, 0.2)';
    }
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (!disabled) {
      e.currentTarget.style.borderColor = error ? '#e57373' : theme.colors.borderColor;
      e.currentTarget.style.boxShadow = 'none';
    }
    if (props.onBlur) props.onBlur(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!disabled && !isFocused && !error) {
      e.currentTarget.style.borderColor = theme.colors.primaryLight;
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!disabled && !isFocused && !error) {
      e.currentTarget.style.borderColor = theme.colors.borderColor;
    }
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <div style={wrapperStyles}>
      {label && (
        <label htmlFor={props.id} style={labelStyles}>
          {label}
        </label>
      )}
      <input
        style={inputStyles}
        id={props.id}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        placeholder={props.placeholder}
        {...props}
      />
      {helperText && (
        <p style={helperTextStyles}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;