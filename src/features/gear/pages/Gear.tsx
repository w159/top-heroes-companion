import React from 'react';
import { Shield, Sword, Zap, Heart, Target, Sparkles, TrendingUp, Star, Package } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';

interface GearSet {
  name: string;
  shortName: string;
  attackBonus: string;
  hpBonus: string;
  special: string;
  bestFor: string[];
  color: string;
  gradient: string;
}

const gearSets: GearSet[] = [
  {
    name: 'Glory of the Knight',
    shortName: 'Knight',
    attackBonus: '+40%',
    hpBonus: '+80%',
    special: 'Skill Damage +8%',
    bestFor: ['Pyromancer', 'Paragon', 'Bishop', 'Pixie', 'Artificer'],
    color: 'tertiary',
    gradient: 'from-tertiary-500 to-tertiary-600'
  },
  {
    name: 'Fury of Blood',
    shortName: 'Blood',
    attackBonus: '-',
    hpBonus: '+160%',
    special: 'Damage Reduction +6%',
    bestFor: ['All Tanks', 'All Healers', 'Adjudicator', 'Forest Maiden', 'Witch'],
    color: 'error',
    gradient: 'from-error-500 to-error-600'
  },
  {
    name: "Titan's Might",
    shortName: 'Titan',
    attackBonus: '+80%',
    hpBonus: '-',
    special: 'Damage Increase +6%',
    bestFor: ['Wanderer', 'Storm Maiden', 'Tidecaller', 'Astrologer'],
    color: 'gold',
    gradient: 'from-gold-500 to-gold-600'
  }
];

const gearSlots = [
  { name: 'Sword', icon: Sword, stat: 'Attack', bonus: 'Critical Attack' },
  { name: 'Boots', icon: Zap, stat: 'Attack', bonus: 'Critical Attack' },
  { name: 'Helmet', icon: Shield, stat: 'HP', bonus: 'Block Chance' },
  { name: 'Chest', icon: Heart, stat: 'HP', bonus: 'Block Chance' }
];

const Gear: React.FC = () => {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-tertiary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Package className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Gear Sets Guide</h1>
          <p className="text-body-md text-muted-foreground">
            Match gear to hero role for maximum effectiveness
          </p>
        </div>
      </div>

      {/* Quick Reference */}
      <Card variant="filled" className="border-2 border-primary-500/30 bg-primary-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Quick Reference</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl">
              <Badge variant="default" className="bg-tertiary-500/20 text-tertiary-400 border-tertiary-500/30">Knight</Badge>
              <span className="text-body-sm text-muted-foreground">→ Skill-based DPS</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl">
              <Badge variant="default" className="bg-error-500/20 text-error-400 border-error-500/30">Blood</Badge>
              <span className="text-body-sm text-muted-foreground">→ Tanks & Healers</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl">
              <Badge variant="default" className="bg-gold-500/20 text-gold-400 border-gold-500/30">Titan</Badge>
              <span className="text-body-sm text-muted-foreground">→ Flat Attack DPS</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gear Set Cards */}
      <div>
        <h2 className="text-title-lg font-semibold mb-4">Gear Sets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gearSets.map((set) => (
            <Card
              key={set.name}
              variant="filled"
              className={cn(
                'overflow-hidden border-t-4',
                set.color === 'tertiary' && 'border-t-tertiary-500',
                set.color === 'error' && 'border-t-error-500',
                set.color === 'gold' && 'border-t-gold-500'
              )}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-title-md font-semibold">{set.name}</h3>
                  <Badge
                    variant="default"
                    className={cn(
                      set.color === 'tertiary' && 'bg-tertiary-500/20 text-tertiary-400 border-tertiary-500/30',
                      set.color === 'error' && 'bg-error-500/20 text-error-400 border-error-500/30',
                      set.color === 'gold' && 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                    )}
                  >
                    {set.shortName}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-body-sm text-muted-foreground">Attack</span>
                    <span className="text-title-sm font-semibold">{set.attackBonus}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-body-sm text-muted-foreground">HP</span>
                    <span className="text-title-sm font-semibold">{set.hpBonus}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-body-sm text-muted-foreground">Special</span>
                    <span className="text-title-sm font-semibold text-gold-400">{set.special}</span>
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <p className="text-label-sm text-muted-foreground mb-2">Best For:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {set.bestFor.map((hero, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-surface-700 rounded-md text-label-sm"
                      >
                        {hero}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gear Slots */}
      <div>
        <h2 className="text-title-lg font-semibold mb-4">Gear Slots</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gearSlots.map((slot) => {
            const SlotIcon = slot.icon;
            return (
              <Card key={slot.name} variant="filled" className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <SlotIcon className="w-5 h-5 text-primary-400" />
                  </div>
                  <span className="text-title-sm font-semibold">{slot.name}</span>
                </div>
                <div className="space-y-1 text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary:</span>
                    <span>{slot.stat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus:</span>
                    <span>{slot.bonus}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Strategy */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-success-400" />
            <h2 className="text-title-lg font-semibold">Upgrade Strategy</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Level in 10s', desc: 'Extra buffs unlock at Lv 10, 20, 30, 40' },
              { label: 'Enhancement Master', desc: 'Keep all 4 pieces at same level for bonus' },
              { label: 'Titan Marks', desc: 'Add +30% faction-specific bonuses from Guild Vault' },
              { label: 'Promotion', desc: 'Unlocks at Lv 40, requires Legendary/Mythic Promotion Stones' }
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

      {/* Priority Order */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">Upgrade Priority</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-800/50 rounded-xl p-4">
              <h3 className="text-title-sm font-semibold text-primary-400 mb-3">For DPS/Healers</h3>
              <ol className="space-y-2">
                {['Sword (max attack)', 'Boots (secondary attack)', 'Helmet/Chest (survival)'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-body-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-label-sm font-bold text-primary-400">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-surface-800/50 rounded-xl p-4">
              <h3 className="text-title-sm font-semibold text-error-400 mb-3">For Tanks</h3>
              <ol className="space-y-2">
                {['Helmet (max HP)', 'Chest (secondary HP)', 'Sword/Boots (minor damage)'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-body-sm">
                    <span className="w-6 h-6 rounded-full bg-error-500/20 flex items-center justify-center text-label-sm font-bold text-error-400">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gear;
