import React from 'react';
import { cn } from '../../lib/utils.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'button-base font-medium transition-all duration-200';
    
    const variantStyles = {
      primary: 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg',
      secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-md hover:shadow-lg',
      outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-foreground hover:bg-surface-alt',
      danger: 'bg-error hover:bg-red-600 text-white'
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          {leftIcon && !isLoading && <span aria-hidden="true">{leftIcon}</span>}
          {isLoading && (
            <svg 
              className="animate-spin h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {children}
          {rightIcon && !isLoading && <span aria-hidden="true">{rightIcon}</span>}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
