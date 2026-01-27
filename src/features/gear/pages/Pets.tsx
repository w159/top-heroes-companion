import React from 'react';
import { Target, Star, TrendingUp, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';

interface PetInfo {
  name: string;
  faction: string;
  tier: string;
  specialty: string;
  recommendation: string;
}

const pets: PetInfo[] = [
  // League Pets
  {
    name: 'Eggy',
    faction: 'League',
    tier: 'S-Tier',
    specialty: 'Critical Rate buffs that scale with team',
    recommendation: 'Best in Slot for League. Focus 100% of Pet Food here.'
  },
  {
    name: 'Zappy',
    faction: 'League',
    tier: 'B-Tier',
    specialty: 'AoE damage focus',
    recommendation: 'Alternative if Eggy unavailable'
  },
  {
    name: 'CandiBoo',
    faction: 'League',
    tier: 'B-Tier',
    specialty: 'Season 3 option',
    recommendation: 'Good for S3 content'
  },
  // Nature Pets
  {
    name: 'Cactini',
    faction: 'Nature',
    tier: 'S-Tier',
    specialty: 'Superior stat scaling for sustain meta',
    recommendation: 'Best in Slot for Nature. Essential for late-game.'
  },
  {
    name: 'Sproutfang',
    faction: 'Nature',
    tier: 'B-Tier',
    specialty: 'Alternative damage option',
    recommendation: 'Secondary choice'
  },
  {
    name: 'Bear',
    faction: 'Nature',
    tier: 'C-Tier',
    specialty: 'Generic stats',
    recommendation: 'F2P fallback only'
  },
  // Horde Pets
  {
    name: 'Flickerkit',
    faction: 'Horde',
    tier: 'S-Tier',
    specialty: 'All Horde Hero Attack/HP bonuses',
    recommendation: 'Best in Slot (P2W) - hard to obtain for F2P'
  },
  {
    name: 'Howli (Wolf)',
    faction: 'Horde',
    tier: 'A-Tier',
    specialty: 'Balanced stats and effects',
    recommendation: 'Best F2P Alternative for Horde'
  }
];

const factionConfig: Record<string, { color: string; bgClass: string; textClass: string; borderClass: string }> = {
  'League': {
    color: 'primary',
    bgClass: 'bg-primary-500/20',
    textClass: 'text-primary-400',
    borderClass: 'border-l-primary-500'
  },
  'Nature': {
    color: 'success',
    bgClass: 'bg-success-500/20',
    textClass: 'text-success-400',
    borderClass: 'border-l-success-500'
  },
  'Horde': {
    color: 'error',
    bgClass: 'bg-error-500/20',
    textClass: 'text-error-400',
    borderClass: 'border-l-error-500'
  }
};

const tierConfig: Record<string, { bgClass: string; textClass: string }> = {
  'S-Tier': { bgClass: 'bg-gold-500/20', textClass: 'text-gold-400' },
  'A-Tier': { bgClass: 'bg-warning-500/20', textClass: 'text-warning-400' },
  'B-Tier': { bgClass: 'bg-primary-500/20', textClass: 'text-primary-400' },
  'C-Tier': { bgClass: 'bg-surface-600', textClass: 'text-muted-foreground' }
};

const Pets: React.FC = () => {
  const groupByFaction = (pets: PetInfo[]) => {
    return pets.reduce((acc, pet) => {
      if (!acc[pet.faction]) acc[pet.faction] = [];
      acc[pet.faction].push(pet);
      return acc;
    }, {} as Record<string, PetInfo[]>);
  };

  const groupedPets = groupByFaction(pets);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tertiary-500 to-tertiary-600 flex items-center justify-center shadow-lg shadow-tertiary-500/30">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Pet Guide</h1>
          <p className="text-body-md text-muted-foreground">
            Focus 100% of Pet Food on ONE pet matching your main faction
          </p>
        </div>
      </div>

      {/* Strategy Tips */}
      <Card variant="filled" className="border-2 border-primary-500/30 bg-primary-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Pet Strategy</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Focus on ONE pet', desc: 'A Level 100+ pet beats multiple Level 30 pets' },
              { label: 'Match your faction', desc: 'Faction bonuses are massive' },
              { label: 'Save Pet Essence', desc: 'Only use for Mythic promotion at Level 120' },
              { label: 'Complete Pet Rush events', desc: 'Primary source of Pet Essence' }
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-surface-800/50 rounded-lg">
                <Sparkles className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-title-sm">{tip.label}:</span>
                  <span className="text-body-sm text-muted-foreground ml-2">{tip.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pet Cards by Faction */}
      {Object.entries(groupedPets).map(([faction, factionPets]) => {
        const config = factionConfig[faction];
        return (
          <div key={faction}>
            <h2 className={cn('text-title-lg font-semibold mb-4', config.textClass)}>
              {faction} Pets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {factionPets.map((pet) => {
                const tier = tierConfig[pet.tier] || tierConfig['C-Tier'];
                return (
                  <Card
                    key={pet.name}
                    variant="filled"
                    className={cn(
                      'overflow-hidden border-l-4 hover:scale-[1.02] transition-transform',
                      config.borderClass
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold',
                          'bg-gradient-to-br from-primary-500 to-tertiary-500 text-white'
                        )}>
                          {pet.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-title-md font-semibold truncate">{pet.name}</h3>
                          <Badge
                            variant="default"
                            size="sm"
                            className={cn(tier.bgClass, tier.textClass, 'border-transparent')}
                          >
                            {pet.tier}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-body-sm text-muted-foreground mb-2">{pet.specialty}</p>
                      <p className="text-label-sm text-success-400 flex items-start gap-2">
                        <Star className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {pet.recommendation}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Level Milestones */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            <h2 className="text-title-lg font-semibold">Level Milestones</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { level: 'Lv 30', unlock: 'Star upgrades unlock' },
              { level: 'Lv 60', unlock: 'Significant stat boost' },
              { level: 'Lv 100', unlock: 'Major power spike' },
              { level: 'Lv 120', unlock: 'Mythic promotion available' }
            ].map((milestone, idx) => (
              <div
                key={idx}
                className="bg-surface-800/50 rounded-xl p-4 text-center border border-border"
              >
                <span className="block text-title-lg font-bold text-gold-400 mb-1">
                  {milestone.level}
                </span>
                <span className="text-label-sm text-muted-foreground">
                  {milestone.unlock}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pets;
