import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const iconButtonVariants = cva(
  `inline-flex items-center justify-center rounded-full
   transition-all duration-200
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
   disabled:pointer-events-none disabled:opacity-38
   [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: `text-muted-foreground hover:bg-surface-700 hover:text-foreground
                  active:bg-surface-600`,
        filled: `bg-surface-700 text-foreground hover:bg-surface-600
                 active:bg-surface-500`,
        tonal: `bg-secondary-800 text-secondary-100 hover:bg-secondary-700
                active:bg-secondary-900`,
        outlined: `border border-border text-muted-foreground
                   hover:bg-surface-800 hover:text-foreground active:bg-surface-700`,
      },
      size: {
        sm: 'h-8 w-8 [&_svg]:size-4',
        md: 'h-10 w-10 [&_svg]:size-5',
        lg: 'h-12 w-12 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
