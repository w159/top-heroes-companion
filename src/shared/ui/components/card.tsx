import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const cardVariants = cva(
  'rounded-lg transition-all duration-normal relative overflow-hidden text-card-foreground',
  {
    variants: {
      variant: {
        default: 'border border-surface-700/50 bg-card shadow-sm',
        filled: 'bg-surface-800/80 border border-surface-700/30',
        outlined: 'bg-surface-950/60 border border-surface-600/20',
        elevated: 'bg-surface-900 shadow-md border border-surface-700/20 bg-card-shine',
      },
      interactive: {
        true: `cursor-pointer
               hover:-translate-y-0.5 hover:shadow-lg
               hover:border-primary-500/15
               active:translate-y-0 active:shadow-md`,
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-lg font-heading font-semibold leading-none tracking-wide',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 p-5 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
export type { CardProps };
