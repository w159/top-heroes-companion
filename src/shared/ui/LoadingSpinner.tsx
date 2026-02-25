import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  return (
    <div className={cn('flex flex-col justify-center items-center gap-3 p-8 w-full', className)}>
      <Loader2 className={cn('animate-spin text-primary-400', sizeMap[size])} />
      <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">
        Loading
      </p>
    </div>
  );
};

export default LoadingSpinner;
