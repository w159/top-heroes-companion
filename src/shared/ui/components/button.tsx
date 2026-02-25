import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg
   text-label-lg font-medium transition-all duration-normal
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
   disabled:pointer-events-none disabled:opacity-40
   [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        filled: `bg-primary-500 text-surface-950 font-semibold
                 hover:bg-primary-400 hover:shadow-glow
                 active:bg-primary-600`,
        tonal: `bg-surface-700/80 text-foreground border border-[rgba(196,170,126,0.08)]
                hover:bg-surface-600/80 hover:border-[rgba(196,170,126,0.15)]
                active:bg-surface-800`,
        outlined: `border border-[rgba(196,170,126,0.2)] bg-transparent text-primary-300
                   hover:bg-primary-900/20 hover:border-primary-500/40
                   active:bg-primary-900/30`,
        text: `bg-transparent text-primary-400
               hover:bg-primary-900/20
               active:bg-primary-900/30`,
        destructive: `bg-error-600 text-white font-semibold
                      hover:bg-error-500 hover:shadow-md
                      active:bg-error-700`,
        ghost: `bg-transparent text-muted-foreground
                hover:bg-surface-800 hover:text-foreground
                active:bg-surface-700`,
        gold: `bg-gradient-to-r from-gold-500 via-primary-400 to-gold-500 text-surface-950 font-bold
               shadow-glow
               hover:from-gold-400 hover:via-primary-300 hover:to-gold-400
               active:from-gold-600 active:via-primary-500 active:to-gold-600`,
      },
      size: {
        sm: 'h-8 px-4 text-label-md rounded-md [&_svg]:size-4',
        md: 'h-10 px-6',
        lg: 'h-12 px-8 text-title-md',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0 [&_svg]:size-4',
        'icon-lg': 'h-12 w-12 p-0 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
);

export interface ButtonProps
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
