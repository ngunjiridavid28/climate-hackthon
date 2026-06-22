import React from 'react';
import { cn } from '../../lib/utils.js';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary/20 text-primary border border-primary/30',
      secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
      success: 'bg-success/20 text-success border border-success/30',
      warning: 'bg-warning/20 text-warning border border-warning/30',
      error: 'bg-error/20 text-error border border-error/30',
      info: 'bg-info/20 text-info border border-info/30',
      outline: 'bg-transparent border border-border-light text-foreground'
    };

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
