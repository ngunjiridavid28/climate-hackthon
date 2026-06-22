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
    const helpId = props.id ? `${props.id}-help` : undefined;
    const errorId = props.id ? `${props.id}-error` : undefined;
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
            {props.required && <span aria-label="required" className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-foreground-muted flex items-center justify-center h-full pointer-events-none" aria-hidden="true">
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
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helpText ? helpId : undefined}
            {...props}
          />
          
          {rightIcon && (
            <span className="absolute right-3 text-foreground-muted flex items-center justify-center h-full pointer-events-none" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-error" id={errorId} role="alert">{error}</p>}
        {helpText && !error && <p className="text-xs text-foreground-muted" id={helpId}>{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
