import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const chipVariants = cva(
  `inline-flex items-center justify-center gap-2 rounded-sm
   text-label-lg font-medium whitespace-nowrap
   transition-all duration-200 cursor-pointer select-none
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
  {
    variants: {
      variant: {
        // M3 Assist Chip
        assist: `border border-border bg-transparent text-foreground
                 hover:bg-surface-800 active:bg-surface-700`,
        // M3 Filter Chip
        filter: `border border-border bg-transparent text-foreground
                 hover:bg-surface-800
                 data-[selected=true]:bg-secondary-800 data-[selected=true]:border-transparent`,
        // M3 Input Chip
        input: `border border-border bg-transparent text-foreground
                hover:bg-surface-800`,
        // M3 Suggestion Chip
        suggestion: `border border-border bg-transparent text-foreground
                     hover:bg-surface-800 active:bg-surface-700`,
      },
      size: {
        sm: 'h-7 px-3 text-label-md',
        md: 'h-8 px-4',
        lg: 'h-9 px-5',
      },
    },
    defaultVariants: {
      variant: 'filter',
      size: 'md',
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  /** Whether the chip is selected (for filter chips) */
  selected?: boolean;
  /** Leading icon element */
  leadingIcon?: React.ReactNode;
  /** Show close button (for input chips) */
  onRemove?: () => void;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      selected = false,
      leadingIcon,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        data-selected={selected}
        className={cn(chipVariants({ variant, size }), className)}
        {...props}
      >
        {variant === 'filter' && selected && (
          <Check className="h-4 w-4" />
        )}
        {leadingIcon && !selected && leadingIcon}
        {children}
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                onRemove();
              }
            }}
            className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-surface-600"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    );
  }
);
Chip.displayName = 'Chip';

export { Chip, chipVariants };
