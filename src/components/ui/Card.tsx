import React from 'react';
import { theme } from '../../theme';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
}

// Helper function to get shadow styles
const getShadowStyle = (elevation: 'low' | 'medium' | 'high') => {
  switch (elevation) {
    case 'low':
      return theme.shadows.default;
    case 'medium':
      return '0 8px 25px rgba(143, 170, 143, 0.12)';
    case 'high':
      return '0 12px 40px rgba(143, 170, 143, 0.18)';
    default:
      return theme.shadows.default;
  }
};

const Card: React.FC<CardProps> & {
  Header: React.FC<{ title?: string; description?: string; children?: React.ReactNode }>;
  Title: React.FC<{ children: React.ReactNode }>;
  Description: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ children, elevation = 'low', noPadding = false, className = '', ...props }) => {
  const styles: React.CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.borderColor}`,
    transition: `all ${theme.transitions.duration.normal} ${theme.transitions.timingFunction.easeInOut}`,
    boxShadow: getShadowStyle(elevation),
    padding: noPadding ? '0' : theme.spacing.lg,
  };

  return (
    <div 
      style={styles} 
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.hover;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = getShadowStyle(elevation);
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ title, description, children }) => {
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  };
  
  return (
    <div style={styles}>
      {title && <Card.Title>{title}</Card.Title>}
      {description && <Card.Description>{description}</Card.Description>}
      {children}
    </div>
  );
};

Card.Title = ({ children }) => {
  const styles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: 0,
  };
  
  return <h2 style={styles}>{children}</h2>;
};

Card.Description = ({ children }) => {
  const styles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    margin: 0,
    lineHeight: theme.typography.lineHeight.normal,
  };
  
  return <p style={styles}>{children}</p>;
};

Card.Content = ({ children }) => {
  const styles: React.CSSProperties = {
    marginBottom: theme.spacing.md,
  };
  
  return <div style={styles}>{children}</div>;
};

Card.Footer = ({ children }) => {
  const styles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
    marginTop: 'auto',
    paddingTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.borderColor}`,
  };
  
  return <div style={styles}>{children}</div>;
};

export default Card;