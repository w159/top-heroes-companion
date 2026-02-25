import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const chipVariants = cva(
  `inline-flex items-center justify-center gap-2 rounded-md
   text-label-lg font-medium whitespace-nowrap
   transition-all duration-normal cursor-pointer select-none
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
  {
    variants: {
      variant: {
        assist: `border border-[rgba(196,170,126,0.12)] bg-transparent text-foreground
                 hover:bg-surface-800/60 hover:border-[rgba(196,170,126,0.2)]
                 active:bg-surface-700/60`,
        filter: `border border-[rgba(196,170,126,0.1)] bg-transparent text-surface-200
                 hover:bg-surface-800/60 hover:border-[rgba(196,170,126,0.2)]
                 data-[selected=true]:bg-primary-900/40 data-[selected=true]:border-primary-500/30 data-[selected=true]:text-primary-200`,
        input: `border border-[rgba(196,170,126,0.12)] bg-transparent text-foreground
                hover:bg-surface-800/60`,
        suggestion: `border border-[rgba(196,170,126,0.12)] bg-transparent text-foreground
                     hover:bg-surface-800/60 hover:border-[rgba(196,170,126,0.2)]
                     active:bg-surface-700/60`,
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
  selected?: boolean;
  leadingIcon?: React.ReactNode;
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
          <Check className="h-4 w-4 text-primary-400" />
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
