import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const iconButtonVariants = cva(
  `inline-flex items-center justify-center rounded-md
   transition-all duration-normal
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
   disabled:pointer-events-none disabled:opacity-50
   [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: `text-muted-foreground
                  hover:bg-surface-700/60 hover:text-foreground
                  active:bg-surface-600/60`,
        filled: `bg-surface-700/80 text-foreground border border-surface-600/20
                 hover:bg-surface-600/80 hover:border-surface-500/30
                 active:bg-surface-500/80`,
        tonal: `bg-primary-900/30 text-primary-300 border border-primary-700/20
                hover:bg-primary-900/50 hover:border-primary-600/30
                active:bg-primary-900/60`,
        outline: `border border-surface-600/30 text-muted-foreground
                   hover:bg-surface-800/60 hover:text-foreground hover:border-surface-500/40
                   active:bg-surface-700/60`,
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

interface IconButtonProps
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
export type { IconButtonProps };
