import React from 'react';
import { Target, Gem, Star, Sparkles, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';

interface RelicSet {
  name: string;
  faction: string;
  focus: string;
  relics: { name: string; type: string; effect: string }[];
  f2pAlternative?: string[];
}

const relicSets: RelicSet[] = [
  {
    name: 'Oath of Sacred Forest',
    faction: 'Nature',
    focus: 'Survival + CC',
    relics: [
      { name: 'Undefeated Crown', type: 'Defense', effect: 'Shelter of Nature - reduces max damage, heals team' },
      { name: 'Vineborn Bow', type: 'Attack', effect: 'Entangle CC - +10% damage per Nature hero (max 60%)' },
      { name: 'Sacred Scroll', type: 'Utility', effect: 'Shield + Damage Reduction + Shield Breaker' }
    ],
    f2pAlternative: ['Frost Diadem', "Marshal's Warhorn", 'Eternal Wings']
  },
  {
    name: 'Arcane Vault',
    faction: 'League',
    focus: 'Control + Skill Damage',
    relics: [
      { name: 'Petrification Staff', type: 'Control', effect: 'Petrify CC + Overall damage increase' },
      { name: 'Soul Guard Orb', type: 'Defense', effect: 'Resist - caps max damage, provides shield' },
      { name: 'Feather of Pact', type: 'Buffs', effect: 'Shield value increase + Block Break' }
    ],
    f2pAlternative: ['Petrification Staff', 'Moonstone', 'Scale of Injustice']
  },
  {
    name: "Dragon's Might",
    faction: 'Horde',
    focus: 'Raw Damage + Shield Break',
    relics: [
      { name: 'Thunder Judgment', type: 'AoE', effect: 'Thunderbind CC - prevents movement/skills' },
      { name: 'Dragon Heart', type: 'Defense', effect: 'Indomitable - caps damage, heals team' },
      { name: 'Dragon Bone Amulet', type: 'Utility', effect: 'Various buffs' }
    ],
    f2pAlternative: ['Duke Signet', 'Eternal Wings', "Marshal's Warhorn"]
  }
];

const factionConfig: Record<string, { bgClass: string; textClass: string; borderClass: string; badgeBg: string }> = {
  'League': {
    bgClass: 'bg-primary-500/10',
    textClass: 'text-primary-400',
    borderClass: 'border-l-primary-500',
    badgeBg: 'bg-primary-500'
  },
  'Nature': {
    bgClass: 'bg-success-500/10',
    textClass: 'text-success-400',
    borderClass: 'border-l-success-500',
    badgeBg: 'bg-success-500'
  },
  'Horde': {
    bgClass: 'bg-error-500/10',
    textClass: 'text-error-400',
    borderClass: 'border-l-error-500',
    badgeBg: 'bg-error-500'
  }
};

const Relics: React.FC = () => {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
          <Gem className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Relic Sets Guide</h1>
          <p className="text-body-md text-muted-foreground">
            Max ONE relic at a time - 5★ Epic beats 1★ Legendary!
          </p>
        </div>
      </div>

      {/* Strategy Tips */}
      <Card variant="filled" className="border-2 border-primary-500/30 bg-primary-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Relic Strategy</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Focus one relic to max stars', desc: 'Before moving to the next' },
              { label: 'Match your faction\'s set', desc: 'For best synergy' },
              { label: 'Buy from Guild Store', desc: 'Daily - mandatory for progression' },
              { label: 'Legion Boss hits', desc: 'For random relic shards' }
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

      {/* Relic Set Cards */}
      {relicSets.map((set) => {
        const config = factionConfig[set.faction];
        return (
          <Card
            key={set.name}
            variant="filled"
            className={cn('overflow-hidden border-l-4', config.borderClass)}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-title-lg font-semibold">{set.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant="default"
                      size="sm"
                      className={cn(config.badgeBg, 'text-white border-transparent')}
                    >
                      {set.faction}
                    </Badge>
                    <span className="text-body-sm text-muted-foreground">{set.focus}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Relics List */}
              <div className="space-y-3">
                {set.relics.map((relic, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-surface-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                      <Gem className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-title-sm font-semibold">{relic.name}</span>
                        <Badge
                          variant="default"
                          size="sm"
                          className="bg-surface-700 text-muted-foreground border-transparent"
                        >
                          {relic.type}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-muted-foreground">{relic.effect}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* F2P Alternative */}
              {set.f2pAlternative && (
                <div className="pt-4 border-t border-border">
                  <h4 className="text-label-md font-semibold text-success-400 mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    F2P Alternative
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {set.f2pAlternative.map((relic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-success-500/15 text-success-400 rounded-lg text-label-sm"
                      >
                        {relic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Starter Kit */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-gold-400" />
            <h2 className="text-title-lg font-semibold">Starter Relic Kit (All Factions)</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-body-md text-muted-foreground mb-4">
            Easy to obtain, universally useful:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Duke's Ring", desc: 'Solid all-around stats' },
              { name: "Philosopher's Stone", desc: 'Healing + HP regen' },
              { name: "Marshal's Warhorn", desc: 'Team attack speed boost' }
            ].map((relic, idx) => (
              <div
                key={idx}
                className="bg-surface-800/50 rounded-xl p-4 border border-border"
              >
                <span className="block text-title-sm font-semibold text-gold-400 mb-1">
                  {relic.name}
                </span>
                <span className="text-body-sm text-muted-foreground">
                  {relic.desc}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relics;
