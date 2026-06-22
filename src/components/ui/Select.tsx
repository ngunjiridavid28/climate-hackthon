import React from 'react';
import { cn } from '../../lib/utils.js';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helpText, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'input-base appearance-none pr-10 cursor-pointer',
              error && 'border-error focus-visible:ring-error',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
        </div>

        {error && <p className="text-xs text-error">{error}</p>}
        {helpText && !error && <p className="text-xs text-foreground-muted">{helpText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
