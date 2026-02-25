import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';
import gameGuides from '@/data/gameGuides.json';

export const CorePrinciples: React.FC = () => {
  return (
    <div className="space-y-4 pt-4">
      {gameGuides.corePrinciples.principles.map((principle, idx) => (
        <div
          key={idx}
          className={cn(
            'rounded-xl p-4 border-2',
            principle.importance === 'critical'
              ? 'bg-error-500/10 border-error-500/50'
              : 'bg-surface-800/50 border-border'
          )}
        >
          <div className="flex items-start gap-4">
            {principle.importance === 'critical' && (
              <div className="w-10 h-10 rounded-lg bg-error-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-error-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-title-md font-semibold mb-2">
                {principle.title}
                {principle.importance === 'critical' && (
                  <Badge variant="error" size="sm" className="ml-2">Critical</Badge>
                )}
              </h3>
              <p className="text-body-md text-muted-foreground mb-3">
                {principle.description}
              </p>
              <p className="text-body-sm text-muted-foreground italic mb-4 pl-4 border-l-2 border-primary-500/30">
                Why: {principle.reasoning}
              </p>
              <ul className="space-y-2">
                {principle.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-start gap-2 text-body-sm">
                    <Sparkles className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
