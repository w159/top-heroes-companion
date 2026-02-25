import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Flame,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { IconButton } from '@/shared/ui/components/icon-button';
import { formatNumber } from '@/shared/lib/utils';

interface ProgressSectionProps {
  totalInfluence: number;
  trendPercentage: number;
  projectedInfluence: number;
  resourcePlan: {
    spendProfile: string;
    weeklyFocusEvents: string[];
    dailyDiamondBudget: number;
    notes: string[];
  };
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  totalInfluence,
  trendPercentage,
  projectedInfluence,
  resourcePlan,
}) => (
  <>
    {/* Power Progression */}
    <Card variant="outlined">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <p className="text-label-md text-muted-foreground uppercase tracking-wider mb-1">
            Total Influence
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-display-sm font-heading font-semibold text-gradient">
              {formatNumber(totalInfluence)}
            </span>
            <Badge variant={trendPercentage >= 0 ? 'success' : 'error'}>
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
            </Badge>
          </div>
        </div>
        <IconButton variant="outline" size="sm">
          <TrendingUp className="w-4 h-4" />
        </IconButton>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-20 bg-surface-800/60 rounded-lg p-4 overflow-hidden border border-[rgba(196,170,126,0.06)]">
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary-600/20 to-primary-500/5"
            style={{ width: `${Math.min((trendPercentage + 50) * 2, 100)}%` }}
          />
          <div className="relative flex justify-between items-center h-full">
            <div>
              <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Current</p>
              <p className="text-title-md font-heading font-semibold">{formatNumber(totalInfluence)}</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-primary-400" />
            <div className="text-right">
              <p className="text-label-sm text-muted-foreground uppercase tracking-wider">30-Day Projection</p>
              <p className="text-title-md font-heading font-semibold">{formatNumber(projectedInfluence)}</p>
            </div>
          </div>
        </div>

        {/* Strategy Note */}
        <div className="p-4 bg-surface-800/60 rounded-lg border border-[rgba(196,170,126,0.08)]">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-gold-400" />
            <span className="text-label-lg font-medium">Growth Strategy</span>
          </div>
          <p className="text-body-md text-muted-foreground">
            {resourcePlan.spendProfile} spending pattern detected. Focus on {resourcePlan.weeklyFocusEvents.join(', ')} events for optimal progression.
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Resource Strategy */}
    <Card variant="elevated" className="relative overflow-hidden lg:col-span-2">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900 to-primary-950/20 pointer-events-none" />

      <div className="relative">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Resource Strategy</CardTitle>
          <IconButton variant="tonal" size="sm">
            <TrendingUp className="w-4 h-4" />
          </IconButton>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary-900/25 to-transparent border border-primary-800/20">
              <p className="text-label-sm text-muted-foreground uppercase tracking-wider mb-1">
                Daily Diamond Budget
              </p>
              <p className="text-headline-md font-heading font-semibold text-primary-300">
                {resourcePlan.dailyDiamondBudget}
                <span className="text-title-md ml-2 text-primary-500/60">diamonds</span>
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-gold-900/25 to-transparent border border-gold-800/20">
              <p className="text-label-sm text-muted-foreground uppercase tracking-wider mb-1">
                Spending Profile
              </p>
              <p className="text-headline-md font-heading font-semibold text-gold-300">
                {resourcePlan.spendProfile}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-label-lg font-medium mb-2">Focus Events This Week</p>
            <div className="flex flex-wrap gap-2">
              {resourcePlan.weeklyFocusEvents.map((event, index) => (
                <Badge key={index} variant="primary" size="lg">{event}</Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-surface-800/60 rounded-lg border border-[rgba(196,170,126,0.08)]">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary-400" />
              <span className="text-label-lg font-medium">Strategy Notes</span>
            </div>
            <ul className="space-y-2">
              {resourcePlan.notes.map((note, index) => (
                <li key={index} className="text-body-md text-muted-foreground flex items-start gap-2">
                  <span className="text-primary-500 mt-1">&bull;</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </div>
    </Card>
  </>
);

export default ProgressSection;
