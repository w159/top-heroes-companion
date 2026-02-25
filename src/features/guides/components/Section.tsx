import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/components/card';
import { cn } from '@/shared/lib/utils';

export interface SectionProps {
  title: string;
  icon: React.ReactNode;
  iconColor?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  icon,
  iconColor = 'text-primary-400',
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <Card variant="filled" className="overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-4 flex items-center justify-between gap-4',
          'hover:bg-surface-700/50 transition-colors',
          isExpanded && 'bg-surface-800/50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-surface-700', iconColor)}>
            {icon}
          </div>
          <h2 className="text-title-lg font-semibold">{title}</h2>
        </div>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center transition-transform',
          'bg-surface-700/50',
          isExpanded && 'rotate-180'
        )}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>
      {isExpanded && (
        <CardContent className="p-4 pt-0 animate-in">
          {children}
        </CardContent>
      )}
    </Card>
  );
};
