import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/shared/ui/components/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/components/tooltip';

export interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, change, trend = 'neutral' }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex items-center gap-3 p-4 bg-surface-800/60 rounded-lg border border-border/30 hover:border-border/60 transition-all duration-normal">
        <div className="w-12 h-12 rounded-lg bg-primary-900/40 border border-primary-700/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label-md text-muted-foreground truncate uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-title-lg font-heading font-semibold">{value}</span>
            {change && (
              <Badge
                variant={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'default'}
                size="sm"
              >
                {trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                {change}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}: {value}</p>
    </TooltipContent>
  </Tooltip>
);

export default StatCard;
