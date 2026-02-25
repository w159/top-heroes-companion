import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
   text-sm font-medium transition-all duration-normal
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
   disabled:pointer-events-none disabled:opacity-50
   [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        default: `bg-primary-500 text-surface-950 font-semibold
                  hover:bg-primary-400 hover:shadow-glow
                  active:bg-primary-600`,
        secondary: `bg-surface-700/80 text-foreground border border-surface-600/50
                    hover:bg-surface-600/80 hover:border-surface-500/50
                    active:bg-surface-800`,
        outline: `border border-surface-600/30 bg-transparent text-primary-300
                  hover:bg-primary-900/20 hover:border-primary-500/40
                  active:bg-primary-900/30`,
        ghost: `bg-transparent text-muted-foreground
                hover:bg-surface-800 hover:text-foreground
                active:bg-surface-700`,
        link: `bg-transparent text-primary-400 underline-offset-4
               hover:underline
               active:text-primary-300`,
        destructive: `bg-error-600 text-white font-semibold
                      hover:bg-error-500 hover:shadow-md
                      active:bg-error-700`,
        gold: `bg-gradient-to-r from-gold-500 via-primary-400 to-gold-500 text-surface-950 font-bold
               shadow-glow
               hover:from-gold-400 hover:via-primary-300 hover:to-gold-400
               active:from-gold-600 active:via-primary-500 active:to-gold-600`,
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
