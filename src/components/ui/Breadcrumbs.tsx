import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors, typography } from '../../theme';

// 定义面包屑项的类型
interface BreadcrumbItem {
  path: string;
  label: string;
}

interface BreadcrumbProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const { getBreadcrumbs, navigateTo } = useNavigation();
  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="面包屑导航">
      {breadcrumbs.map((breadcrumb: BreadcrumbItem, index: number) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={breadcrumb.path}>
            {index > 0 && (
              <span 
                className="mx-2 text-gray-400" 
                style={{ color: colors.text.secondary }}
              >
                /
              </span>
            )}
            
            {isLast ? (
              <span 
                className="font-medium"
                style={{ 
                  color: colors.text.primary,
                  fontWeight: typography.fontWeight.medium
                }}
              >
                {breadcrumb.label}
              </span>
            ) : (
              <button
                className="hover:underline transition-colors duration-200"
                style={{ 
                  color: colors.primary[600]
                }}
                onClick={() => navigateTo(breadcrumb.path)}
              >
                {breadcrumb.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;