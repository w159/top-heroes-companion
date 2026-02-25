import React from 'react';
import { Queue, RelicType } from '@/shared/types';
import { RELICS } from '@/shared/types/constants';
import ItemImage from './ItemImage';
import { Plus, X, Gem, Crosshair, Shield, HelpingHand } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';

interface RelicSlotsProps {
  activeQueue: Queue;
  updateQueue: (queue: Queue) => void;
  onSelectRelic: (type: RelicType) => void;
}

const RELIC_TYPE_CONFIG: Record<RelicType, { Icon: typeof Gem; iconColor: string }> = {
  Attack: { Icon: Crosshair, iconColor: 'text-error-400' },
  Defense: { Icon: Shield, iconColor: 'text-primary-400' },
  Assist: { Icon: HelpingHand, iconColor: 'text-success-400' },
};

const RelicSlots: React.FC<RelicSlotsProps> = ({ activeQueue, updateQueue, onSelectRelic }) => {
  const handleRemoveRelic = (type: RelicType) => {
    const newRelics = { ...activeQueue.relics };
    newRelics[type] = null;
    updateQueue({ ...activeQueue, relics: newRelics });
  };

  const handleLevelChange = (type: RelicType, value: string) => {
    const newRelics = { ...activeQueue.relics };
    if (newRelics[type]) {
      newRelics[type]!.level = parseInt(value) || 1;
      updateQueue({ ...activeQueue, relics: newRelics });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(['Attack', 'Defense', 'Assist'] as RelicType[]).map(type => {
        const relicEntry = activeQueue.relics[type];
        const relic = relicEntry ? RELICS.find(r => r.id === relicEntry.id) : null;
        const { Icon, iconColor } = RELIC_TYPE_CONFIG[type];

        return (
          <Card key={type} variant="filled" className="flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('flex items-center gap-2 text-label-md font-semibold uppercase', iconColor)}>
                  <Icon className="w-4 h-4" /> {type}
                </div>
                {relic && (
                  <button
                    onClick={() => handleRemoveRelic(type)}
                    className="text-muted-foreground hover:text-error-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {relic ? (
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-tertiary-500/10 border border-tertiary-500/30 p-1 flex-shrink-0">
                      <ItemImage name={relic.name} className="w-full h-full rounded" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-title-sm font-semibold truncate">{relic.name}</h4>
                      <Badge variant="default" size="sm" className="bg-tertiary-500/20 text-tertiary-400 border-tertiary-500/30">
                        {relic.rarity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-body-sm text-muted-foreground line-clamp-2 h-10 mb-3">{relic.statBonus}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-label-sm text-muted-foreground">Lv:</span>
                    <input
                      type="number"
                      min="1" max="100"
                      value={relicEntry!.level}
                      onChange={(e) => handleLevelChange(type, e.target.value)}
                      className="w-14 h-8 px-2 bg-surface-800 border border-border rounded-lg text-label-md text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onSelectRelic(type)}
                  className={cn(
                    'flex-1 border-2 border-dashed border-border rounded-xl',
                    'hover:border-tertiary-500 hover:text-tertiary-400 hover:bg-tertiary-500/5',
                    'flex flex-col items-center justify-center min-h-[100px] transition-all',
                    'text-muted-foreground'
                  )}
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-label-sm">Select {type}</span>
                </button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RelicSlots;
