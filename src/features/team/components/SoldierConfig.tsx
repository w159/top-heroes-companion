import React from 'react';
import { Queue } from '../../../shared/types';
import { Flag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { cn } from '../../../shared/lib/utils';

interface SoldierConfigProps {
  activeQueue: Queue;
  updateQueue: (queue: Queue) => void;
}

const SoldierConfig: React.FC<SoldierConfigProps> = ({ activeQueue, updateQueue }) => {
  return (
    <Card variant="filled">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Flag className="w-5 h-5 text-primary-400" />
          <h3 className="text-title-lg font-semibold">Soldiers</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-label-sm text-muted-foreground mb-2 block">Soldier Type</label>
            <div className="flex gap-2">
              {['Infantry', 'Archer', 'Mage'].map((type) => (
                <button
                  key={type}
                  onClick={() => updateQueue({ ...activeQueue, soldierType: type as Queue['soldierType'] })}
                  className={cn(
                    'flex-1 py-2.5 rounded-lg border transition-all text-label-lg font-medium',
                    activeQueue.soldierType === type
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-surface-800 border-border text-muted-foreground hover:border-primary-500/50 hover:text-foreground'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-label-sm text-muted-foreground mb-2 block">Soldier Tier (Level)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1" max="12"
                value={activeQueue.soldierTier}
                onChange={(e) => updateQueue({ ...activeQueue, soldierTier: parseInt(e.target.value) })}
                className="flex-1 accent-primary-500"
              />
              <div className="text-headline-sm font-bold w-12 text-center">T{activeQueue.soldierTier}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoldierConfig;
