import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface QuickActionProps {
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'gold';
}

const QuickAction: React.FC<QuickActionProps> = ({
  label,
  description,
  icon: Icon,
  onClick,
  variant = 'default'
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-4 p-4 rounded-lg w-full text-left transition-all duration-normal group',
      variant === 'gold'
        ? 'bg-gradient-to-r from-gold-900/30 to-gold-800/10 border border-gold-700/30 hover:from-gold-900/50 hover:to-gold-800/30 hover:border-gold-600/40 hover:shadow-glow'
        : 'bg-surface-800/60 border border-[rgba(196,170,126,0.06)] hover:bg-surface-700/60 hover:border-[rgba(196,170,126,0.12)]'
    )}
  >
    <div className={cn(
      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors',
      variant === 'gold'
        ? 'bg-gold-900/50 border-gold-700/30 group-hover:bg-gold-800/60'
        : 'bg-surface-700/80 border-[rgba(196,170,126,0.06)] group-hover:bg-surface-600/80'
    )}>
      <Icon className={cn('w-5 h-5', variant === 'gold' ? 'text-gold-300' : 'text-primary-400')} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn('text-label-lg font-medium', variant === 'gold' && 'text-gold-200')}>{label}</p>
      <p className="text-body-sm text-muted-foreground truncate">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary-400 transition-colors" />
  </button>
);

export default QuickAction;
