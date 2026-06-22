import React from 'react';
import { cn } from '../../lib/utils.js';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, leftIcon, rightIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-foreground-muted flex items-center justify-center h-full">
              {leftIcon}
            </span>
          )}
          
          <input
            type={type}
            ref={ref}
            className={cn(
              'input-base',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error focus-visible:ring-error',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <span className="absolute right-3 text-foreground-muted flex items-center justify-center h-full">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-error">{error}</p>}
        {helpText && !error && <p className="text-xs text-foreground-muted">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
