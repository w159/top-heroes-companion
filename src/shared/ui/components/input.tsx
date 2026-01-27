import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon element */
  leadingIcon?: React.ReactNode;
  /** Trailing icon element */
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leadingIcon, trailingIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leadingIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            `flex h-12 w-full rounded-sm
             bg-surface-800 border-b border-surface-500
             px-4 py-3 text-body-lg text-foreground
             placeholder:text-muted-foreground
             transition-colors duration-200
             hover:bg-surface-700
             focus:bg-surface-700 focus:border-b-2 focus:border-primary-400
             focus-visible:outline-none
             disabled:cursor-not-allowed disabled:opacity-50`,
            leadingIcon && 'pl-11',
            trailingIcon && 'pr-11',
            className
          )}
          ref={ref}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {trailingIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
