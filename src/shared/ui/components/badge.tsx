import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  `inline-flex items-center justify-center gap-1 rounded-full
   text-label-sm font-medium whitespace-nowrap transition-colors`,
  {
    variants: {
      variant: {
        default: 'bg-surface-700 text-foreground',
        primary: 'bg-primary-900 text-primary-200 border border-primary-700',
        secondary: 'bg-secondary-800 text-secondary-200',
        success: 'bg-success-900 text-success-200 border border-success-700',
        warning: 'bg-warning-900 text-warning-200 border border-warning-700',
        error: 'bg-error-900 text-error-200 border border-error-700',
        gold: 'bg-gold-900 text-gold-200 border border-gold-700',
        outline: 'border border-border text-muted-foreground bg-transparent',
      },
      size: {
        sm: 'h-5 px-2 text-label-sm',
        md: 'h-6 px-2.5',
        lg: 'h-7 px-3 text-label-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
