import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  `inline-flex items-center rounded-md border
   font-semibold transition-colors
   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`,
  {
    variants: {
      variant: {
        default: 'border-transparent bg-surface-700/80 text-surface-200',
        primary: 'border-transparent bg-primary-900/60 text-primary-200',
        secondary: 'border-transparent bg-surface-700/80 text-surface-200',
        outline: 'border-surface-600/30 text-muted-foreground bg-transparent',
        destructive: 'border-transparent bg-error-600 text-white',
        success: 'border-transparent bg-success-900/60 text-success-200',
        warning: 'border-transparent bg-warning-900/60 text-warning-200',
        error: 'border-transparent bg-error-900/60 text-error-200',
        gold: 'border-transparent bg-gold-900/60 text-gold-200',
        teal: 'border-transparent bg-secondary-900/60 text-secondary-200',
      },
      size: {
        sm: 'h-5 px-2 text-[0.6875rem]',
        md: 'h-6 px-2.5 text-xs',
        lg: 'h-7 px-3 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
