import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Info, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { cn, getRarityColor } from '../../../shared/lib/utils';
import { Hero, UserHero } from '../../../shared/types';
import HeroOverviewTab from './HeroOverviewTab';
import HeroSkillsTab from './HeroSkillsTab';
import HeroBuildTab from './HeroBuildTab';

interface Props {
  hero: Hero;
  userHero?: UserHero;
  detailData?: Record<string, HeroDetailEntry>;
  onRecruit?: () => void;
  onUpdate?: (data: Partial<UserHero>) => void;
}

interface HeroDetailEntry {
  stats?: Record<string, number>;
  tier?: { overall: string; pve: string; pvp: string; boss?: string };
  role_rating?: Record<string, number>;
  synergies?: string[];
  counters?: string[];
  weak_against?: string[];
  positioning?: string;
  skills_enhanced?: Array<{
    name: string;
    type: string;
    description?: string;
    tips?: string;
    cooldown?: number;
    energy?: number;
    damage_type?: string;
    range?: string;
    scaling?: string;
    targets?: string;
    effects?: string[];
    icon?: string;
  }>;
  best_with?: {
    gear?: string;
    weapon?: string;
    pet?: string;
    relics?: string[];
  };
  skill_priority?: number[];
}

type DetailTab = 'overview' | 'skills' | 'build';

const HeroDetailView: React.FC<Props> = ({ hero, userHero, detailData, onRecruit }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const detail = detailData?.[hero.id];
  const hasDetailData = !!detail;

  // Tier color mapping
  const getTierConfig = (tier: string) => {
    const configs: Record<string, { bg: string; text: string; gradient: string }> = {
      'S+': { bg: 'bg-error-500', text: 'text-white', gradient: 'from-error-500 to-error-600' },
      'S': { bg: 'bg-warning-500', text: 'text-white', gradient: 'from-warning-500 to-warning-600' },
      'A+': { bg: 'bg-gold-500', text: 'text-surface-900', gradient: 'from-gold-500 to-gold-600' },
      'A': { bg: 'bg-success-500', text: 'text-white', gradient: 'from-success-500 to-success-600' },
      'B': { bg: 'bg-primary-500', text: 'text-white', gradient: 'from-primary-500 to-primary-600' },
      'C': { bg: 'bg-tertiary-500', text: 'text-white', gradient: 'from-tertiary-500 to-tertiary-600' },
      'D': { bg: 'bg-surface-600', text: 'text-muted-foreground', gradient: 'from-surface-600 to-surface-700' }
    };
    return configs[tier] || configs['D'];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'build', label: 'Build', icon: TrendingUp },
  ] as const;

  return (
    <div className="animate-in pb-20">
      {/* Sticky Header */}
      <div className={cn(
        'sticky top-0 z-50 -mx-4 px-4 py-3 mb-6',
        'bg-surface-900/95 backdrop-blur-lg border-b border-border'
      )}>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-primary-400 hover:text-primary-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          {userHero ? (
            <Badge variant="success" size="md">
              <CheckCircle className="w-4 h-4" />
              In Roster
            </Badge>
          ) : (
            <Button variant="filled" size="sm" onClick={onRecruit}>
              Recruit
            </Button>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="flex gap-5 mb-6">
        <div className="relative flex-shrink-0">
          <div className={cn(
            'w-28 h-28 rounded-2xl overflow-hidden',
            'ring-2 ring-border shadow-xl'
          )}>
            <img
              src={hero.image || hero.imageUrl || '/img/heroes/placeholder.png'}
              alt={hero.name}
              className="w-full h-full object-cover bg-surface-800"
              onError={(e) => { e.currentTarget.src = '/img/heroes/placeholder.png'; }}
            />
          </div>
          {hasDetailData && detail.tier?.overall && (
            <div className={cn(
              'absolute -bottom-2 left-1/2 -translate-x-1/2',
              'px-4 py-1.5 rounded-lg shadow-lg',
              'bg-gradient-to-r',
              getTierConfig(detail.tier.overall).gradient
            )}>
              <span className="text-title-sm font-bold text-white">
                {detail.tier.overall}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold mb-1">{hero.name}</h1>
          <p className="text-body-md text-muted-foreground mb-3">
            {hero.faction} &bull; {hero.role}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="default"
              size="sm"
              className={cn('border-transparent', getRarityColor(hero.rarity))}
            >
              {hero.rarity}
            </Badge>
            {hasDetailData && detail.tier && (
              <>
                <Badge variant="default" size="sm" className="bg-success-500/20 text-success-400 border-success-500/30">
                  PvE: {detail.tier.pve}
                </Badge>
                <Badge variant="default" size="sm" className="bg-warning-500/20 text-warning-400 border-warning-500/30">
                  PvP: {detail.tier.pvp}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DetailTab)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3',
                'text-label-lg font-semibold transition-all',
                'border-b-2 -mb-[1px]',
                isActive
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <HeroOverviewTab detail={detail} hasDetailData={hasDetailData} />
      )}

      {activeTab === 'skills' && (
        <HeroSkillsTab
          detailSkills={detail?.skills_enhanced}
          basicSkills={hero.skills}
          hasDetailData={hasDetailData}
        />
      )}

      {activeTab === 'build' && (
        <HeroBuildTab
          bestWith={detail?.best_with}
          skillPriority={detail?.skill_priority}
          hasDetailData={hasDetailData}
          basicInfo={{
            gearSet: hero.gear_set,
            uniqueWeapon: hero.unique_weapon,
            positions: hero.positions,
          }}
        />
      )}
    </div>
  );
};

export default HeroDetailView;
