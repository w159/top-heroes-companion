import React, { useState } from 'react';
import { ArrowLeft, Trophy, Users, Swords, Shield, Heart, Target, TrendingUp, Sparkles, Info, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatRadarChart from './StatRadarChart';
import SkillCardEnhanced from './SkillCardEnhanced';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';

interface Skill {
  name: string;
  type: string;
  description: string;
  tips: string;
}

interface Hero {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  role: string;
  image: string;
  gear_set: string;
  unique_weapon: string;
  positions: string[];
  skills: Skill[];
}

interface UserHeroData {
  id: string;
  level: number;
  stars: number;
  power: number;
}

interface Props {
  hero: Hero;
  userHero?: UserHeroData;
  enhancedData?: any;
  onRecruit?: () => void;
  onUpdate?: (data: Partial<UserHeroData>) => void;
}

const HeroDetailView: React.FC<Props> = ({ hero, userHero, enhancedData, onRecruit }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'build'>('overview');

  const enhanced = enhancedData?.[hero.id];
  const hasEnhancedData = !!enhanced;

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

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      'Mythic': 'text-error-400',
      'Legendary': 'text-gold-400',
      'Epic': 'text-tertiary-400',
      'Rare': 'text-primary-400',
      'Common': 'text-muted-foreground'
    };
    return colors[rarity] || 'text-muted-foreground';
  };

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
          {hasEnhancedData && enhanced.tier?.overall && (
            <div className={cn(
              'absolute -bottom-2 left-1/2 -translate-x-1/2',
              'px-4 py-1.5 rounded-lg shadow-lg',
              'bg-gradient-to-r',
              getTierConfig(enhanced.tier.overall).gradient
            )}>
              <span className="text-title-sm font-bold text-white">
                {enhanced.tier.overall}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-headline-md font-bold mb-1">{hero.name}</h1>
          <p className="text-body-md text-muted-foreground mb-3">
            {hero.faction} • {hero.role}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="default"
              size="sm"
              className={cn('border-transparent', getRarityColor(hero.rarity))}
            >
              {hero.rarity}
            </Badge>
            {hasEnhancedData && enhanced.tier && (
              <>
                <Badge variant="default" size="sm" className="bg-success-500/20 text-success-400 border-success-500/30">
                  PvE: {enhanced.tier.pve}
                </Badge>
                <Badge variant="default" size="sm" className="bg-warning-500/20 text-warning-400 border-warning-500/30">
                  PvP: {enhanced.tier.pvp}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'skills', label: 'Skills', icon: Sparkles },
          { id: 'build', label: 'Build', icon: TrendingUp }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Radar */}
          {hasEnhancedData && enhanced.stats && (
            <Card variant="filled">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-warning-400" />
                  <h2 className="text-title-lg font-semibold">Base Stats</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <StatRadarChart stats={enhanced.stats} size={280} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(enhanced.stats).map(([key, value]) => (
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
          {hasEnhancedData && enhanced.role_rating && (
            <Card variant="filled">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-400" />
                  <h2 className="text-title-lg font-semibold">Role Performance</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(enhanced.role_rating).map(([role, rating]) => (
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
          {hasEnhancedData && (enhanced.synergies || enhanced.counters || enhanced.weak_against) && (
            <Card variant="filled">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Swords className="w-5 h-5 text-tertiary-400" />
                  <h2 className="text-title-lg font-semibold">Team Synergy</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {enhanced.synergies && enhanced.synergies.length > 0 && (
                  <div>
                    <div className="text-label-md font-semibold text-success-400 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Works Well With
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enhanced.synergies.map((hero: string) => (
                        <span key={hero} className="px-3 py-1.5 bg-success-500/15 text-success-400 rounded-lg text-label-sm font-medium">
                          {hero}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {enhanced.counters && enhanced.counters.length > 0 && (
                  <div>
                    <div className="text-label-md font-semibold text-primary-400 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Strong Against
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enhanced.counters.map((hero: string) => (
                        <span key={hero} className="px-3 py-1.5 bg-primary-500/15 text-primary-400 rounded-lg text-label-sm font-medium">
                          {hero}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {enhanced.weak_against && enhanced.weak_against.length > 0 && (
                  <div>
                    <div className="text-label-md font-semibold text-warning-400 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Weak Against
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enhanced.weak_against.map((hero: string) => (
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
          {hasEnhancedData && enhanced.positioning && (
            <Card variant="filled" className="border-primary-500/30 bg-primary-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-primary-400" />
                  <span className="text-title-sm font-semibold text-primary-400">Optimal Position</span>
                </div>
                <p className="text-body-md text-primary-300">{enhanced.positioning}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          {hasEnhancedData && enhanced.skills_enhanced ? (
            enhanced.skills_enhanced.map((skill: any, index: number) => (
              <SkillCardEnhanced key={index} skill={skill} index={index} />
            ))
          ) : (
            hero.skills.map((skill, index) => (
              <Card key={index} variant="filled">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-title-md font-semibold">{skill.name}</h3>
                    <Badge variant="primary" size="sm">{skill.type}</Badge>
                  </div>
                  <p className="text-body-md text-muted-foreground mb-3">
                    {skill.description || 'No description available.'}
                  </p>
                  {skill.tips && (
                    <div className="bg-surface-800/50 rounded-lg p-3">
                      <p className="text-body-sm text-muted-foreground italic flex items-start gap-2">
                        <Zap className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                        {skill.tips}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
          {hero.skills.length === 0 && !hasEnhancedData && (
            <Card variant="outlined" className="text-center py-12">
              <p className="text-body-md text-muted-foreground italic">No skill data available.</p>
            </Card>
          )}
        </div>
      )}

      {/* Build Tab */}
      {activeTab === 'build' && (
        <div className="space-y-6">
          {/* Best Gear */}
          {hasEnhancedData && enhanced.best_with && (
            <Card variant="filled">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-success-400" />
                  <h2 className="text-title-lg font-semibold">Recommended Build</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhanced.best_with.gear && (
                  <div>
                    <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Gear Set</div>
                    <div className="bg-success-500/15 text-success-400 border border-success-500/30 rounded-lg p-3 text-title-sm font-semibold">
                      {enhanced.best_with.gear}
                    </div>
                  </div>
                )}

                {enhanced.best_with.weapon && (
                  <div>
                    <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Weapon</div>
                    <div className="bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-lg p-3 text-title-sm font-semibold">
                      {enhanced.best_with.weapon}
                    </div>
                  </div>
                )}

                {enhanced.best_with.pet && (
                  <div>
                    <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Pet</div>
                    <div className="bg-tertiary-500/15 text-tertiary-400 border border-tertiary-500/30 rounded-lg p-3 text-title-sm font-semibold">
                      {enhanced.best_with.pet}
                    </div>
                  </div>
                )}

                {enhanced.best_with.relics && enhanced.best_with.relics.length > 0 && (
                  <div>
                    <div className="text-label-sm text-muted-foreground uppercase mb-2 font-semibold">Best Relics</div>
                    <div className="space-y-2">
                      {enhanced.best_with.relics.map((relic: string, idx: number) => (
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
          {hasEnhancedData && enhanced.skill_priority && (
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
                  {enhanced.skill_priority.map((priority: number, idx: number) => (
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
          {!hasEnhancedData && (
            <Card variant="filled">
              <CardHeader className="pb-2">
                <h2 className="text-title-lg font-semibold">Basic Info</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-label-sm text-muted-foreground mb-1">Gear Set</div>
                  <div className="text-title-md font-semibold">{hero.gear_set}</div>
                </div>
                <div>
                  <div className="text-label-sm text-muted-foreground mb-1">Unique Weapon</div>
                  <div className="text-title-md font-semibold">{hero.unique_weapon || 'None'}</div>
                </div>
                <div>
                  <div className="text-label-sm text-muted-foreground mb-1">Positions</div>
                  <div className="text-title-md font-semibold">
                    {hero.positions.join(', ') || 'Any'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroDetailView;
