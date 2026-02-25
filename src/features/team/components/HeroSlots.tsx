import React from 'react';
import { Queue, UserHero } from '@/shared/types';
import HeroCard from '../../heroes/components/HeroCard';
import { Plus, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface HeroSlotsProps {
  activeQueue: Queue;
  roster: UserHero[];
  onSelectSlot: (index: number) => void;
  updateQueue: (queue: Queue) => void;
}

const HeroSlots: React.FC<HeroSlotsProps> = ({ activeQueue, roster, onSelectSlot, updateQueue }) => {
  const handleRemoveHero = (index: number) => {
    const newIds = [...activeQueue.heroIds];
    newIds[index] = null;
    updateQueue({ ...activeQueue, heroIds: newIds });
  };

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-4">
      {activeQueue.heroIds.map((heroId, index) => {
        const hero = heroId ? roster.find(h => h.id === heroId) : null;
        return (
          <div key={index} className="flex flex-col items-center">
            <div className="text-label-sm text-muted-foreground mb-2 uppercase">Slot {index + 1}</div>
            {hero ? (
              <div className="w-full relative group">
                <div className="transform scale-90 md:scale-100 origin-top">
                  <HeroCard hero={hero} disableLink={true} />
                </div>
                <button
                  onClick={() => handleRemoveHero(index)}
                  className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 shadow-lg hover:bg-error-400 z-10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectSlot(index)}
                className={cn(
                  'w-full aspect-[3/4] rounded-xl transition-all',
                  'border-2 border-dashed border-border hover:border-primary-500',
                  'flex flex-col items-center justify-center',
                  'text-muted-foreground hover:text-primary-400 hover:bg-primary-500/5'
                )}
              >
                <Plus className="w-8 h-8" />
                <span className="mt-2 text-label-sm font-semibold">Select</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HeroSlots;
