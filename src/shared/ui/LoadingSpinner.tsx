import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-label-sm',
  };

  return (
    <div className={cn('flex flex-col justify-center items-center gap-4 p-12 w-full h-full', className)}>
      <div className="relative">
        {/* Primary ring */}
        <div
          className={cn(
            'rounded-full border-2 border-primary-500/20 border-t-primary-400 animate-spin',
            sizeClasses[size]
          )}
        />
        {/* Secondary ring — counter-rotates for depth */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-transparent border-b-gold-500/15 animate-spin-slow',
            sizeClasses[size]
          )}
        />
      </div>
      <p className={cn(
        'text-muted-foreground uppercase tracking-[0.2em] font-medium animate-pulse',
        textSizeClasses[size]
      )}>
        Loading
      </p>
    </div>
  );
};

export default LoadingSpinner;
