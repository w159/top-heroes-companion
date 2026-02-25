import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Zap,
  Calendar,
  Users,
  Star,
  Trophy,
  Award,
  BookOpen,
  Gift,
  Target,
} from 'lucide-react';
import { useUserData } from '@/shared/utils';
import {
  recommendHeroUpgrades,
  recommendResourcePlan,
  simulateProgression
} from '@/shared/utils/recommendations';
import {
  calculateProgressTrend,
  calculateTotalInfluence
} from '@/shared/utils';
import { formatNumber } from '@/shared/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/components/card';
import StatCard from '../components/StatCard';
import type { StatCardProps } from '../components/StatCard';
import QuickAction from '../components/QuickAction';
import DashboardHeader from '../components/DashboardHeader';
import RecommendationCards from '../components/RecommendationCards';
import type { UpgradeRecommendation } from '../components/RecommendationCards';
import ProgressSection from '../components/ProgressSection';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoaded } = useUserData();

  if (!isLoaded || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-400 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-gold-500/20 animate-spin-slow" />
        </div>
        <p className="text-label-md text-muted-foreground uppercase tracking-widest animate-pulse">Loading</p>
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

  const quickStats: StatCardProps[] = [
    { label: 'Total Heroes', value: '42', icon: Shield, change: '+3', trend: 'up' },
    { label: 'Team Power', value: formatNumber(totalInfluence), icon: Zap, change: `${trendPercentage > 0 ? '+' : ''}${trendPercentage.toFixed(1)}%`, trend: trendPercentage >= 0 ? 'up' : 'down' },
    { label: 'Guild Rank', value: '#127', icon: Users, change: '+12', trend: 'up' },
    { label: 'Login Streak', value: '47', icon: Calendar, change: 'days' },
  ];

  const activeEvents = [
    { name: 'Guild War', endsIn: '2h 45m', rewards: 'Epic Gear', priority: 'high' as const },
    { name: 'Hero Trial', endsIn: '1d 5h', rewards: 'Summon Tickets', priority: 'medium' as const },
    { name: 'Daily Challenges', endsIn: '8h 12m', rewards: 'Resources', priority: 'low' as const },
  ];

  const recentAchievements = [
    { name: 'First S-Tier Hero', icon: Star, rarity: 'gold' as const },
    { name: 'Team Power 1M', icon: Trophy, rarity: 'primary' as const },
    { name: 'Event Champion', icon: Award, rarity: 'gold' as const },
  ];

  const upgradeRecs: UpgradeRecommendation[] = upgrades.map(rec => ({
    heroId: rec.heroId,
    heroName: rec.heroName,
    reason: rec.reason,
    score: rec.score,
    recommendedLevel: rec.recommendedLevel,
  }));

  return (
    <div className="space-y-6 animate-in pb-8">
      <DashboardHeader
        serverGroup={data.settings.serverGroup}
        mainFaction={data.settings.mainFaction}
        onViewHeroes={() => navigate('/heroes')}
      />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressSection
          totalInfluence={totalInfluence}
          trendPercentage={trendPercentage}
          projectedInfluence={simulation.projectedTotalInfluence}
          resourcePlan={resourcePlan}
        />

        <RecommendationCards
          upgrades={upgradeRecs}
          activeEvents={activeEvents}
          recentAchievements={recentAchievements}
          onNavigate={navigate}
        />

        {/* Quick Actions */}
        <div className="space-y-6">
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
    </div>
  );
};

export default Dashboard;
