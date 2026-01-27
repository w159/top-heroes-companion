import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Zap,
  Calendar,
  Users,
  Star,
  Clock,
  Sparkles,
  Award,
  Flame,
  BookOpen,
  Gift,
  Target,
  ChevronRight,
} from 'lucide-react';
import { useUserData } from '../../../shared/utils';
import {
  recommendHeroUpgrades,
  recommendResourcePlan,
  simulateProgression
} from '../../../shared/utils/recommendations';
import {
  calculateProgressTrend,
  calculateTotalInfluence
} from '../../../shared/utils';
import { Button } from '../../../shared/ui/components/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import { IconButton } from '../../../shared/ui/components/icon-button';
import { cn, formatNumber } from '../../../shared/lib/utils';

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, change, trend = 'neutral' }) => (
  <div className="flex items-center gap-3 p-4 bg-surface-800 rounded-lg">
    <div className="w-12 h-12 rounded-lg bg-primary-900/50 flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-primary-300" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-label-md text-muted-foreground truncate">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-title-lg font-semibold">{value}</span>
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
);

// Quick Action Item
interface QuickActionProps {
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
      'flex items-center gap-4 p-4 rounded-lg w-full text-left transition-all duration-200',
      variant === 'gold'
        ? 'bg-gradient-to-r from-gold-900/40 to-gold-800/20 border border-gold-700/50 hover:from-gold-900/60 hover:to-gold-800/40'
        : 'bg-surface-800 hover:bg-surface-700'
    )}
  >
    <div className={cn(
      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
      variant === 'gold' ? 'bg-gold-800' : 'bg-surface-700'
    )}>
      <Icon className={cn('w-5 h-5', variant === 'gold' ? 'text-gold-200' : 'text-foreground')} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn('text-label-lg font-medium', variant === 'gold' && 'text-gold-100')}>{label}</p>
      <p className="text-body-sm text-muted-foreground truncate">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
  </button>
);

// Priority Upgrade Card
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
        'w-8 h-8 rounded-full flex items-center justify-center text-label-lg font-bold',
        priority === 1 ? 'bg-gold-600 text-gold-950' : 'bg-primary-700 text-white'
      )}>
        {priority}
      </div>
    </div>
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-title-lg font-bold flex-shrink-0">
          {heroName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h4 className="text-title-md font-medium truncate">{heroName}</h4>
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

// Event Card
interface EventCardProps {
  name: string;
  endsIn: string;
  rewards: string;
  priority: 'high' | 'medium' | 'low';
}

const EventCard: React.FC<EventCardProps> = ({ name, endsIn, rewards, priority }) => (
  <div className={cn(
    'p-4 rounded-lg border transition-colors',
    priority === 'high' && 'bg-error-900/20 border-error-700/50',
    priority === 'medium' && 'bg-warning-900/20 border-warning-700/50',
    priority === 'low' && 'bg-surface-800 border-border'
  )}>
    <div className="flex items-start justify-between mb-2">
      <div>
        <h4 className="text-title-sm font-medium">{name}</h4>
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
    <div className="flex items-center gap-1.5 text-body-sm mt-2 p-2 bg-surface-900/50 rounded">
      <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
      <span className="text-muted-foreground">Rewards:</span>
      <span className="text-gold-300 font-medium truncate">{rewards}</span>
    </div>
  </div>
);

// Main Dashboard Component
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoaded } = useUserData();

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-3 border-primary-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Calculate metrics
  const totalInfluence = calculateTotalInfluence(data);
  const snapshots = data.progressLog || [];
  const trendPercentage = calculateProgressTrend(snapshots);
  const upgrades = recommendHeroUpgrades(data, 3);
  const resourcePlan = recommendResourcePlan(data);
  const simulation = simulateProgression({ days: 30, userData: data });

  // Mock data for demonstration
  const quickStats: StatCardProps[] = [
    { label: 'Total Heroes', value: '42', icon: Shield, change: '+3', trend: 'up' },
    { label: 'Team Power', value: formatNumber(totalInfluence), icon: Zap, change: `${trendPercentage > 0 ? '+' : ''}${trendPercentage.toFixed(1)}%`, trend: trendPercentage >= 0 ? 'up' : 'down' },
    { label: 'Guild Rank', value: '#127', icon: Users, change: '+12', trend: 'up' },
    { label: 'Login Streak', value: '47', icon: Calendar, change: 'days' },
  ];

  const activeEvents: EventCardProps[] = [
    { name: 'Guild War', endsIn: '2h 45m', rewards: 'Epic Gear', priority: 'high' },
    { name: 'Hero Trial', endsIn: '1d 5h', rewards: 'Summon Tickets', priority: 'medium' },
    { name: 'Daily Challenges', endsIn: '8h 12m', rewards: 'Resources', priority: 'low' },
  ];

  const recentAchievements = [
    { name: 'First S-Tier Hero', icon: Star, rarity: 'gold' as const },
    { name: 'Team Power 1M', icon: Trophy, rarity: 'primary' as const },
    { name: 'Event Champion', icon: Award, rarity: 'gold' as const },
  ];

  return (
    <div className="space-y-6 animate-in pb-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-900/40 via-surface-900 to-surface-950 border border-primary-800/30 p-6">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <p className="text-label-md text-muted-foreground uppercase tracking-widest mb-1">
            Welcome Back, Commander
          </p>
          <h1 className="text-display-sm font-semibold mb-2">Command Center</h1>
          <p className="text-body-lg text-muted-foreground">
            Server {data.settings.serverGroup} • {data.settings.mainFaction} Faction
          </p>

          <Button
            variant="gold"
            size="lg"
            className="mt-6"
            onClick={() => navigate('/heroes')}
          >
            <Shield className="w-5 h-5" />
            View Heroes
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Progression */}
        <Card variant="outlined">
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <p className="text-label-md text-muted-foreground uppercase tracking-wide mb-1">
                Total Influence
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-display-sm font-semibold text-gradient">
                  {formatNumber(totalInfluence)}
                </span>
                <Badge variant={trendPercentage >= 0 ? 'success' : 'error'}>
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
            <IconButton variant="outlined" size="sm">
              <TrendingUp className="w-4 h-4" />
            </IconButton>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="relative h-20 bg-surface-800 rounded-lg p-4 overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary-600/30 to-primary-500/10"
                style={{ width: `${Math.min((trendPercentage + 50) * 2, 100)}%` }}
              />
              <div className="relative flex justify-between items-center h-full">
                <div>
                  <p className="text-label-sm text-muted-foreground">Current</p>
                  <p className="text-title-md font-semibold">{formatNumber(totalInfluence)}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-primary-400" />
                <div className="text-right">
                  <p className="text-label-sm text-muted-foreground">30-Day Projection</p>
                  <p className="text-title-md font-semibold">{formatNumber(simulation.projectedTotalInfluence)}</p>
                </div>
              </div>
            </div>

            {/* Strategy Note */}
            <div className="p-4 bg-surface-800 rounded-lg border border-border">
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

        {/* Priority Upgrades */}
        <Card variant="outlined">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Priority Upgrades</CardTitle>
            <Button variant="text" size="sm" onClick={() => navigate('/roster')}>
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upgrades.length === 0 ? (
              <div className="text-center py-8 bg-surface-800 rounded-lg">
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
                  onClick={() => navigate(`/heroes/${rec.heroId}`)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Events */}
        <Card variant="outlined">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Active Events</CardTitle>
            <Button variant="text" size="sm" onClick={() => navigate('/events')}>
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

        {/* Achievements & Quick Actions */}
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
                      'relative p-4 rounded-lg text-center overflow-hidden',
                      achievement.rarity === 'gold'
                        ? 'bg-gradient-to-br from-gold-900/30 to-gold-800/10 border border-gold-700/30'
                        : 'bg-surface-800 border border-border'
                    )}
                  >
                    <div className={cn(
                      'w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-2',
                      achievement.rarity === 'gold'
                        ? 'bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/20'
                        : 'bg-gradient-to-br from-primary-500 to-primary-700'
                    )}>
                      <achievement.icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-label-md font-medium line-clamp-2">{achievement.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction
                label="Build Team"
                description="Create optimal team compositions"
                icon={Target}
                onClick={() => navigate('/team')}
              />
              <QuickAction
                label="Browse Heroes"
                description="View all available heroes"
                icon={Shield}
                onClick={() => navigate('/heroes')}
              />
              <QuickAction
                label="View Guides"
                description="Tips and strategies"
                icon={BookOpen}
                onClick={() => navigate('/guides')}
              />
              <QuickAction
                label="Redeem Gift Code"
                description="Claim free rewards"
                icon={Gift}
                onClick={() => navigate('/codes')}
                variant="gold"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resource Strategy */}
      <Card variant="elevated" className="bg-gradient-to-br from-surface-900 to-surface-950">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Resource Strategy</CardTitle>
          <IconButton variant="tonal" size="sm">
            <TrendingUp className="w-4 h-4" />
          </IconButton>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary-900/30 to-transparent border border-primary-800/30">
              <p className="text-label-sm text-muted-foreground uppercase tracking-wide mb-1">
                Daily Diamond Budget
              </p>
              <p className="text-headline-md font-semibold text-primary-300">
                {resourcePlan.dailyDiamondBudget}
                <span className="text-title-md ml-2">💎</span>
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-gold-900/30 to-transparent border border-gold-800/30">
              <p className="text-label-sm text-muted-foreground uppercase tracking-wide mb-1">
                Spending Profile
              </p>
              <p className="text-headline-md font-semibold text-gold-300">
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

          <div className="p-4 bg-surface-800 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary-400" />
              <span className="text-label-lg font-medium">Strategy Notes</span>
            </div>
            <ul className="space-y-2">
              {resourcePlan.notes.map((note, index) => (
                <li key={index} className="text-body-md text-muted-foreground flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
