import React from 'react';
import { cn } from '../../../shared/lib/utils';

export interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
  iconColor?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  label,
  description,
  children,
  iconColor = 'text-primary-400'
}) => (
  <div className="flex items-start sm:items-center justify-between gap-4 p-4 bg-surface-800/50 rounded-xl hover:bg-surface-800 transition-colors">
    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', 'bg-surface-700')}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-title-sm font-medium">{label}</p>
        {description && (
          <p className="text-body-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);
