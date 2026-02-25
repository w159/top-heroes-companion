import React from 'react';
import {
  Shield,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  Trophy,
  Star,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/components/card';
import { Button } from '@/shared/ui/components/button';
import { Badge } from '@/shared/ui/components/badge';
import { IconButton } from '@/shared/ui/components/icon-button';
import { cn } from '@/shared/lib/utils';

// UpgradeCard sub-component
interface UpgradeCardProps {
  heroName: string;
  heroId: string;
  reason: string;
  score: number;
  targetLevel: number;
  priority: number;
  onClick: () => void;
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({
  heroName,
  reason,
  score,
  targetLevel,
  priority,
  onClick
}) => (
  <Card
    variant="filled"
    interactive
    onClick={onClick}
    className="relative overflow-hidden"
  >
    <div className="absolute top-3 right-3">
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center text-label-lg font-bold border',
        priority === 1
          ? 'bg-gradient-to-br from-gold-500 to-gold-700 text-surface-950 border-gold-400/30 shadow-glow'
          : 'bg-primary-800/60 text-primary-200 border-primary-600/20'
      )}>
        {priority}
      </div>
    </div>
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-title-lg font-heading font-bold flex-shrink-0 border border-primary-500/20">
          {heroName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h4 className="text-title-md font-heading font-medium truncate">{heroName}</h4>
          <p className="text-body-sm text-muted-foreground line-clamp-2 mt-1">{reason}</p>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="primary" size="sm">Score: {score.toFixed(0)}</Badge>
            <span className="text-label-sm text-muted-foreground">
              Target: <span className="text-gold-400 font-medium">Lv.{targetLevel}</span>
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// EventCard sub-component
interface EventCardProps {
  name: string;
  endsIn: string;
  rewards: string;
  priority: 'high' | 'medium' | 'low';
}

const EventCard: React.FC<EventCardProps> = ({ name, endsIn, rewards, priority }) => (
  <div className={cn(
    'p-4 rounded-lg border transition-all duration-normal',
    priority === 'high' && 'bg-error-900/20 border-error-700/30',
    priority === 'medium' && 'bg-warning-900/20 border-warning-700/30',
    priority === 'low' && 'bg-surface-800/60 border-[rgba(196,170,126,0.08)]'
  )}>
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="text-title-sm font-heading font-medium">{name}</h4>
        <div className="flex items-center gap-1.5 text-label-sm text-muted-foreground mt-0.5">
          <Clock className="w-3.5 h-3.5" />
          Ends in {endsIn}
        </div>
      </div>
      <Badge
        variant={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'default'}
        size="sm"
      >
        {priority.toUpperCase()}
      </Badge>
    </div>
    <div className="flex items-center gap-1.5 text-body-sm mt-2 p-2.5 bg-surface-900/60 rounded-lg border border-[rgba(196,170,126,0.06)]">
      <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
      <span className="text-muted-foreground">Rewards:</span>
      <span className="text-gold-300 font-medium truncate">{rewards}</span>
    </div>
  </div>
);

// Main exports
export interface UpgradeRecommendation {
  heroId: string;
  heroName: string;
  reason: string;
  score: number;
  recommendedLevel: number;
}

interface RecommendationCardsProps {
  upgrades: UpgradeRecommendation[];
  activeEvents: EventCardProps[];
  recentAchievements: Array<{ name: string; icon: React.ElementType; rarity: 'gold' | 'primary' }>;
  onNavigate: (path: string) => void;
}

const RecommendationCards: React.FC<RecommendationCardsProps> = ({
  upgrades,
  activeEvents,
  recentAchievements,
  onNavigate,
}) => (
  <>
    {/* Priority Upgrades */}
    <Card variant="outlined">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Priority Upgrades</CardTitle>
        <Button variant="link" size="sm" onClick={() => onNavigate('/roster')}>
          View All
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {upgrades.length === 0 ? (
          <div className="text-center py-8 bg-surface-800/40 rounded-lg border border-[rgba(196,170,126,0.06)]">
            <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-body-md text-muted-foreground">
              No urgent upgrades found. Your roster is optimized!
            </p>
          </div>
        ) : (
          upgrades.map((rec, index) => (
            <UpgradeCard
              key={rec.heroId}
              heroName={rec.heroName}
              heroId={rec.heroId}
              reason={rec.reason}
              score={rec.score}
              targetLevel={rec.recommendedLevel}
              priority={index + 1}
              onClick={() => onNavigate(`/heroes/${rec.heroId}`)}
            />
          ))
        )}
      </CardContent>
    </Card>

    {/* Active Events */}
    <Card variant="outlined">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Active Events</CardTitle>
        <Button variant="link" size="sm" onClick={() => onNavigate('/events')}>
          <Calendar className="w-4 h-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </CardContent>
    </Card>

    {/* Achievements & Quick Actions column */}
    <div className="space-y-6">
      {/* Recent Achievements */}
      <Card variant="outlined">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Achievements</CardTitle>
          <IconButton variant="default" size="sm">
            <Trophy className="w-4 h-4" />
          </IconButton>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className={cn(
                  'relative p-4 rounded-lg text-center overflow-hidden transition-all duration-normal',
                  achievement.rarity === 'gold'
                    ? 'bg-gradient-to-br from-gold-900/25 to-gold-800/5 border border-gold-700/20 hover:border-gold-600/30'
                    : 'bg-surface-800/60 border border-[rgba(196,170,126,0.08)] hover:border-[rgba(196,170,126,0.15)]'
                )}
              >
                <div className={cn(
                  'w-14 h-14 mx-auto rounded-lg flex items-center justify-center mb-2 border',
                  achievement.rarity === 'gold'
                    ? 'bg-gradient-to-br from-gold-500 to-gold-700 shadow-glow border-gold-400/20'
                    : 'bg-gradient-to-br from-primary-500 to-primary-700 border-primary-400/20'
                )}>
                  <achievement.icon className="w-7 h-7 text-surface-950" />
                </div>
                <p className="text-label-md font-medium line-clamp-2">{achievement.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </>
);

export { EventCard };
export type { EventCardProps };
export default RecommendationCards;
