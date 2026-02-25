import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leadingIcon, trailingIcon, ...props }, ref) => {
    if (leadingIcon || trailingIcon) {
      return (
        <div className="relative w-full group">
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary-400 [&_svg]:size-4">
              {leadingIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              `flex h-10 w-full rounded-md
               border border-input bg-surface-800/60
               px-3 py-2 text-sm text-foreground ring-offset-background
               file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground
               placeholder:text-muted-foreground
               transition-colors duration-normal
               hover:bg-surface-700/60 hover:border-surface-500/30
               focus:bg-surface-700/60 focus:border-primary-500/40
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
               disabled:cursor-not-allowed disabled:opacity-50`,
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {trailingIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md
           border border-input bg-surface-800/60
           px-3 py-2 text-sm text-foreground ring-offset-background
           file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground
           placeholder:text-muted-foreground
           transition-colors duration-normal
           hover:bg-surface-700/60 hover:border-surface-500/30
           focus:bg-surface-700/60 focus:border-primary-500/40
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
