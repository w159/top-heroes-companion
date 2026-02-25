import React from 'react';
import { Queue } from '../../../shared/types';
import { SKINS } from '../../../shared/types/constants';
import { Castle, Flag } from 'lucide-react';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { SelectorType } from '../hooks/useTeamBuilder';

interface SkinSlotsProps {
  activeQueue: Queue;
  onSelectSkin: (type: SelectorType) => void;
}

const SkinSlots: React.FC<SkinSlotsProps> = ({ activeQueue, onSelectSkin }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Castle Skin */}
      <Card variant="filled" className="flex-1">
        <CardContent className="p-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <Castle className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="text-label-sm text-muted-foreground">Castle Skin</div>
              <div className="text-title-sm font-semibold">
                {activeQueue.castleSkinId ? SKINS.find(s => s.id === activeQueue.castleSkinId)?.name : 'Default'}
              </div>
            </div>
          </div>
          <Button variant="tonal" size="sm" onClick={() => onSelectSkin('castle')}>
            Change
          </Button>
        </CardContent>
      </Card>

      {/* March Skin */}
      <Card variant="filled" className="flex-1">
        <CardContent className="p-4 flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-500/20 flex items-center justify-center">
              <Flag className="w-6 h-6 text-warning-400" />
            </div>
            <div>
              <div className="text-label-sm text-muted-foreground">March Skin</div>
              <div className="text-title-sm font-semibold">
                {activeQueue.marchSkinId ? SKINS.find(s => s.id === activeQueue.marchSkinId)?.name : 'Default'}
              </div>
            </div>
          </div>
          <Button variant="tonal" size="sm" onClick={() => onSelectSkin('march')}>
            Change
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkinSlots;
