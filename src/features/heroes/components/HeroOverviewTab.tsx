import React from 'react';
import { Trophy, Users, Swords, Shield, Target, Sparkles } from 'lucide-react';
import StatRadarChart from './StatRadarChart';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { cn } from '../../../shared/lib/utils';

interface HeroDetailEntry {
  stats?: Record<string, number>;
  role_rating?: Record<string, number>;
  synergies?: string[];
  counters?: string[];
  weak_against?: string[];
  positioning?: string;
}

interface HeroOverviewTabProps {
  detail: HeroDetailEntry | undefined;
  hasDetailData: boolean;
}

const HeroOverviewTab: React.FC<HeroOverviewTabProps> = ({ detail, hasDetailData }) => (
  <div className="space-y-6">
    {/* Stats Radar */}
    {hasDetailData && detail?.stats && (
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-warning-400" />
            <h2 className="text-title-lg font-semibold">Base Stats</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <StatRadarChart stats={detail.stats} size={280} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(detail.stats).map(([key, value]) => (
              <div key={key} className="bg-surface-800/50 rounded-lg p-3">
                <div className="text-label-sm text-muted-foreground uppercase mb-1">
                  {key.replace('_', ' ')}
                </div>
                <div className="text-title-lg font-bold">{value as string}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}

    {/* Role Ratings */}
    {hasDetailData && detail?.role_rating && (
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Role Performance</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(detail.role_rating).map(([role, rating]) => (
            <div key={role}>
              <div className="flex justify-between mb-2">
                <span className="text-title-sm font-medium capitalize">{role}</span>
                <span className="text-title-sm font-bold text-primary-400">{rating as number}/100</span>
              </div>
              <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    (rating as number) >= 80 ? 'bg-success-500' :
                      (rating as number) >= 60 ? 'bg-primary-500' : 'bg-warning-500'
                  )}
                  style={{ width: `${rating}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}

    {/* Synergies & Counters */}
    {hasDetailData && (detail?.synergies || detail?.counters || detail?.weak_against) && (
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Swords className="w-5 h-5 text-tertiary-400" />
            <h2 className="text-title-lg font-semibold">Team Synergy</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {detail?.synergies && detail.synergies.length > 0 && (
            <div>
              <div className="text-label-md font-semibold text-success-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Works Well With
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.synergies.map((hero: string) => (
                  <span key={hero} className="px-3 py-1.5 bg-success-500/15 text-success-400 rounded-lg text-label-sm font-medium">
                    {hero}
                  </span>
                ))}
              </div>
            </div>
          )}

          {detail?.counters && detail.counters.length > 0 && (
            <div>
              <div className="text-label-md font-semibold text-primary-400 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Strong Against
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.counters.map((hero: string) => (
                  <span key={hero} className="px-3 py-1.5 bg-primary-500/15 text-primary-400 rounded-lg text-label-sm font-medium">
                    {hero}
                  </span>
                ))}
              </div>
            </div>
          )}

          {detail?.weak_against && detail.weak_against.length > 0 && (
            <div>
              <div className="text-label-md font-semibold text-warning-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Weak Against
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.weak_against.map((hero: string) => (
                  <span key={hero} className="px-3 py-1.5 bg-warning-500/15 text-warning-400 rounded-lg text-label-sm font-medium">
                    {hero}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Positioning */}
    {hasDetailData && detail?.positioning && (
      <Card variant="filled" className="border-primary-500/30 bg-primary-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary-400" />
            <span className="text-title-sm font-semibold text-primary-400">Optimal Position</span>
          </div>
          <p className="text-body-md text-primary-300">{detail.positioning}</p>
        </CardContent>
      </Card>
    )}
  </div>
);

export default HeroOverviewTab;
