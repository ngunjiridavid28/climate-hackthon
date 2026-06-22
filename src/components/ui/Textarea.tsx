import React from 'react';
import { cn } from '../../lib/utils.js';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    helpText, 
    maxLength,
    showCharCount = false,
    value,
    ...props 
  }, ref) => {
    const charCount = value ? String(value).length : 0;
    const charPercentage = maxLength ? (charCount / maxLength) * 100 : 0;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'input-base min-h-[100px] resize-none',
            error && 'border-error focus-visible:ring-error',
            className
          )}
          {...props}
        />

        <div className="flex justify-between items-center">
          <div>
            {error && <p className="text-xs text-error">{error}</p>}
            {helpText && !error && <p className="text-xs text-foreground-muted">{helpText}</p>}
          </div>
          
          {showCharCount && maxLength && (
            <p className={cn(
              'text-xs font-medium',
              charPercentage > 90 ? 'text-warning' : 'text-foreground-muted'
            )}>
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
