import React from 'react';
import { cn } from '@/lib/utils';
import { tokens } from '@/constants/design-tokens';

interface TgProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
}

export const Tg: React.FC<TgProps> = ({ active = false, className, children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs',
        active ? 'text-white' : 'text-slate-700',
        className
      )}
      style={{ backgroundColor: active ? tokens.colors.accent.primary : tokens.colors.background.tertiary }}
      {...props}
    >
      {children}
    </span>
  );
};
