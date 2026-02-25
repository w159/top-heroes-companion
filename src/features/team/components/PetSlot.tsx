import React from 'react';
import { Queue } from '@/shared/types';
import { PETS } from '@/shared/types/constants';
import ItemImage from './ItemImage';
import { Heart, X, Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/components/card';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';

interface PetSlotProps {
  activeQueue: Queue;
  updateQueue: (queue: Queue) => void;
  onSelectPet: () => void;
}

const PetSlot: React.FC<PetSlotProps> = ({ activeQueue, updateQueue, onSelectPet }) => {
  const pet = activeQueue.petId ? PETS.find(p => p.id === activeQueue.petId) : null;

  return (
    <Card variant="filled" className="flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-success-400" />
            <h4 className="text-title-lg font-semibold">Pet Companion</h4>
          </div>
          {activeQueue.petId && (
            <button
              onClick={() => updateQueue({ ...activeQueue, petId: null })}
              className="text-error-400 hover:text-error-300 text-label-sm flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          )}
        </div>
        {pet ? (
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-success-500/10 border border-success-500/30 p-1 flex-shrink-0">
              <ItemImage name={pet.name} className="w-full h-full rounded-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="text-title-md font-semibold truncate">{pet.name}</h3>
                <Badge variant="success" size="sm">{pet.rarity}</Badge>
              </div>
              <p className="text-body-sm text-muted-foreground line-clamp-2">{pet.description}</p>
              <div className="mt-2 bg-surface-800/50 p-2 rounded-lg">
                <span className="text-label-sm text-primary-400 font-semibold block">{pet.skillName}</span>
                <span className="text-body-sm text-muted-foreground line-clamp-2">{pet.skillDescription}</span>
              </div>
              <div className="mt-3 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-label-sm text-muted-foreground mb-1">Level (Max 90)</span>
                  <input
                    type="number"
                    min="1" max="90"
                    value={activeQueue.petLevel || 1}
                    onChange={(e) => updateQueue({ ...activeQueue, petLevel: Math.min(90, Math.max(1, parseInt(e.target.value) || 1)) })}
                    className="w-20 h-9 px-2 bg-surface-800 border border-border rounded-lg text-label-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-label-sm text-muted-foreground mb-1">Stars</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1" max="10"
                      value={activeQueue.petStars || 1}
                      onChange={(e) => updateQueue({ ...activeQueue, petStars: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                      className="w-16 h-9 px-2 bg-surface-800 border border-border rounded-lg text-label-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Star className="w-5 h-5 text-gold-400" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onSelectPet}
            className={cn(
              'flex-1 border-2 border-dashed border-border rounded-xl',
              'hover:border-success-500 hover:text-success-400 hover:bg-success-500/5',
              'flex flex-col items-center justify-center min-h-[140px] transition-all',
              'text-muted-foreground'
            )}
          >
            <Heart className="w-8 h-8 mb-2" />
            <span className="text-label-md">Assign Pet</span>
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default PetSlot;
