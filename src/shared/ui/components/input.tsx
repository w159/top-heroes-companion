import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leadingIcon, trailingIcon, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {leadingIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary-400">
            {leadingIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            `flex h-12 w-full rounded-lg
             bg-surface-800/60 border border-[rgba(196,170,126,0.08)]
             px-4 py-3 text-body-lg text-foreground
             placeholder:text-surface-500
             transition-all duration-normal
             hover:bg-surface-700/60 hover:border-[rgba(196,170,126,0.15)]
             focus:bg-surface-700/60 focus:border-primary-500/40 focus:shadow-glow
             focus-visible:outline-none
             disabled:cursor-not-allowed disabled:opacity-40`,
            leadingIcon && 'pl-11',
            trailingIcon && 'pr-11',
            className
          )}
          ref={ref}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {trailingIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
