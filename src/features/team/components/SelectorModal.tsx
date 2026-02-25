import React from 'react';
import { UserHero, Queue, RelicType } from '@/shared/types';
import { PETS, RELICS, SKINS } from '@/shared/types/constants';
import { isHeroUsedElsewhere, isPetUsedElsewhere, isRelicUsedElsewhere } from '@/shared/utils';
import { SelectorType } from '../hooks/useTeamBuilder';
import ItemImage from './ItemImage';
import HeroCard from '../../heroes/components/HeroCard';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';

interface SelectorModalProps {
  selectorType: SelectorType;
  relicSlotType: RelicType | null;
  activeQueueId: number;
  activeQueue: Queue;
  roster: UserHero[];
  allQueues: Queue[];
  onHeroSelect: (hero: UserHero) => void;
  onPetSelect: (petId: string) => void;
  onRelicSelect: (relicId: string) => void;
  onSkinSelect: (skinId: string, type: 'Castle' | 'March') => void;
  onClose: () => void;
}

const SelectorModal: React.FC<SelectorModalProps> = ({
  selectorType,
  relicSlotType,
  activeQueueId,
  activeQueue,
  roster,
  allQueues,
  onHeroSelect,
  onPetSelect,
  onRelicSelect,
  onSkinSelect,
  onClose,
}) => {
  if (!selectorType) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in">
      <Card variant="elevated" className="w-full max-w-4xl h-[85vh] flex flex-col">
        <CardHeader className="border-b border-border flex-shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-title-lg font-semibold capitalize">
              Select {selectorType} {relicSlotType ? `(${relicSlotType})` : ''}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">

          {/* Hero Selection */}
          {selectorType === 'hero' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {roster.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No heroes in roster. Go to Database to add some!
                </div>
              ) : (
                roster.map(hero => {
                  const isUsed = isHeroUsedElsewhere(hero.id, activeQueueId, allQueues);
                  const isCurrent = activeQueue.heroIds.includes(hero.id);

                  return (
                    <div
                      key={hero.id}
                      className={cn(
                        'relative transition-all',
                        isUsed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]',
                        isCurrent && 'ring-2 ring-success-500 rounded-xl'
                      )}
                      onClick={() => !isUsed && onHeroSelect(hero)}
                    >
                      <HeroCard hero={hero} disableLink={true} />
                      {isUsed && (
                        <div className="absolute inset-0 bg-surface-900/70 flex items-center justify-center rounded-xl backdrop-blur-sm">
                          <Badge variant="error" size="sm">Used Elsewhere</Badge>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Pet Selection */}
          {selectorType === 'pet' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PETS.map(pet => {
                const isUsed = isPetUsedElsewhere(pet.id, activeQueueId, allQueues);
                return (
                  <Card
                    key={pet.id}
                    variant={isUsed ? 'outlined' : 'filled'}
                    interactive={!isUsed}
                    onClick={() => !isUsed && onPetSelect(pet.id)}
                    className={cn(
                      isUsed && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-800 flex-shrink-0">
                        <ItemImage name={pet.name} className="w-full h-full rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-title-md font-semibold">{pet.name}</h4>
                          <Badge variant="success" size="sm">{pet.rarity}</Badge>
                        </div>
                        <p className="text-body-sm text-muted-foreground mt-1 line-clamp-2">{pet.description}</p>
                        <div className="mt-2 text-label-sm text-primary-400">
                          <span className="font-semibold">Skill:</span> {pet.skillName}
                        </div>
                      </div>
                      {isUsed && <Badge variant="error" size="sm">In Use</Badge>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Relic Selection */}
          {selectorType === 'relic' && relicSlotType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RELICS.filter(r => r.type === relicSlotType).map(relic => {
                const isUsed = isRelicUsedElsewhere(relic.id, activeQueueId, allQueues);
                return (
                  <Card
                    key={relic.id}
                    variant={isUsed ? 'outlined' : 'filled'}
                    interactive={!isUsed}
                    onClick={() => !isUsed && onRelicSelect(relic.id)}
                    className={cn(
                      isUsed && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-800 flex-shrink-0">
                        <ItemImage name={relic.name} className="w-full h-full rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-title-md font-semibold">{relic.name}</h4>
                          <Badge variant="default" size="sm" className="bg-tertiary-500/20 text-tertiary-400 border-tertiary-500/30">
                            {relic.rarity}
                          </Badge>
                        </div>
                        <p className="text-body-sm text-muted-foreground mt-1">{relic.description}</p>
                        <div className="mt-2">
                          <Badge variant="success" size="sm">{relic.statBonus}</Badge>
                        </div>
                      </div>
                      {isUsed && <Badge variant="error" size="sm">In Use</Badge>}
                    </CardContent>
                  </Card>
                );
              })}
              {RELICS.filter(r => r.type === relicSlotType).length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No relics found for {relicSlotType} slot.
                </div>
              )}
            </div>
          )}

          {/* Skin Selection */}
          {(selectorType === 'castle' || selectorType === 'march') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKINS.filter(s => s.type === (selectorType === 'castle' ? 'Castle' : 'March')).map(skin => (
                <Card
                  key={skin.id}
                  variant="filled"
                  interactive
                  onClick={() => onSkinSelect(skin.id, skin.type)}
                >
                  <CardContent className="p-4">
                    <h4 className="text-title-md font-semibold">{skin.name}</h4>
                    <Badge variant="primary" size="sm" className="mt-2">{skin.type} Skin</Badge>
                    <p className="text-label-sm text-success-400 mt-2">{skin.bonus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default SelectorModal;
