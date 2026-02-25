import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { cn } from '../../../shared/lib/utils';

interface BestWith {
  gear?: string;
  weapon?: string;
  pet?: string;
  relics?: string[];
}

interface HeroBuildTabProps {
  bestWith: BestWith | undefined;
  skillPriority: number[] | undefined;
  hasDetailData: boolean;
  /** Fallback basic info when no detail data */
  basicInfo: {
    gearSet: string;
    uniqueWeapon: string | undefined;
    positions: string[];
  };
}

const HeroBuildTab: React.FC<HeroBuildTabProps> = ({
  bestWith,
  skillPriority,
  hasDetailData,
  basicInfo,
}) => (
  <div className="space-y-6">
    {/* Best Gear */}
    {hasDetailData && bestWith && (
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-success-400" />
            <h2 className="text-title-lg font-semibold">Recommended Build</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {bestWith.gear && (
            <div>
              <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Gear Set</div>
              <div className="bg-success-500/15 text-success-400 border border-success-500/30 rounded-lg p-3 text-title-sm font-semibold">
                {bestWith.gear}
              </div>
            </div>
          )}

          {bestWith.weapon && (
            <div>
              <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Weapon</div>
              <div className="bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-lg p-3 text-title-sm font-semibold">
                {bestWith.weapon}
              </div>
            </div>
          )}

          {bestWith.pet && (
            <div>
              <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Pet</div>
              <div className="bg-tertiary-500/15 text-tertiary-400 border border-tertiary-500/30 rounded-lg p-3 text-title-sm font-semibold">
                {bestWith.pet}
              </div>
            </div>
          )}

          {bestWith.relics && bestWith.relics.length > 0 && (
            <div>
              <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Relics</div>
              <div className="space-y-2">
                {bestWith.relics.map((relic: string, idx: number) => (
                  <div key={idx} className="bg-warning-500/15 text-warning-400 border border-warning-500/30 rounded-lg p-3 text-label-md font-semibold">
                    {relic}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Skill Priority */}
    {hasDetailData && skillPriority && (
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Skill Upgrade Priority</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground mb-4">
            Upgrade skills in this order for optimal performance:
          </p>
          <div className="flex gap-2 flex-wrap">
            {skillPriority.map((priority: number, idx: number) => (
              <div
                key={idx}
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center',
                  'text-title-md font-bold',
                  idx === 0
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-800 text-foreground border border-border'
                )}
              >
                {priority}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}

    {/* Fallback to basic info */}
    {!hasDetailData && (
      <Card variant="filled">
        <CardHeader className="pb-2">
          <h2 className="text-title-lg font-semibold">Basic Info</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-label-sm text-muted-foreground mb-1">Gear Set</div>
            <div className="text-title-md font-semibold">{basicInfo.gearSet}</div>
          </div>
          <div>
            <div className="text-label-sm text-muted-foreground mb-1">Unique Weapon</div>
            <div className="text-title-md font-semibold">{basicInfo.uniqueWeapon || 'None'}</div>
          </div>
          <div>
            <div className="text-label-sm text-muted-foreground mb-1">Positions</div>
            <div className="text-title-md font-semibold">
              {basicInfo.positions.join(', ') || 'Any'}
            </div>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

export default HeroBuildTab;
