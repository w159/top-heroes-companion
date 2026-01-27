import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  // Base styles
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full
   text-label-lg font-medium transition-all duration-200
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-38
   [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        // M3 Filled Button
        filled: `bg-primary-500 text-white hover:bg-primary-400 hover:shadow-md active:bg-primary-600`,
        // M3 Filled Tonal Button
        tonal: `bg-secondary-800 text-secondary-100 hover:bg-secondary-700 hover:shadow-sm active:bg-secondary-900`,
        // M3 Outlined Button
        outlined: `border border-border bg-transparent text-primary-300
                   hover:bg-primary-900/30 active:bg-primary-900/50`,
        // M3 Text Button
        text: `bg-transparent text-primary-300 hover:bg-primary-900/30 active:bg-primary-900/50`,
        // Destructive variant
        destructive: `bg-error-600 text-white hover:bg-error-500 hover:shadow-md active:bg-error-700`,
        // Ghost variant
        ghost: `bg-transparent text-muted-foreground hover:bg-surface-800 hover:text-foreground`,
        // Gold accent for gaming
        gold: `bg-gradient-to-r from-gold-600 to-gold-500 text-gold-950 font-semibold
               hover:from-gold-500 hover:to-gold-400 hover:shadow-md active:from-gold-700 active:to-gold-600`,
      },
      size: {
        sm: 'h-8 px-4 text-label-md [&_svg]:size-4',
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
